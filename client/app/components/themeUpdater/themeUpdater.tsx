'use client'
import { useTheme } from "next-themes"
import { useEffect } from "react"

export default function ThemeUpdater() {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;

    useEffect(() => {
      if (typeof window !== "undefined" && currentTheme) {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(currentTheme);
      }
    }, [currentTheme]);

    return null;
}
