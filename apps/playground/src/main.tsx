import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "stoop-ui";

import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
