import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bookcation.app",
  appName: "Bookcation",
  // The compiled web bundle (same dist that feeds web and Tauri).
  webDir: "dist",
  backgroundColor: "#F4F6FB",
  ios: {
    contentInset: "always",
  },
  android: {
    // Allows the app to render edge-to-edge with safe-area insets.
    adjustMarginsForEdgeToEdge: "auto",
  },
};

export default config;
