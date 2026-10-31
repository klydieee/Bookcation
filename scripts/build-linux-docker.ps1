# Builds the Tauri Linux desktop installers (.deb + .AppImage) in Docker and
# extracts them to dist-linux/ on the host. Nothing but Docker is needed on the
# host; the whole Rust + Node toolchain lives in the image.
#
# Usage:  pwsh scripts/build-linux-docker.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$dockerfile = Join-Path $projectRoot "docker\linux-tauri.Dockerfile"
$outDir = Join-Path $projectRoot "dist-linux"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Write-Host "Building Tauri Linux installers in Docker (this is a long first build)..."
# BuildKit --output exports the final `artifacts` (scratch) stage to the host.
$env:DOCKER_BUILDKIT = "1"
docker build `
  -f $dockerfile `
  --target artifacts `
  --output "type=local,dest=$outDir" `
  $projectRoot

Write-Host ""
if (Test-Path $outDir) {
  Write-Host "Linux artifacts in dist-linux/:"
  Get-ChildItem $outDir -Recurse -Include *.deb, *.AppImage |
    Select-Object Name, @{n='MB';e={[math]::Round($_.Length/1MB,2)}}
}
