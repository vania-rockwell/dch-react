import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  theme: string;
  mode: "light" | "dark";
  setTheme: (theme: string) => void;
  setMode: (mode: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("kalypso");
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
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