import { useEffect, useState } from "react";
export type Theme = "light" | "dark";
export const THEME_KEY = "logomocja.theme.v1";
export function readTheme(storage: Pick<Storage, "getItem">): Theme | null {
  try {
    const value = storage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [selected, setSelected] = useState(
    () => readTheme({ getItem: (key) => localStorage.getItem(key) }) !== null,
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  useEffect(() => {
    if (selected) return;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => setTheme(media.matches ? "dark" : "light");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [selected]);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setSelected(true);
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* Session selection remains usable. */
    }
  };
  return { theme, toggle };
}
export const stagePalette = {
  light: { grid: "#d8e1da", axis: "#c8d6cc", halo: "#ffffff" },
  dark: { grid: "#324c3b", axis: "#67886b", halo: "#233c2c" },
};
