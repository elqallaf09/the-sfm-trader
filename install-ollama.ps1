param(
  [switch]$PullModel
)

$ErrorActionPreference = "Stop"

$model = $env:OLLAMA_MODEL
if (-not $model) {
  $model = "llama3.2:3b"
}

Write-Host "Checking Ollama..."

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "winget was not found. Install Ollama manually from https://ollama.com/download"
    exit 1
  }

  Write-Host "Installing Ollama with winget..."
  winget install --id Ollama.Ollama -e --silent --disable-interactivity --accept-package-agreements --accept-source-agreements
}

$ollama = Get-Command ollama -ErrorAction SilentlyContinue
if (-not $ollama) {
  Write-Host "Ollama may be installed, but PATH is not refreshed yet."
  Write-Host "Open a new PowerShell window and run: ollama pull $model"
  exit 0
}

if ($PullModel) {
  Write-Host "Pulling model $model ..."
  ollama pull $model
} else {
  Write-Host "Ollama command exists."
  Write-Host "Next run: ollama pull $model"
}

Write-Host "Done."
