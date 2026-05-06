import {
  BookOpen,
  FileText,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type layoutLocale from "../../locales/en/layout.json";

type NavId = keyof typeof layoutLocale.nav;

export type NavItem = {
  path: string;
  labelKey: `nav.${NavId}`;
  icon: LucideIcon;
  end?: boolean;
};

export const navItems: NavItem[] = [
  { path: "/", labelKey: "nav.dashboard", icon: Home, end: true },
  { path: "/catalogs", labelKey: "nav.catalogs", icon: BookOpen },
  { path: "/parameters", labelKey: "nav.parameters", icon: SlidersHorizontal },
  { path: "/templates", labelKey: "nav.templates", icon: FileText },
  {
    path: "/asset-configuration",
    labelKey: "nav.assetConfiguration",
    icon: Wrench,
  },
  { path: "/application", labelKey: "nav.application", icon: Settings },
  { path: "/security", labelKey: "nav.security", icon: ShieldCheck },
  { path: "/log-out", labelKey: "nav.logOut", icon: LogOut },
];
