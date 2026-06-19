param(
  [Parameter(Mandatory = $true)]
  [string]$Url
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$configPath = Join-Path $projectRoot "capacitor.config.json"

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "capacitor.config.json not found at $configPath"
}

$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
if (-not $config.server) {
  $config | Add-Member -MemberType NoteProperty -Name server -Value ([pscustomobject]@{})
}

$config.server.url = $Url
$config.server.cleartext = $Url.StartsWith("http://")
$config | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $configPath -Encoding UTF8

Write-Host "Updated iOS server URL to: $Url"
Write-Host "Run: npm run ios:sync"
