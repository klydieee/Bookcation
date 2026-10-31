# Builds the Tauri Linux desktop installers (.deb and .AppImage) in a clean
# Debian environment. Runs entirely in the container so nothing is needed on a
# Windows/macOS host beyond Docker.
#
# The build happens at `docker build` time; artifacts are copied out in the
# final stage so they can be extracted with a throwaway container (see
# scripts/build-linux-docker.ps1).

FROM rust:1.90-bookworm AS build

# Tauri 2 Linux system dependencies.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libssl-dev \
    build-essential \
    curl \
    wget \
    file \
    pkg-config \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Node.js 20 (for the frontend build).
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install JS deps first (better layer caching). Copy only manifests.
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the project. .dockerignore keeps host build dirs out so the
# Linux container never sees Windows-built node_modules / target.
COPY . .

# Build the web bundle, then compile + bundle the Tauri Linux targets.
# CARGO_BUILD_JOBS limits compiler parallelism to reduce peak memory, which
# keeps Docker Desktop (WSL2) stable on constrained hosts.
ENV CARGO_BUILD_JOBS=2
ENV CARGO_NET_RETRY=5
RUN npm run build
RUN npx tauri build --bundles deb appimage

# Collect artifacts into a predictable folder.
RUN mkdir -p /out \
    && find src-tauri/target/release/bundle -type f \( -name '*.deb' -o -name '*.AppImage' \) -exec cp {} /out/ \;

# Minimal final stage that just holds the artifacts for extraction.
FROM scratch AS artifacts
COPY --from=build /out/ /
