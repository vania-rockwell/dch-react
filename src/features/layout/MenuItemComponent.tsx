import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, type LucideIcon } from "lucide-react";

export type MenuItem = {
  id: string;
  path?: string;
  labelKey: string;
  icon?: string;
  children?: MenuItem[];
  level?: number;
  end?: boolean;
};

type MenuItemProps = {
  item: MenuItem;
  collapsed: boolean;
  iconMap: Record<string, LucideIcon>;
  parentPath?: string;
};

export function MenuItemComponent({
  item,
  collapsed,
  iconMap,
  parentPath,
}: MenuItemProps) {
  const { t } = useTranslation("layout");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = item.icon ? iconMap[item.icon] : null;
  const level = item.level || 1;
  const firstSecondLevelPath = item.children?.find((child) => child.path)?.path;
  const targetPath =
    level === 1 && firstSecondLevelPath ? firstSecondLevelPath : (item.path || "#");

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleTopLevelClick = () => {
    if (hasChildren && level === 1) {
      setIsOpen(true);
    }
  };

  const hasActiveDescendant = (menuItem: MenuItem, pathname: string): boolean => {
    if (!menuItem.children?.length) {
      return false;
    }

    return menuItem.children.some((child) => {
      if (child.path === pathname) {
        return true;
      }
      return hasActiveDescendant(child, pathname);
    });
  };

  // Group without direct path
  if (!item.path && hasChildren) {
    return (
      <div className={`sidebar-menu-group sidebar-menu-group--level-${level}`}>
        <button
          type="button"
          className={`sidebar-menu-toggle ${isOpen ? "is-open" : ""}`}
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          <span className="sidebar-menu-toggle__icon">
            <ChevronDown size={16} aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="sidebar-menu-toggle__label">{t(item.labelKey)}</span>
          )}
        </button>
        {isOpen && !collapsed && (
          <div className="sidebar-menu-submenu">
            {item.children?.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                collapsed={collapsed}
                iconMap={iconMap}
                parentPath={parentPath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular link
  return (
    <div
      className={`sidebar-link-wrapper sidebar-link-wrapper--level-${level}`}
    >
      <NavLink
        to={targetPath}
        end={item.end ?? true}
        className={({ isActive }) =>
          {
            const shouldHighlight =
              (isActive && !(level === 1 && hasChildren)) ||
              (level === 1 && hasActiveDescendant(item, location.pathname));

            return `sidebar-link sidebar-link--level-${level} ${
              shouldHighlight ? "is-active" : ""
            }`;
          }
        }
        title={collapsed ? t(item.labelKey) : undefined}
        onClick={
          hasChildren
            ? (level === 1 ? handleTopLevelClick : handleToggle)
            : undefined
        }
      >
        {IconComponent && level === 1 && (
          <span className="sidebar-link__icon" aria-hidden="true">
            <IconComponent size={16} aria-hidden="true" />
          </span>
        )}
        {!collapsed && (
          <span className="sidebar-link__label">{t(item.labelKey)}</span>
        )}
        {hasChildren && !collapsed && (
          <span className={`sidebar-link__chevron ${isOpen ? "is-open" : ""}`}>
            <ChevronDown size={14} aria-hidden="true" />
          </span>
        )}
      </NavLink>
      {hasChildren && isOpen && !collapsed && (
        <div className="sidebar-link-submenu">
          {item.children?.map((child) => (
            <MenuItemComponent
              key={child.id}
              item={child}
              collapsed={collapsed}
              iconMap={iconMap}
              parentPath={item.path}
            />
          ))}
        </div>
      )}
    </div>
  );
}
