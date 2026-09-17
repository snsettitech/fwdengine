"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "@/components/nav/mobile-nav";
import { CTA_HREF, primaryNav } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Transparent over the hero, frosted glass once the page moves.
 * The transition is the only place on the site where the chrome itself
 * animates, so it has to be quiet.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-[var(--line)] bg-[var(--canvas)]/72 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12"
      >
        <Link
          href="/"
          className="flex h-11 shrink-0 items-center rounded-[3px] transition-opacity hover:opacity-80"
          aria-label={`${"FwdEngine"} home`}
        >
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-9 items-center rounded-[3px] px-3 text-[0.8125rem] tracking-[-0.005em] transition-colors",
                    active
                      ? "text-[var(--ink)]"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                  )}
                >
                  {link.label}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-1 h-px bg-[var(--accent-text)]"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* The toggle stays reachable at every width; only the CTA collapses
              into the menu, and the hero carries one anyway. */}
          <ThemeToggle />
          <ButtonLink href={CTA_HREF} size="md" className="hidden sm:inline-flex">
            Talk to Us
          </ButtonLink>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
