"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/use-hydrated";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // next-themes cannot know the stored theme during SSR, so the icon is a
  // fixed-size placeholder until hydration and the header never shifts.
  const mounted = useHydrated();

  const isDark = resolvedTheme !== "light";

  // The stored theme is unknown during SSR, so the label stays neutral until
  // mount. Deriving it from `resolvedTheme` too early renders one string on
  // the server and another in the browser, which React reports as a
  // hydration mismatch and refuses to patch.
  const label = !mounted
    ? "Toggle theme"
    : isDark
      ? "Switch to light theme"
      : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      // cn, not concatenation: a caller passing `hidden` has to actually win
      // against the base `inline-flex`, and only tailwind-merge resolves that.
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-[3px] border",
        "border-[var(--line)] text-[var(--ink-muted)] transition-colors",
        "hover:border-[var(--line-strong)] hover:text-[var(--ink)]",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
        )
      ) : (
        <span className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
