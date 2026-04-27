"use client";

import { useEffect, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

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

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export default function ThemeSelector({ className }: { className?: string }) {
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

  const current = options.find((o) => o.value === theme) ?? options[2];
  const TriggerIcon = current.Icon;

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Theme"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 text-[13px] font-light text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          className
        )}
      >
        <TriggerIcon className="h-4 w-4" strokeWidth={1.75} />
        <span>{mounted ? current.label : "Theme"}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" strokeWidth={1.75} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="top" align="end" sideOffset={8}>
          <Menu.Popup
            className={cn(
              "min-w-[10rem] rounded-xl border border-white/10 bg-neutral-900/95 p-1 text-[13px] text-white shadow-xl backdrop-blur",
              "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150"
            )}
          >
            <Menu.RadioGroup
              value={theme}
              onValueChange={(v) => setTheme(v as Theme)}
            >
              {options.map(({ value, label, Icon }) => (
                <Menu.RadioItem
                  key={value}
                  value={value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-1.5 pl-2 pr-8 outline-none",
                    "data-[highlighted]:bg-white/10",
                    "data-[checked]:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  <span>{label}</span>
                  <Menu.RadioItemIndicator className="absolute right-2 inline-flex">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
