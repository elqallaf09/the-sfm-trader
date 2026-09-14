# Temporary, branch-scoped transport. Removed before merge.
import base64, gzip, hashlib, json, subprocess
from pathlib import Path
files = {
 'public/app.js': ('17c4f6028585c6eb14cf5eb96e6dd31d820dfe55d1f76e24e1306caebc35b906','696bc3b8c93c5c641b18a62e478e4d72a079e702ab8fbf9386cfcb30ae471f03'),
 'public/index.html': ('d6f345c4e4e1f091557fad9f658ea7f9c14c049a3d7f35b02f65c8ab06588c6e','a2e2dd12ea38140ee8b33b5951e3029eff11d332371ba3108719bceffb6c65bc'),
 'public/modules/instrumentSearch.js': ('325f6e268380c5c399e2b52d57af5c710105944ed0c836bdd04eea7abe560465','a418d38025f3f816b2b234f986352150b7c596bc08ccac2d9a465736d3e618e0'),
 'public/service-worker.js': ('6916ba77d7f40ca0a9b34dc060fcdde1f79800d9d7d86f3d2f220c21f184b033','c8883af2caa3580959adf547db64bd942de9d67306427d76a8a46772ada175ba'),
 'tests/asyncSelection.test.mjs': (None,'218fc2e4c7fd442fb9aa8721a854d831a01f6f6519809bb115b6450d50a06683'),
 'tests/layoutStability.test.mjs': ('bdfe3fbc43b14b2d38160877b31122a009df8d369a5035cc7e674bde9bcf1208','99ece01e33c40de29cec84ce93f10848b6cd84cf3599bdb57b6a76529cbb35ab'),
 'tools/capture-async-selection.mjs': (None,'ccd365433e718e48730cc96f0fc821b5e43168b5b4d32a5f09f096ef59c7db88'),
 'tools/capture-deep-audit.mjs': ('93cccf7b6fa7a2b0db04bba44cde07286970f3206e096daaf81d6ee5b696faff','16e1917ccdf4bce0c0c202254a119a17ea56f41c5f3b7e7b5abbd3fcbd05043d'),
 'tools/capture-issue40.mjs': ('8c90f1a7a83e1cd214eda7b77c817e24938b4e5287e3da976b2805feba065549','a2ee50dfc7c9f642372dfcd9c3d4a7da484a82a0fd268ef7f5ed09aae0c4d08d'),
 'tools/capture-lifecycle.mjs': ('ce5f99e29120de1c20845725648c4300e30e19002e8bb644f4da1a434971f257','e34bfaa9e09b43cd4243b4b18466f77fdaf7dd64b5852b90fe4f40ea2a96c919'),
 'tools/check.mjs': ('05345e860e471bad39ad569151214a522471794fe1634ffa98b997d99849dd48','e2e816927f19e739dc72336590799932b673ad9d39433f2d2296e6d02900cf8f')
}
assert len(files) == 11
for name,(before,after) in files.items():
 assert name.startswith(('public/','tests/','tools/')) and '..' not in Path(name).parts
 if before is None: assert not Path(name).exists(), name
 else: assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == before, name
patch = gzip.decompress(base64.b64decode(''.join(Path(f'.async-patch-{i}.txt').read_text().strip() for i in range(3)),validate=True))
assert hashlib.sha256(patch).hexdigest() == 'c95f5f6a9948ef132c648cf337c88075c78fecc07bc9b9dfdbfaf9da78013bc5'
subprocess.run(['git','apply','--check','-'],input=patch,check=True)
subprocess.run(['git','apply','-'],input=patch,check=True)
for name,(before,after) in files.items():
 assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == after,name
subprocess.run(['git','diff','--check'],check=True)
subprocess.run(['git','add','--',*files],check=True)
assert set(subprocess.check_output(['git','diff','--cached','--name-only'],text=True).splitlines()) == set(files)
subprocess.run(['git','commit','-m','fix: respect latest selections and remove unsupported dashboard metrics'],check=True)
subprocess.run(['git','push','origin','HEAD:refs/heads/fix/async-state-integrity'],check=True)
