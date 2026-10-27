import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root application container");

const application = (
  <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")} ssrPath={window.location.pathname}>
    <App />
  </Router>
);

if (container.childElementCount > 0) {
  hydrateRoot(container, application);
} else {
  createRoot(container).render(application);
}
