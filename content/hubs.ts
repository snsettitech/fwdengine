/**
 * Delivery hubs used by the 3D globe and the Global Delivery page.
 *
 * `tz` drives the live coverage clock through Intl, so daylight saving is
 * handled by the platform rather than by arithmetic we would get wrong twice
 * a year. Hubs marked `planned` render at reduced emphasis and are labelled as
 * such: a prospect should never be shown a hub that is not staffed.
 */

export type Hub = {
  readonly id: string;
  readonly city: string;
  readonly country: string;
  readonly lat: number;
  readonly lng: number;
  /** IANA time zone, used for the live coverage clock. */
  readonly tz: string;
  /** Standard-time offset from UTC, in hours. Used only for ordering. */
  readonly utcOffset: number;
  readonly status: "active" | "planned";
  /** What this hub is for. Hubs are not interchangeable. */
  readonly focus: string;
};

export const hubs: readonly Hub[] = [
  {
    id: "nyc",
    city: "New York",
    country: "United States",
    lat: 40.7128,
    lng: -74.006,
    tz: "America/New_York",
    utcOffset: -5,
    status: "active",
    focus: "Capital markets, US bank supervision, on-site FDE deployment across the Northeast corridor.",
  },
  {
    id: "lon",
    city: "London",
    country: "United Kingdom",
    lat: 51.5072,
    lng: -0.1276,
    tz: "Europe/London",
    utcOffset: 0,
    status: "active",
    focus: "PRA and FCA-regulated institutions, insurance markets, EMEA engagement leadership.",
  },
  {
    id: "fra",
    city: "Frankfurt",
    country: "Germany",
    lat: 50.1109,
    lng: 8.6821,
    tz: "Europe/Berlin",
    utcOffset: 1,
    status: "active",
    focus: "Euro-area banking, ECB supervisory expectations, EU AI Act conformity work.",
  },
  {
    id: "dxb",
    city: "Dubai",
    country: "United Arab Emirates",
    lat: 25.2048,
    lng: 55.2708,
    tz: "Asia/Dubai",
    utcOffset: 4,
    status: "planned",
    focus: "DIFC institutions and Gulf sovereign-linked asset managers.",
  },
  {
    id: "blr",
    city: "Bengaluru",
    country: "India",
    lat: 12.9716,
    lng: 77.5946,
    tz: "Asia/Kolkata",
    utcOffset: 5.5,
    status: "active",
    focus: "Core platform engineering, evaluation harness authoring, overnight build and test.",
  },
  {
    id: "sin",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    tz: "Asia/Singapore",
    utcOffset: 8,
    status: "active",
    focus: "MAS-regulated institutions, regional payments infrastructure, APAC delivery leadership.",
  },
  {
    id: "syd",
    city: "Sydney",
    country: "Australia",
    lat: -33.8688,
    lng: 151.2093,
    tz: "Australia/Sydney",
    utcOffset: 10,
    status: "planned",
    focus: "APRA-regulated banks and superannuation funds.",
  },
] as const;

/** Great-circle arcs drawn on the globe. Ordered pairs of hub ids. */
export const arcs: readonly (readonly [string, string])[] = [
  ["nyc", "lon"],
  ["lon", "fra"],
  ["fra", "blr"],
  ["blr", "sin"],
  ["sin", "syd"],
  ["lon", "dxb"],
  ["dxb", "blr"],
  ["sin", "nyc"],
  ["nyc", "blr"],
] as const;

export const activeHubs = hubs.filter((hub) => hub.status === "active");
