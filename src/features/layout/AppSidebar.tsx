import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { navItems } from "./layout.config";

type AppSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export default function AppSidebar({
  collapsed,
  onToggleCollapsed,
}: AppSidebarProps) {
  const { t } = useTranslation("layout");
  const { t: tc } = useTranslation("common");

  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="app-sidebar__top">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleCollapsed}
          aria-label={
            collapsed ? tc("aria.expandMenu") : tc("aria.collapseMenu")
          }
        >
          <Menu size={18} aria-hidden="true" />
          <span className="sidebar-toggle__label">
            {t("brand.appName")}
          </span>
        </button>
      </div>

      <nav
        className="sidebar-nav"
        aria-label={tc("aria.mainNavigation")}
      >
        {navItems.map((item) => {
          const label = t(item.labelKey);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "is-active" : ""}`
              }
              title={collapsed ? label : undefined}
            >
              <span className="sidebar-link__icon" aria-hidden="true">
                <item.icon size={16} aria-hidden="true" />
              </span>
              <span className="sidebar-link__label">{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
