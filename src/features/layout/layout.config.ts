export type NavItem = {
  path: string;
  label: string;
  icon: string;
  end?: boolean;
};

export const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: "D", end: true },
  { path: "/reports", label: "Reports", icon: "R" },
  { path: "/users", label: "Users", icon: "U" },
  { path: "/settings", label: "Settings", icon: "S" },
  { path: "/support", label: "Support", icon: "H" },
];
