import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu,
  Home,
  BookOpen,
  SlidersHorizontal,
  FileText,
  Wrench,
  Settings,
  ShieldCheck,
  LogOut,
  User,
  type LucideIcon
} from "lucide-react";
import { APP_VERSION } from "@/config/version";
import menuData from "./menu.json";
import { MenuItemComponent } from "./MenuItemComponent";

type AppSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

const iconMap: Record<string, LucideIcon> = {
  Home,
  BookOpen,
  SlidersHorizontal,
  FileText,
  Wrench,
  Settings,
  ShieldCheck,
  LogOut,
  User,
};

export default function AppSidebar({
  collapsed,
  onToggleCollapsed,
}: AppSidebarProps) {
  const { t } = useTranslation("layout");
  const { t: tc } = useTranslation("common");
  const appVersion = APP_VERSION;
  const appVersionShort = `V${appVersion.replace(/^v/i, "")}`;

  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      {/* Top section: Logo and toggle */}
      <div className="app-sidebar__top">
        <div className="app-sidebar__logo">
          <img
            src={
              collapsed
                ? "/logo_rockwell_white.png"
                : "/logo_rockwell_white_complete.png"
            }
            alt="Rockwell"
            className={`app-sidebar__logo-img ${
              collapsed ? "app-sidebar__logo-img--collapsed" : ""
            }`}
          />
        </div>
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

      {/* Main navigation */}
      <nav
        className="sidebar-nav"
        aria-label={tc("aria.mainNavigation")}
      >
        {menuData.items.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            collapsed={collapsed}
            iconMap={iconMap}
          />
        ))}
      </nav>

      {/* Bottom section: User, Logout, Version */}
      <div className="app-sidebar__bottom">
        <NavLink
          to="/user"
          className={({ isActive }) =>
            `sidebar-link sidebar-link--user ${isActive ? "is-active" : ""}`
          }
          title={collapsed ? t("nav.user") : undefined}
        >
          <span className="sidebar-link__icon" aria-hidden="true">
            <User size={16} aria-hidden="true" />
          </span>
          <span className="sidebar-link__label">{t("nav.user")}</span>
        </NavLink>

        <NavLink
          to="/log-out"
          className={({ isActive }) =>
            `sidebar-link sidebar-link--logout ${isActive ? "is-active" : ""}`
          }
          title={collapsed ? t("nav.logOut") : undefined}
        >
          <span className="sidebar-link__icon" aria-hidden="true">
            <LogOut size={16} aria-hidden="true" />
          </span>
          <span className="sidebar-link__label">{t("nav.logOut")}</span>
        </NavLink>

        {!collapsed && (
          <p
            className="sidebar-version sidebar-version--expanded"
            title={`${t("nav.version")} ${appVersion}`}
          >
            {t("nav.version")} {appVersion}
          </p>
        )}

        {collapsed && (
          <p
            className="sidebar-version sidebar-version--collapsed"
            title={appVersionShort}
          >
            {appVersionShort}
          </p>
        )}
      </div>
    </aside>
  );
}
