'use client';
import {  useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeUpdater() {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;

    useEffect(() => {
      if (typeof window !== "undefined") {
        document.documentElement.style.setProperty(
          "--background",
          currentTheme === "dark" ? "#141f24" : "#d7d5cf"
        );
        document.documentElement.style.setProperty(
          "--foreground",
          currentTheme === "dark" ? "#d7d5cf" : "#141f24"
        );
      }
    }, [currentTheme]);

    return null;
  }