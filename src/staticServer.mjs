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
    if (!["GET", "HEAD"].includes(request.method || "GET")) {
      response.writeHead(405, {
        ...securityHeaders("text/plain; charset=utf-8", { hsts: production }),
        allow: "GET, HEAD"
      });
      return response.end("Method not allowed");
    }
    const headOnly = request.method === "HEAD";
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
          : "no-cache";
      if (request.headers["if-none-match"] === asset.etag) {
        response.writeHead(304, {
          ...securityHeaders(MIME_TYPES[extension] || "application/octet-stream", { html, hsts: production }),
          etag: asset.etag,
          "cache-control": cacheControl,
          vary: "Accept-Encoding"
        });
        return response.end();
      }
      const encoded = encode(request, asset, extension);
      response.writeHead(200, {
        ...securityHeaders(MIME_TYPES[extension] || "application/octet-stream", { html, hsts: production }),
        etag: asset.etag,
        "cache-control": cacheControl,
        vary: "Accept-Encoding",
        ...(encoded.compressed ? { "content-encoding": "br" } : {})
      });
      return response.end(headOnly ? undefined : encoded.body);
    } catch (error) {
      const status = error.code === "ENOENT" || error.code === "EISDIR" ? 404 : 500;
      response.writeHead(status, securityHeaders("text/plain; charset=utf-8", { hsts: production }));
      return response.end(headOnly ? undefined : status === 404 ? "Not found" : "Unable to load page");
    }
  };
}
