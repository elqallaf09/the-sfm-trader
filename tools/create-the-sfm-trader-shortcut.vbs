Option Explicit

Dim shell, command

Set shell = CreateObject("WScript.Shell")
command = "powershell -NoProfile -ExecutionPolicy Bypass -File ""C:\Users\User\the-sfm trader\tools\create-the-sfm-trader-shortcut.ps1"""

shell.Run command, 0, True
WScript.Echo "the-sfm trader shortcut refreshed"
