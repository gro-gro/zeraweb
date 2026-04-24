"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);

    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme, mounted]);

  const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "system", label: "System", Icon: Monitor },
    { value: "dark", label: "Dark", Icon: Moon },
  ];

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
      role="radiogroup"
      aria-label="Theme"
    >
      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/60">
        {options.map(({ value, label, Icon }) => {
          const active = mounted && theme === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              title={label}
              onClick={() => setTheme(value)}
              className={
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors " +
                (active
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white")
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
