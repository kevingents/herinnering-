import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor wraps the deployed web app in a native iOS/Android shell so it can
 * ship to the App Store / Play Store (built in CI via Codemagic).
 *
 * Because the app uses SSR, middleware and server actions it cannot be fully
 * static-exported, so the native shell loads the live site via `server.url`.
 * `capacitor/www` is a minimal loading/offline fallback bundle.
 *
 * Set these in CI (Codemagic env vars), not in code:
 *   CAP_APP_ID       e.g. nl.levendgraf.app   (permanent — must match Apple bundle ID)
 *   CAP_SERVER_URL   e.g. https://levendgraf.nl (the deployed production site)
 */
const config: CapacitorConfig = {
  appId: process.env.CAP_APP_ID ?? "nl.levendgraf.app",
  appName: "Everloom",
  webDir: "capacitor/www",
  backgroundColor: "#0b0c0e",
  ios: {
    contentInset: "always",
    backgroundColor: "#0b0c0e",
  },
  android: {
    backgroundColor: "#0b0c0e",
  },
  ...(process.env.CAP_SERVER_URL
    ? { server: { url: process.env.CAP_SERVER_URL, cleartext: false } }
    : {}),
};

export default config;
