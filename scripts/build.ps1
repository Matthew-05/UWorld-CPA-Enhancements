# Packages the unpacked extension in src/ into a Chrome Web Store upload zip.
# The manifest lands at the ZIP root and test files are excluded.

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'src'
$dist = Join-Path $root 'dist'

if (-not (Test-Path $src)) {
  throw "Source folder not found: $src"
}

$manifest = Get-Content (Join-Path $src 'manifest.json') -Raw | ConvertFrom-Json
$zip = Join-Path $dist ("uworld-cpa-enhancements-{0}.zip" -f $manifest.version)

if (-not (Test-Path $dist)) {
  New-Item -ItemType Directory -Path $dist | Out-Null
}
if (Test-Path $zip) {
  Remove-Item $zip -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$files = Get-ChildItem -Path $src -Recurse -File | Where-Object {
  $_.Name -notlike '*.test.*' -and $_.Name -ne '.DS_Store'
}

$archive = [System.IO.Compression.ZipFile]::Open($zip, 'Create')
try {
  foreach ($file in $files) {
    # Entry names must use forward slashes and be relative to src/.
    $relative = $file.FullName.Substring($src.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive, $file.FullName, $relative
    ) | Out-Null
  }
} finally {
  $archive.Dispose()
}

Write-Host ("Built {0}" -f $zip)
Write-Host ("  version {0}, {1} files" -f $manifest.version, $files.Count)
$files | ForEach-Object { Write-Host ("    " + $_.FullName.Substring($src.Length + 1)) }
