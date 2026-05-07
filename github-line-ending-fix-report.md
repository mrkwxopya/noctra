# Git Line Ending Fix Report

Generated: 2026-05-07T05:03:57+03:00

## Applied

- Added .gitattributes
- Set repository core.autocrlf=false
- Set repository core.eol=lf
- Set repository core.safecrlf=false
- Git commands are now executed through Invoke-GitSafe, so CRLF/LF warnings do not crash PowerShell.

## Reason

Git on Windows writes line-ending warnings to stderr. PowerShell may treat stderr as a NativeCommandError when $ErrorActionPreference = "Stop".