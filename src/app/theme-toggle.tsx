"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getAppliedTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Hydration must begin with the same label as SSR, then reflect the inline theme script.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getAppliedTheme());
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = getAppliedTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("magnetic-builds-theme", nextTheme);
    setTheme(nextTheme);
  }

  const nextThemeLabel = theme === "dark" ? "light" : "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextThemeLabel} mode`}
      title={`Switch to ${nextThemeLabel} mode`}
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
