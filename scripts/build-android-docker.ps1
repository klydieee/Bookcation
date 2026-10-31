# Builds the Android debug APK inside a Linux container with the Android SDK
# and JDK 17, so no SDK/JDK needs to be installed on the host.
#
# Prerequisites: Docker Desktop running; `npm run build` and `npx cap sync android`
# already run on the host (web assets must be in android/app/src/main/assets/public).
#
# Usage:  pwsh scripts/build-android-docker.ps1 [assembleDebug|bundleRelease]

param(
  [string]$Task = "assembleDebug"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$image = "ghcr.io/cirruslabs/android-sdk:34"

Write-Host "Building web bundle and syncing Capacitor on host..."
Push-Location $projectRoot
try {
  npm run build
  npx cap sync android
} finally {
  Pop-Location
}

Write-Host "Running Gradle $Task in $image ..."
# Mount the project; run gradle from the android/ dir. Gradle caches persist in
# a named volume so repeat builds are fast.
docker run --rm `
  -v "${projectRoot}:/project" `
  -v "bookcation-gradle-cache:/root/.gradle" `
  -w /project/android `
  $image `
  bash -lc "./gradlew $Task --no-daemon"

$apk = Join-Path $projectRoot "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apk) {
  $mb = [math]::Round((Get-Item $apk).Length / 1MB, 2)
  Write-Host "APK built: $apk ($mb MB)"
} else {
  Write-Host "Build finished; check android/app/build/outputs/ for artifacts."
}
