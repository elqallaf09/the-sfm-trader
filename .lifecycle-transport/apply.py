import base64, gzip, hashlib, json, pathlib, subprocess
root = pathlib.Path('.')
manifest = json.loads((root / '.lifecycle-transport/manifest.json').read_text())
assert len(manifest) == 16
for name, checks in manifest.items():
    path = root / name
    assert not path.is_absolute() and '..' not in path.parts
    assert name.startswith(('public/', 'tests/', 'tools/'))
    actual = hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else None
    assert actual == checks['before'], 'Preimage changed: ' + name
encoded = ''.join((root / f'.lifecycle-transport/part{i}.b64').read_text().strip() for i in range(4))
compressed = base64.b64decode(encoded, validate=True)
assert hashlib.sha256(compressed).hexdigest() == '1d520088a62a5e5860ec4813addc36026412f042f86705868169a7e803942d6b', 'Transport checksum mismatch'
patch = gzip.decompress(compressed)
subprocess.run(['git', 'apply', '--check', '-'], input=patch, check=True)
subprocess.run(['git', 'apply', '-'], input=patch, check=True)
for name, checks in manifest.items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == checks['after'], 'Output differs: ' + name
    print('Verified tested bytes:', name)
subprocess.run(['git', 'diff', '--check'], check=True)
subprocess.run(['git', 'add', '--', *manifest], check=True)
staged = subprocess.check_output(['git', 'diff', '--cached', '--name-only'], text=True).splitlines()
assert set(staged) == set(manifest), 'Unexpected staged files'
subprocess.run(['git', 'commit', '-m', 'fix: revalidate live views and preserve truthful trade observations'], check=True)
subprocess.run(['git', 'push', 'origin', 'HEAD:refs/heads/fix/lifecycle-observation-integrity'], check=True)
