"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Dark is not a preference here, it is the brand. We do not follow the OS
 * theme: the site opens dark for everyone and remembers an explicit choice.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      themes={["dark", "light"]}
    >
      {children}
    </NextThemeProvider>
  );
}
