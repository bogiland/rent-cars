"use client"; // context provider boundary

import { createContext, useContext } from "react";

type Theme = "light";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

/**
 * Light-only theme. The dark variant was used during early prototyping and
 * persisted in localStorage, which forced the whole site dark on load.
 * We now hard-lock to light and clear any stale stored preference once.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", "light");
    try {
      localStorage.removeItem("apex-theme");
    } catch {
      /* ignore */
    }
  }
  return <ThemeCtx.Provider value={{ theme: "light", toggle: () => {} }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
