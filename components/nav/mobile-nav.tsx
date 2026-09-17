"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CTA_HREF, primaryNav } from "@/lib/site";

export function MobileNav() {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /**
   * Open state is stored as "the route this panel was opened on", so a
   * navigation closes it by derivation rather than by an effect that fires
   * after the new page has already painted behind the overlay.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn !== null && openedOn === pathname;

  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // setOpenedOn directly, not the setOpen helper: the helper closes over
        // `pathname` and would have to be an effect dependency, which would
        // tear down and rebuild these listeners on every render.
        setOpenedOn(null);
        return;
      }
      if (event.key !== "Tab") return;

      // Keep focus inside the panel while it is open.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      // `trigger` is captured above: reading the ref here would see whatever
      // it points at after this render, which may no longer be the button.
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-[var(--line)] text-[var(--ink)] lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col bg-[var(--canvas)]/96 backdrop-blur-2xl lg:hidden"
        >
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <span className="type-kicker">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-[var(--line)] text-[var(--ink)]"
            >
              <X className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-10 sm:px-8">
            <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {primaryNav.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-baseline gap-4 py-5 text-[var(--ink)]"
                  >
                    <span className="type-mono text-[0.6875rem] text-[var(--ink-dim)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="type-headline block text-[1.5rem]">
                        {link.label}
                      </span>
                      {link.blurb ? (
                        <span className="mt-1 block text-[0.8125rem] leading-snug text-[var(--ink-muted)]">
                          {link.blurb}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ButtonLink href={CTA_HREF} size="lg" className="w-full">
                Talk to Us
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
