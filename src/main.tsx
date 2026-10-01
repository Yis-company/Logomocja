import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router";
import App from "./App";
import "./styles.css";
const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
const Router = import.meta.env.VITE_PAGES ? HashRouter : BrowserRouter;
if (import.meta.env.VITE_PAGES) {
  const normalizeLegacyHash = () => {
    if (location.hash === "#examples") {
      history.replaceState(
        null,
        "",
        `${location.pathname}${location.search}#/examples`,
      );
    }
  };
  normalizeLegacyHash();
  window.addEventListener("hashchange", normalizeLegacyHash);
}
createRoot(root).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
