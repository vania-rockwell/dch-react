import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  mode: "light" | "dark";
  setTheme: (theme: string) => void;
  setMode: (mode: "light" | "dark") => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType>(null!);

const THEME_STORAGE_KEY = "dch.theme";
const MODE_STORAGE_KEY = "dch.mode";
const VALID_THEMES = new Set(["kalypso", "thermofisher"]);

function readStoredTheme(): string {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value && VALID_THEMES.has(value)) {
      return value;
    }
  } catch {
    /* ignore */
  }
  return "kalypso";
}

function readStoredMode(): "light" | "dark" {
  try {
    const value = localStorage.getItem(MODE_STORAGE_KEY);
    if (value === "light" || value === "dark") {
      return value;
    }
  } catch {
    /* ignore */
  }
  return "light";
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState(readStoredTheme);
  const [mode, setModeState] = useState(readStoredMode);

  const setTheme = (next: string) => {
    const value = VALID_THEMES.has(next) ? next : "kalypso";
    setThemeState(value);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const setMode = (next: "light" | "dark") => {
    setModeState(next);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.mode = mode;
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
