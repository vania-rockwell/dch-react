import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import "./layout.scss";

export default function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches);
    };

    setIsMobileLayout(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const collapsed = sidebarCollapsed || isMobileLayout;

  return (
    <div className="app-shell">
      <div className="app-shell__body">
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
