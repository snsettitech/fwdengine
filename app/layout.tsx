import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CursorGlow } from "@/components/visual/cursor-glow";
import { site, isPreviewDeployment } from "@/lib/site";

/**
 * General Sans is self-hosted rather than pulled from Fontshare's CDN: the
 * display face is the LCP element on most pages, and a third-party origin on
 * the critical path costs a connection we do not need to spend.
 */
const generalSans = localFont({
  // Two weights, deliberately. next/font preloads every face declared here
  // and each one is a request competing with the LCP paint, so the type
  // system is 400 for prose and 600 for everything that needs emphasis.
  // Mono keeps its 500 because JetBrains ships both weights in one file.
  src: [
    { path: "../public/fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "forward deployed engineering",
    "agentic AI",
    "financial services AI",
    "banking AI infrastructure",
    "AI model risk",
    "agent orchestration",
  ],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  // A preview host is excluded from search entirely. See isPreviewDeployment.
  robots: isPreviewDeployment
    ? { index: false, follow: false, nocache: true }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
  ],
  colorScheme: "dark light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  url: site.url,
  description: site.description,
  slogan: site.tagline,
  email: site.contactEmail,
  knowsAbout: [
    "Agentic AI systems",
    "Forward deployed engineering",
    "Financial services technology",
    "AI model risk management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${generalSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        {/* Scroll reveals render their hidden state server side, so without
            JavaScript the page would be blank. This makes the content
            unconditionally visible instead. */}
        <noscript>
          <style>{`[data-reveal],[data-phase]{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:border focus:border-[var(--line-strong)] focus:bg-[var(--surface-1)] focus:px-4 focus:py-2.5 focus:text-sm focus:text-[var(--ink)]"
          >
            Skip to content
          </a>
          <CursorGlow />
          <SiteHeader />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
        <Script
          id="fwdengine-organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          // Static object under our control; no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
