# Building and packaging Bookcation

One codebase and one `dist/` build output feed every target. The web build is
produced by Vite; desktop by Tauri 2; mobile by Capacitor.

```
npm install        # install JS dependencies
npm run build      # produce the web bundle in dist/ (feeds every target)
```

## Target status in this repository

| Target | Tooling | Builds on | Status here |
|---|---|---|---|
| Web / PWA | Vite | any OS | ✅ built (`dist/`) |
| Windows | Tauri 2 | Windows | ✅ built (`.msi` + `.exe`) |
| macOS | Tauri 2 | macOS | ⚙️ configured, build on a Mac |
| Linux | Tauri 2 | Linux | ⚙️ configured, build on Linux |
| Android | Capacitor | any OS w/ Android SDK + JDK 17/21 | ⚙️ scaffolded (`android/`) |
| iOS | Capacitor | macOS + Xcode | ⚙️ scaffolded (`ios/`) |

Tauri cannot cross-compile between desktop OSes; each desktop installer must be
produced on its own OS (or in CI with per-OS runners).

---

## Web / PWA

```
npm run build
npm run preview            # smoke test the production bundle locally
```

Deploy `dist/` to any static host. For Vercel, `vercel.json` already rewrites
all routes to `index.html` for client-side routing. The app installs as a PWA
via `public/manifest.webmanifest`.

## Desktop (Tauri 2)

Prerequisites: Rust toolchain (`rustup`), and the OS WebView:

- Windows: WebView2 (preinstalled on Windows 10/11) + the MSVC build tools.
- macOS: Xcode command line tools.
- Linux: `libwebkit2gtk-4.1-dev`, `build-essential`, `libssl-dev`,
  `libayatana-appindicator3-dev`, `librsvg2-dev` (names vary by distro).

```
npm run tauri:dev          # run the desktop app in development
npm run tauri:build        # produce installers for the current OS
```

Artifacts land in `src-tauri/target/release/bundle/`:

- Windows: `msi/Bookcation_<ver>_x64_en-US.msi`, `nsis/Bookcation_<ver>_x64-setup.exe`
- macOS: `dmg/Bookcation_<ver>_x64.dmg` (build on a Mac; use a universal target
  `rustup target add aarch64-apple-darwin x86_64-apple-darwin` for universal)
- Linux: `deb/*.deb`, `appimage/*.AppImage` (build on Linux)

App identifier: `com.bookcation.app` (placeholder — confirm before release).
Code signing is **not** configured; first launch will show an unsigned-app
warning until signing certificates are added.

## Mobile (Capacitor)

> Note: the product brief references "Capacitor 8". The current stable major of
> Capacitor is 6, which this repo uses. Bump when a newer major ships.

The native projects are committed: `android/` and `ios/`. After any web change:

```
npm run build
npx cap sync               # copy dist/ into the native projects
```

### Android

Prerequisites: **JDK 17 or 21** (JDK 25 is too new for the bundled Gradle and
fails with "Unsupported class file major version 69"), plus the **Android SDK**
with `ANDROID_HOME` / `ANDROID_SDK_ROOT` set.

```
npm run android:build      # build web + cap sync android
npx cap open android       # open in Android Studio to run / build
# or, from the android/ folder:
./gradlew assembleDebug    # debug APK  -> android/app/build/outputs/apk/debug/
./gradlew bundleRelease    # Play Store .aab (requires a signing config)
```

### iOS

Prerequisites: **macOS** with **Xcode**, plus **CocoaPods** (`sudo gem install
cocoapods`). Cannot be built on Windows or Linux.

```
npm run ios:build          # build web + cap sync ios
npx cap open ios           # open App.xcworkspace in Xcode
# then Product > Archive to produce a TestFlight / App Store build
```

---

## Building in Docker (Android + Linux, from any host)

With Docker Desktop running you can build the Linux-based targets without
installing the Android SDK, a second JDK, or the Tauri Linux libraries on your
host.

### Android APK (containerized)

```
pwsh scripts/build-android-docker.ps1            # debug APK
pwsh scripts/build-android-docker.ps1 bundleRelease   # Play Store AAB (needs signing)
```

Uses `ghcr.io/cirruslabs/android-sdk:34` (JDK 17 + SDK 34). The web build and
`cap sync` run on the host; only Gradle runs in the container. Output:
`android/app/build/outputs/apk/debug/app-debug.apk`.

### Linux desktop (.deb + .AppImage, containerized)

```
pwsh scripts/build-linux-docker.ps1
```

Builds `docker/linux-tauri.Dockerfile` (Rust 1.85 + webkit2gtk) and extracts the
installers to `dist-linux/`. The whole toolchain lives in the image.

**Docker base image / Rust version:** the Tauri 2 crate graph has a high minimum
supported Rust version (currently 1.90). `docker/linux-tauri.Dockerfile` pins
`rust:1.90-bookworm`; if a future dependency bump requires newer, raise this tag
(the build error lists the required rustc).

**Docker troubleshooting:** large Rust builds are hard on Docker Desktop on
Windows/WSL2 and can surface `input/output error`, `Docker Desktop is unable to
start`, or `rpc error ... EOF` (daemon dropped mid-compile). Mitigations:
restart Docker Desktop; raise Settings → Resources disk size and CPU/memory;
`docker builder prune -f` to reclaim cache. If the local Docker build keeps
dropping, prefer the **CI path below** — the `ubuntu-22.04` runner builds the
Linux installers reliably on a clean machine and is the recommended way to
produce `.deb`/`.AppImage`.

> Status note: web, Windows (`.msi`/`.exe`), and Android (`.apk`) are built and
> verified. The Linux desktop build is fully configured but was not completed
> locally on the Windows host due to Docker Desktop instability under the heavy
> Rust compile; build it via CI (recommended) or on a Linux host / a healthy
> Docker install.

## Continuous integration (every platform, incl. macOS + iOS)

`.github/workflows/release.yml` builds everything on tag push (`v*`) or manual
dispatch:

| Job | Runner | Produces |
|---|---|---|
| web | ubuntu | `dist/` bundle |
| desktop | macos / windows / ubuntu matrix | `.dmg`, `.msi`, `-setup.exe`, `.deb`, `.AppImage` |
| android | ubuntu + Android SDK | debug `.apk` (AAB once signing secrets are added) |
| ios | macos | compiles the project; a signed `.ipa` needs Apple credentials in secrets |
| release | ubuntu | attaches all artifacts to a GitHub Release |

CI is the only way to get the macOS `.dmg` and the iOS build without a Mac in
hand. To sign:

- **macOS/Windows**: add signing certs as secrets and configure Tauri's
  `bundle > macOS`/`windows` signing fields.
- **Android release AAB**: add a keystore secret and a signing config in
  `android/app/build.gradle`, then enable the `bundleRelease` step.
- **iOS**: add an Apple Developer cert + provisioning profile (e.g. via
  `apple-actions/import-codesign-certs`) and an `exportArchive` step.
