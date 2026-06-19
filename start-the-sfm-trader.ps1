$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 4173
$url = "http://localhost:$port"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  try {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show("Node.js غير مثبت أو غير موجود في PATH.", "the-sfm trader") | Out-Null
  } catch {
    Write-Host "Node.js غير مثبت أو غير موجود في PATH."
    Start-Sleep -Seconds 5
  }
  exit 1
}

$isRunning = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $isRunning) {
  Start-Process -FilePath "node" -ArgumentList "server.mjs" -WorkingDirectory $root -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

Start-Process $url
