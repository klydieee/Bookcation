<div align="center">

<!-- Brand mark inline SVG so it renders on GitHub without a hosted asset -->
<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" rx="200" fill="#2F3DF5"/>
  <g transform="translate(512 512) scale(11) translate(-32 -32)">
    <path d="M14 6H50a4 4 0 0 1 4 4V58L32 44 10 58V10a4 4 0 0 1 4-4Z" fill="#FFFFFF"/>
    <path d="M22 37C22 26 31 20 43 18" fill="none" stroke="#2F3DF5" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 5.2"/>
    <circle cx="22" cy="37" r="3" fill="#2F3DF5"/>
    <circle cx="43" cy="18" r="4.2" fill="#FFB020"/>
  </g>
</svg>

# Bookcation

**Gate to plate.**

Flights, hotels, restaurant reservations, and catering on one editable trip plan.  
Fork it. Compare versions. Book everything in one checkout.

[![Build all platforms](https://github.com/klydieee/Bookcation/actions/workflows/release.yml/badge.svg)](https://github.com/klydieee/Bookcation/actions/workflows/release.yml)
[![Release v2.0.2](https://img.shields.io/github/v/release/klydieee/Bookcation?color=2F3DF5&label=latest)](https://github.com/klydieee/Bookcation/releases/latest)
[![License MIT](https://img.shields.io/badge/license-MIT-FFB020)](LICENSE)

---

### Download v2.0.2

| Platform | Download | Status |
|:---:|:---|:---:|
| 🪟 **Windows** | [Bookcation_2.0.2_x64-setup.exe](https://github.com/klydieee/Bookcation/releases/download/v2.0.2/Bookcation_2.0.2_x64-setup.exe) · [.msi](https://github.com/klydieee/Bookcation/releases/download/v2.0.2/Bookcation_2.0.2_x64_en-US.msi) | ✅ Ready |
| 🤖 **Android** | [app-debug.apk](https://github.com/klydieee/Bookcation/releases/download/v2.0.2/app-debug.apk) | ✅ Ready |
| 🌐 **Browser** | [Open Bookcation →](https://bookcation.vercel.app) | ✅ Ready |
| 🍎 **macOS** | [View Apple silicon and Intel installers](https://github.com/klydieee/Bookcation/releases/tag/v2.0.2) | ✅ Ready |
| 🐧 **Linux** | [View release assets](https://github.com/klydieee/Bookcation/releases/tag/v2.0.2) | ✅ Ready |
| 📱 **iOS** | Needs Apple signing | ⏳ |

> **Demo mode** — all builds use sample data. Bookings are simulated and nothing is charged.

</div>

---

## What it does

Bookcation is a trip-planning app where every bookable thing — flights, hotels, restaurant reservations, and catering — lives on one day-by-day canvas.

| Feature | Description |
|---|---|
| ✈️ **Flights** | Search by airport, compare fares by stops and time |
| 🛏️ **Hotels** | Browse by city, pick a room type, add nights to your plan |
| 🍴 **Food** | Reserve a table, schedule pickup, or order delivery |
| 🍳 **Catering** | Slide the headcount, compare per-person quotes |
| 🗺️ **Trips** | Day-by-day canvas with drag-between-days |
| 🍴 **Fork & Compare** | Copy a plan into Plan B, compare cost and item deltas |
| ⚠️ **Clash detection** | Flags a dinner booked while you are still in the air |
| 🎟️ **Bookings wallet** | Boarding-pass cards with QR reference after checkout |

---

## Installation

### 🌐 Web / PWA (no install needed)

Open in any current browser — no account required.

```
https://bookcation.vercel.app
```

To install as a PWA:
- **Chrome / Edge** — click the install icon in the address bar
- **iPhone / iPad** — tap Share → Add to Home Screen

---

### 🪟 Windows

#### Option A — GUI installer (recommended)

1. Download **[Bookcation_2.0.2_x64-setup.exe](https://github.com/klydieee/Bookcation/releases/download/v2.0.2/Bookcation_2.0.2_x64-setup.exe)**
2. Run the installer
3. If Windows SmartScreen appears, click **More info → Run anyway**
   > The app is unsigned in this preview build. This warning is expected until a code-signing certificate is added.
4. Bookcation opens automatically after install

#### Option B — MSI package

1. Download **[Bookcation_2.0.2_x64_en-US.msi](https://github.com/klydieee/Bookcation/releases/download/v2.0.2/Bookcation_2.0.2_x64_en-US.msi)**
2. Double-click the `.msi` file and follow the wizard

#### Option C — CLI (winget)

```powershell
# Once the app is listed in the winget community repo:
winget install klydieee.Bookcation
```

> Not yet published to winget. Use the GUI installer in the meantime.

#### Option D — Build from source

```powershell
git clone https://github.com/klydieee/Bookcation.git
cd Bookcation
npm install
npm run tauri:build
# Installers land in src-tauri/target/release/bundle/
```

Requirements: [Node.js 20+](https://nodejs.org), [Rust stable](https://rustup.rs), WebView2 (preinstalled on Windows 10/11)

---

### 🤖 Android

#### Option A — GUI (direct APK sideload)

1. Download **[app-debug.apk](https://github.com/klydieee/Bookcation/releases/download/v2.0.2/app-debug.apk)**
2. Open the file on your Android device
3. When prompted, tap **Allow from this source** (Settings → Apps → Special access → Install unknown apps → your browser → Allow)
4. Tap **Install**

#### Option B — ADB (CLI)

```bash
# Connect your Android device via USB with USB debugging enabled
adb install app-debug.apk
```

Download ADB: [Android Platform Tools](https://developer.android.com/tools/releases/platform-tools)

#### Option C — Build from source

```bash
git clone https://github.com/klydieee/Bookcation.git
cd Bookcation
npm install
npm run build
npx cap sync android
# Open in Android Studio, or:
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

Requirements: [Node.js 20+](https://nodejs.org), [JDK 17 or 21](https://adoptium.net), Android SDK (via [Android Studio](https://developer.android.com/studio))

---

### 🍎 macOS

#### GUI

1. Download the `.dmg` matching your Mac's processor from the [v2.0.2 release assets](https://github.com/klydieee/Bookcation/releases/tag/v2.0.2).
2. Open the `.dmg` and drag **Bookcation** to Applications
3. If macOS blocks the first launch, right-click the app → **Open**

#### CLI (Homebrew — planned)

```bash
# Planned, not yet available:
brew install --cask bookcation
```

#### Build from source (macOS)

```bash
git clone https://github.com/klydieee/Bookcation.git
cd Bookcation
npm install
npm run tauri:build
# DMG: src-tauri/target/release/bundle/dmg/
```

Requirements: [Node.js 20+](https://nodejs.org), [Rust stable](https://rustup.rs), Xcode Command Line Tools (`xcode-select --install`)

---

### 🐧 Linux

Download the `.deb` or `.AppImage` from the [v2.0.2 release assets](https://github.com/klydieee/Bookcation/releases/tag/v2.0.2).

#### Option A — AppImage (GUI, all distros)

```bash
# Download AppImage from releases, then:
chmod +x Bookcation_*.AppImage
./Bookcation_*.AppImage
```

#### Option B — Debian / Ubuntu (.deb)

```bash
sudo dpkg -i Bookcation_*.deb
# Or:
sudo apt install ./Bookcation_*.deb
```

#### Option C — Build from source (Docker, any host OS)

```bash
git clone https://github.com/klydieee/Bookcation.git
cd Bookcation
npm install && npm run build
# Requires Docker Desktop running:
pwsh scripts/build-linux-docker.ps1
# Artifacts: dist-linux/*.deb and dist-linux/*.AppImage
```

#### Option D — Build from source (Linux host)

```bash
# Install system deps (Debian/Ubuntu):
sudo apt-get install -y libwebkit2gtk-4.1-dev libgtk-3-dev \
  libayatana-appindicator3-dev librsvg2-dev libssl-dev build-essential

git clone https://github.com/klydieee/Bookcation.git
cd Bookcation
npm install
npm run tauri:build
# Artifacts: src-tauri/target/release/bundle/
```

Requirements: [Node.js 20+](https://nodejs.org), [Rust stable](https://rustup.rs)

---

### 📱 iOS

> ⏳ Needs Apple signing credentials. Project is scaffolded and compiles on a macOS runner, but a signed `.ipa` / TestFlight link is not yet available.

#### Build from source (macOS only)

```bash
git clone https://github.com/klydieee/Bookcation.git
cd Bookcation
npm install && npm run build
npx cap sync ios
npx cap open ios
# In Xcode: Product → Run (simulator) or Product → Archive (device)
```

Requirements: macOS, [Xcode](https://apps.apple.com/app/xcode/id497799835), [CocoaPods](https://cocoapods.org) (`sudo gem install cocoapods`)

---

## Development

```bash
# Clone
git clone https://github.com/klydieee/Bookcation.git
cd Bookcation

# Install dependencies
npm install

# Start the web dev server (http://localhost:5173)
npm run dev

# Start the Tauri desktop app in dev mode
npm run tauri:dev

# Typecheck
npm run typecheck

# Production web build
npm run build
```

Create a free Geoapify project to get an API key, copy `.env.example` to `.env.local`, and replace the placeholder value. Set the same `GEOAPIFY_API_KEY` in your Vercel project's environment variables for deployment. Do not commit the key; Geoapify uses it for nearby-place search and geocoding on the server. The map uses MapLibre GL with OpenFreeMap's Liberty vector style, which needs no map API key or billing account. OpenStreetMap data attribution is included on the map. See [OpenFreeMap](https://openfreemap.org/) for public service details.

Installed desktop and mobile apps use the hosted HTTPS nearby-search API; they need an internet connection for map tiles and live place results.

### Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styles | Tailwind CSS v4 (`@theme` tokens) |
| State | Zustand (localStorage persistence) |
| Routing | React Router 6 |
| Maps | MapLibre GL + OpenFreeMap Liberty style; Geoapify Places and Geocoding APIs |
| Icons | Phosphor Icons |
| Fonts | Bricolage Grotesque + Atkinson Hyperlegible Next (self-hosted) |
| Desktop | Tauri 2 |
| Mobile | Capacitor 6 |
| Effects | Fluent-style spotlight, reveal-border, acrylic, mica (custom CSS + hooks) |

### Project structure

```
Bookcation/
├── src/
│   ├── components/         # Shared UI (Ticket, Button, Surface, motion/)
│   ├── pages/
│   │   ├── app/            # App routes (Flights, Hotels, Food, Catering…)
│   │   └── marketing/      # Landing pages (Home, Download, Help…)
│   ├── store/              # Zustand stores (trips, session, prefs)
│   ├── lib/                # Types, mock data, API adapter, format helpers
│   └── styles/             # Tailwind + design tokens
├── src-tauri/              # Tauri 2 Rust shell
├── android/                # Capacitor Android project
├── ios/                    # Capacitor iOS project
├── docker/                 # Dockerfiles for cross-platform builds
├── scripts/                # Build helper scripts
└── .github/workflows/      # CI: builds all platforms on tag push
```

---

## CI / Release workflow

Pushing a tag (`v*`) triggers `.github/workflows/release.yml`, which builds every platform in parallel and attaches all artifacts to a GitHub Release:

```bash
git tag v2.0.2 -m "Bookcation 2.0.2"
git push origin v2.0.2
```

| Runner | Produces |
|---|---|
| `windows-latest` | `.exe` NSIS installer, `.msi` |
| `macos-latest` | Apple silicon and Intel `.dmg` installers |
| `ubuntu-22.04` | `.deb`, `.AppImage` |
| `ubuntu-latest` (Android) | `app-debug.apk` |
| `macos-latest` (iOS) | Unsigned simulator build (installable `.ipa` needs Apple signing secrets) |

---

## Demo mode

Every build runs in demo mode:

- Searches use deterministic sample data
- Bookings are simulated — no airline, restaurant, or caterer is contacted
- Nothing is charged
- Plans are stored on your device and can be erased in **Settings → Data → Reset demo data**

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
<sub>Gate to plate. · Built with Bookcation</sub>
</div>
