import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { applyTheme, usePrefs } from "./store/prefsStore";
import { applyReduceMotionClass } from "./lib/motion";

// Keep the DOM theme + motion classes in sync with saved preference on load.
applyTheme(usePrefs.getState().theme);
applyReduceMotionClass(usePrefs.getState().reduceMotion);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
