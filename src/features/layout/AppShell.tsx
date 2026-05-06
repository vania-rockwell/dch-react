import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import "./layout.scss";

export default function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <AppHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
      />

      <div className="app-shell__body">
        <AppSidebar collapsed={sidebarCollapsed} />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
