import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SpeedInsights>
      <Router>
        <App />
      </Router>
    </SpeedInsights>
  </StrictMode>
);
