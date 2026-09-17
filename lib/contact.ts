import { z } from "zod";

/**
 * The qualification form.
 *
 * One schema, used by the client for inline validation and by the route
 * handler as the actual trust boundary. The client copy is a convenience; the
 * server never trusts it.
 */

export const institutionTypes = [
  "Bank",
  "Asset or wealth manager",
  "Insurer",
  "Payments or fintech infrastructure",
  "Market infrastructure",
  "Other",
] as const;

export const useCaseOptions = [
  "Credit decisioning support",
  "Financial crime operations",
  "Back-office reconciliation",
  "Client servicing",
  "Regulatory reporting",
  "Treasury and liquidity",
  "Research and portfolio",
  "Not decided yet",
] as const;

export const timelineOptions = [
  "Budget approved, starting this quarter",
  "Next quarter",
  "Board mandate pending",
  "Exploring, no timeline yet",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(120),
  email: z.email("Use a work email address we can reply to.").max(200),
  role: z.string().trim().min(2, "Your role helps us route this.").max(160),
  institution: z
    .string()
    .trim()
    .min(2, "Which institution is this for?")
    .max(200),
  institutionType: z.enum(institutionTypes, {
    message: "Pick the closest institution type.",
  }),
  useCase: z.enum(useCaseOptions, { message: "Pick the closest use case." }),
  timeline: z.enum(timelineOptions, { message: "Pick a timeline." }),
  constraint: z
    .string()
    .trim()
    .min(40, "A couple of sentences, so the first call is useful.")
    .max(4000),
  consent: z.literal(true, {
    message: "We need your agreement before we can reply.",
  }),
  /** Bot trap. Must stay empty; never shown to a human. */
  referralSource: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResponse =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Field-keyed error map from a failed parse, for rendering inline. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
