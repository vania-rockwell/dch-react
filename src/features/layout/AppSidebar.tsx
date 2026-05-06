import { NavLink } from "react-router-dom";
import { navItems } from "./layout.config";

type AppSidebarProps = {
  collapsed: boolean;
};

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "is-active" : ""}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-link__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar-link__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
