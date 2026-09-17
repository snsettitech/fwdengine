import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";
import { CoverageClock } from "@/components/delivery/coverage-clock";
import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--canvas-deep)]">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="type-body mt-5 max-w-sm">
              {site.oneLiner}
            </p>
            <div className="mt-7">
              <CoverageClock compact />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="type-kicker">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.875rem] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--line)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-mono text-[0.6875rem] text-[var(--ink-dim)]">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="type-mono text-[0.6875rem] text-[var(--ink-dim)]">
            {site.domain}
          </p>
        </div>
      </Container>
    </footer>
  );
}
