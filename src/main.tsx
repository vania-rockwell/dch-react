import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./locales/i18n";
import "./index.css";
import { ThemeProvider } from "./app/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
