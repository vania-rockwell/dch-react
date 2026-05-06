import { useTheme } from "../theme/ThemeProvider";
import { Button } from "../../components/Button/Button";
import Select from "../../components/Select/Select";

type AppHeaderProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export default function AppHeader({
  sidebarCollapsed,
  onToggleSidebar,
}: AppHeaderProps) {
  const { theme, mode, setTheme, setMode } = useTheme();
  const themeOptions = [
    { value: "kalypso", label: "Kalypso" },
    { value: "thermofisher", label: "Thermofisher" },
  ];

  return (
    <header className="app-header">
      <div className="app-header__left">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {sidebarCollapsed ? "Expand" : "Collapse"}
        </Button>
        <div>
          <p className="app-title">DCH</p>
          <p className="app-subtitle">Data Configuration Hub</p>
        </div>
      </div>

      <div className="app-header__right">
        <label className="field-inline" htmlFor="theme-select">
          Theme
          <Select
            id="theme-select"
            size="sm"
            value={theme}
            options={themeOptions}
            onChange={(event) => setTheme(event.target.value)}
          />
        </label>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          aria-label="Toggle color mode"
        >
          {mode === "light" ? "Dark mode" : "Light mode"}
        </Button>
      </div>
    </header>
  );
}
