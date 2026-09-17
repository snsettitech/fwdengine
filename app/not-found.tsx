import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { ButtonLink } from "@/components/ui/button";
import { AmbientField } from "@/components/visual/ambient-field";
import { primaryNav } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="substrate" />
        <AmbientField />
      </div>

      <Container>
        <div className="max-w-2xl">
          <Kicker>404</Kicker>
          <h1 className="type-display mt-6 text-[clamp(2rem,1.5rem+2.4vw,3.5rem)]">
            That route does not resolve.
          </h1>
          <p className="type-lede mt-6">
            The page is gone, renamed, or never existed. Here is everything that
            does.
          </p>

          <ul className="mt-10 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {primaryNav.map((link) => (
              <li key={link.href} className="bg-[var(--canvas)]">
                <Link
                  href={link.href}
                  className="block px-5 py-4 transition-colors hover:bg-[var(--surface-1)]"
                >
                  <span className="text-[0.9375rem] text-[var(--ink)]">
                    {link.label}
                  </span>
                  {link.blurb ? (
                    <span className="mt-1 block text-[0.8125rem] leading-snug text-[var(--ink-muted)]">
                      {link.blurb}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <ButtonLink href="/" size="lg">
              Back to the homepage
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
