import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard", end: true },
  { path: "/reports", label: "Reports" },
  { path: "/settings", label: "Settings" },
  { path: "/users", label: "Users" },
  { path: "/support", label: "Support" },
];

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <aside className="app-sidebar">
      <div className="sidebar-section">
        <button
          type="button"
          className="sidebar-toggler"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
        >
          <span>Menu</span>
          <span className={`chevron ${menuOpen ? "open" : ""}`}>▾</span>
        </button>

        {menuOpen && (
          <nav className="sidebar-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
}
