import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import ErrorBoundary from "./components/ErrorBoundary";

try {
  console.log('Zorvyn: main.jsx executing');
  try { localStorage.setItem('zorvyn_stage','main_loaded'); } catch (e) {}
} catch (e) {}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
