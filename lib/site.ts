/**
 * Single source of truth for site-wide identity, navigation and canonical URLs.
 * Nothing else should hardcode a route string or a tagline.
 */

/**
 * True for a preview deployment (a github.io copy, a staging host).
 *
 * A preview of an unlaunched brand must never be indexed: it would compete
 * with fwdengine.com for the company's own name and is very hard to get back
 * out of the index once it is in.
 */
export const isPreviewDeployment = process.env.NEXT_PUBLIC_PREVIEW === "1";

export const site = {
  name: "FwdEngine",
  domain: "fwdengine.com",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://fwdengine.com",
  tagline: "Forward Deployed. Agentically Delivered.",
  oneLiner:
    "FwdEngine deploys forward-based engineering teams, human and agentic, directly into financial institutions to ship production AI systems in weeks, not years.",
  description:
    "FwdEngine embeds forward deployed engineering teams inside banks, insurers, asset managers and payments firms to design, ship and operate agentic AI systems in production.",
  legalName: "FwdEngine",
  contactEmail: "deploy@fwdengine.com",
} as const;

export type NavLink = {
  href: string;
  label: string;
  /** Short line shown in the mega-nav and on section index pages. */
  blurb?: string;
};

export const primaryNav: readonly NavLink[] = [
  {
    href: "/platform",
    label: "Platform",
    blurb: "The agentic computation layer: orchestration, guardrails, evaluation, audit.",
  },
  {
    href: "/industries",
    label: "Industries",
    blurb: "Banking, asset and wealth, insurance, payments.",
  },
  {
    href: "/fde-model",
    label: "FDE Model",
    blurb: "How forward deployed engineering works, and why it ships faster.",
  },
  {
    href: "/global-delivery",
    label: "Global Delivery",
    blurb: "Follow-the-sun hubs and cross-region oversight handoffs.",
  },
  { href: "/insights", label: "Insights", blurb: "Engineering notes and research." },
  { href: "/careers", label: "Careers", blurb: "The forward deployed archetype." },
] as const;

export const footerNav: readonly { title: string; links: readonly NavLink[] }[] = [
  {
    title: "Capability",
    links: [
      { href: "/platform", label: "Platform" },
      { href: "/fde-model", label: "FDE Model" },
      { href: "/global-delivery", label: "Global Delivery" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/banking", label: "Banking" },
      { href: "/industries/asset-wealth", label: "Asset & Wealth" },
      { href: "/industries/insurance", label: "Insurance" },
      { href: "/industries/payments", label: "Payments" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/insights", label: "Insights" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

/** Route used by every primary call to action on the site. */
export const CTA_HREF = "/contact";
