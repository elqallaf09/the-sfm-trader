import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { brotliCompressSync, constants as zlibConstants } from "node:zlib";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".svg", ".webmanifest"]);
const LONG_LIVED = new Set([".png", ".jpg", ".jpeg", ".svg", ".ico", ".woff", ".woff2"]);

export function createStaticServer({ publicDir, production, securityHeaders }) {
  const assetCache = new Map();

  function encode(request, asset, extension) {
    const acceptsBrotli = /(?:^|,)\s*br\s*(?:,|$)/i.test(String(request?.headers?.["accept-encoding"] || ""));
    if (!COMPRESSIBLE.has(extension) || !acceptsBrotli || asset.file.length < 1024) {
      return { body: asset.file, compressed: false };
    }
    asset.brotli ||= brotliCompressSync(asset.file, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 4 } });
    return { body: asset.brotli, compressed: true };
  }

  async function loadAsset(requestedPath) {
    let asset = production ? assetCache.get(requestedPath) : null;
    if (asset) return asset;
    const file = await readFile(requestedPath);
    asset = { file, etag: `"${crypto.createHash("sha256").update(file).digest("base64url")}"`, brotli: null };
    if (production) assetCache.set(requestedPath, asset);
    return asset;
  }

  return async function serveStatic(request, response, pathname) {
    const safePath = pathname === "/" ? "/index.html" : pathname;
    const requestedPath = path.normalize(path.join(publicDir, safePath));
    const relative = path.relative(publicDir, requestedPath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      response.writeHead(403, securityHeaders("text/plain; charset=utf-8", { hsts: production }));
      return response.end("Forbidden");
    }

    try {
      const asset = await loadAsset(requestedPath);
      const extension = path.extname(requestedPath).toLowerCase();
      const html = extension === ".html";
      const cacheControl = html
        ? "no-cache"
        : LONG_LIVED.has(extension)
          ? "public, max-age=86400, stale-while-revalidate=604800"
          : "public, max-age=300, stale-while-revalidate=86400";
      if (request.headers["if-none-match"] === asset.etag) {
        response.writeHead(304, { etag: asset.etag, "cache-control": cacheControl });
        return response.end();
      }
      const encoded = encode(request, asset, extension);
      response.writeHead(200, {
        ...securityHeaders(MIME_TYPES[extension] || "application/octet-stream", { html, hsts: production }),
        etag: asset.etag,
        "cache-control": cacheControl,
        ...(encoded.compressed ? { "content-encoding": "br", vary: "Accept-Encoding" } : {})
      });
      return response.end(encoded.body);
    } catch {
      if (path.extname(requestedPath)) {
        response.writeHead(404, securityHeaders("text/plain; charset=utf-8", { hsts: production }));
        return response.end("Not found");
      }
      const fallbackPath = path.join(publicDir, "index.html");
      const fallback = await loadAsset(fallbackPath);
      const encoded = encode(request, fallback, ".html");
      response.writeHead(200, {
        ...securityHeaders(MIME_TYPES[".html"], { html: true, hsts: production }),
        "cache-control": "no-cache",
        ...(encoded.compressed ? { "content-encoding": "br", vary: "Accept-Encoding" } : {})
      });
      return response.end(encoded.body);
    }
  };
}
