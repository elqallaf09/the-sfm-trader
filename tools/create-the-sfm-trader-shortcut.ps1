$ErrorActionPreference = "Stop"

$shell = New-Object -ComObject WScript.Shell
$desktop = $shell.SpecialFolders.Item("Desktop")
$appRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$tempShortcutPath = Join-Path $appRoot "the-sfm trader.lnk"
$desktopShortcutPath = Join-Path $desktop "the-sfm trader.lnk"

$shortcut = $shell.CreateShortcut($tempShortcutPath)
$shortcut.TargetPath = "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File ""$appRoot\start-the-sfm-trader.ps1"""
$shortcut.WorkingDirectory = $appRoot
$shortcut.IconLocation = "$appRoot\assets\the-sfm-trader-icon.ico,0"
$shortcut.Description = "the-sfm trader"
$shortcut.WindowStyle = 7
$shortcut.Save()

Move-Item -LiteralPath $tempShortcutPath -Destination $desktopShortcutPath -Force

foreach ($oldName in @("THE-SFM.bat", "THE SFM.lnk", "THE-SFM.lnk")) {
  $oldPath = Join-Path $desktop $oldName
  if (Test-Path -LiteralPath $oldPath) {
    attrib +h $oldPath
  }
}

Write-Output $desktopShortcutPath
