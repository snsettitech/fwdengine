import { NextResponse } from "next/server";
import {
  contactSchema,
  toFieldErrors,
  type ContactResponse,
} from "@/lib/contact";
import { site } from "@/lib/site";

/**
 * Qualification form intake.
 *
 * Delivery is env-driven. If no channel is configured this route returns 503
 * with the direct email address rather than a cheerful success: a marketing
 * form that silently discards an eight-figure enquiry is worse than no form.
 *
 * Configure either:
 *   RESEND_API_KEY + CONTACT_TO_EMAIL   (email delivery)
 *   CONTACT_WEBHOOK_URL                 (Slack, CRM, or anything that takes JSON)
 */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

/**
 * Per-instance sliding window. Good enough for a marketing form: it stops a
 * script hammering one edge instance. It is not a distributed limiter, and it
 * resets on redeploy. If this ever needs to be real, move it to Upstash.
 */
const attempts = new Map<string, number[]>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (attempts.size > 5000) {
    for (const [mapKey, times] of attempts) {
      if (times.every((at) => now - at >= RATE_LIMIT_WINDOW_MS)) {
        attempts.delete(mapKey);
      }
    }
  }

  return false;
}

type Enquiry = ReturnType<typeof contactSchema.parse>;

function formatEnquiry(enquiry: Enquiry): string {
  return [
    `Institution: ${enquiry.institution} (${enquiry.institutionType})`,
    `Contact:     ${enquiry.name}, ${enquiry.role}`,
    `Email:       ${enquiry.email}`,
    `Use case:    ${enquiry.useCase}`,
    `Timeline:    ${enquiry.timeline}`,
    "",
    "Constraint:",
    enquiry.constraint,
  ].join("\n");
}

async function deliverByEmail(enquiry: Enquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: enquiry.email,
      subject: `[${site.name}] ${enquiry.institution} — ${enquiry.useCase}`,
      text: formatEnquiry(enquiry),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "<unreadable>");
    throw new Error(`Resend rejected the message (${response.status}): ${detail}`);
  }

  return true;
}

async function deliverByWebhook(enquiry: Enquiry): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return false;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: formatEnquiry(enquiry),
      enquiry,
      receivedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Contact webhook returned ${response.status}`);
  }

  return true;
}

export async function POST(request: Request) {
  const key = clientKey(request);

  if (rateLimited(key)) {
    return NextResponse.json<ContactResponse>(
      {
        ok: false,
        message: "Too many submissions from this address. Try again shortly.",
      },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<ContactResponse>(
      { ok: false, message: "We could not read that submission." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json<ContactResponse>(
      {
        ok: false,
        message: "Some fields need attention.",
        fieldErrors: toFieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const enquiry = parsed.data;

  // Honeypot. A filled hidden field is a bot; accept quietly so it learns
  // nothing, and deliver nothing.
  if (enquiry.referralSource) {
    return NextResponse.json<ContactResponse>({
      ok: true,
      message: "Thank you. We will be in touch.",
    });
  }

  try {
    const delivered =
      (await deliverByEmail(enquiry)) || (await deliverByWebhook(enquiry));

    if (!delivered) {
      // No channel configured. Say so rather than pretending it arrived.
      console.warn(
        "[contact] No delivery channel configured (RESEND_API_KEY or CONTACT_WEBHOOK_URL). Enquiry not delivered:\n%s",
        formatEnquiry(enquiry),
      );
      return NextResponse.json<ContactResponse>(
        {
          ok: false,
          message: `This form is not connected to a mailbox yet. Please email ${site.contactEmail} directly and we will reply the same day.`,
        },
        { status: 503 },
      );
    }

    console.info(
      "[contact] Enquiry delivered: %s (%s)",
      enquiry.institution,
      enquiry.institutionType,
    );

    return NextResponse.json<ContactResponse>({
      ok: true,
      message:
        "Received. An engineer, not a sales development representative, will reply.",
    });
  } catch (error) {
    // Log the detail server side; never leak provider errors to the browser.
    console.error("[contact] Delivery failed", error);
    return NextResponse.json<ContactResponse>(
      {
        ok: false,
        message: `We could not deliver that. Please email ${site.contactEmail} directly.`,
      },
      { status: 502 },
    );
  }
}
