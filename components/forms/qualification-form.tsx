"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "@/components/forms/field";
import {
  contactSchema,
  institutionTypes,
  timelineOptions,
  toFieldErrors,
  useCaseOptions,
  type ContactResponse,
} from "@/lib/contact";
import { site } from "@/lib/site";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; message: string }
  | { kind: "failed"; message: string };

/**
 * A qualification form, not a contact form.
 *
 * Every field here changes who replies and what the first call is about. The
 * same zod schema validates in the browser and again in the route handler,
 * where it is the real boundary.
 */
export function QualificationForm() {
  const prefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldId = (name: string) => `${prefix}-${name}`;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const candidate = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      role: String(data.get("role") ?? ""),
      institution: String(data.get("institution") ?? ""),
      institutionType: String(data.get("institutionType") ?? ""),
      useCase: String(data.get("useCase") ?? ""),
      timeline: String(data.get("timeline") ?? ""),
      constraint: String(data.get("constraint") ?? ""),
      consent: data.get("consent") === "on",
      referralSource: String(data.get("referralSource") ?? ""),
    };

    const parsed = contactSchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setStatus({ kind: "idle" });
      // Move focus to the first problem so a keyboard user is not stranded.
      const first = Object.keys(fieldErrors)[0];
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as ContactResponse;

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setStatus({ kind: "failed", message: result.message });
        return;
      }

      formRef.current?.reset();
      setStatus({ kind: "sent", message: result.message });
    } catch {
      setStatus({
        kind: "failed",
        message: `Something went wrong on our side. Please email ${site.contactEmail} directly.`,
      });
    }
  };

  if (status.kind === "sent") {
    return (
      <div
        role="status"
        className="glass edge-lit rounded-[10px] px-7 py-14 text-center"
      >
        <span
          aria-hidden="true"
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-[3px] border border-[var(--accent-text)]"
        >
          <Check className="h-5 w-5 text-[var(--accent-text)]" strokeWidth={1.8} />
        </span>
        <p className="type-headline mt-6 text-[1.375rem]">{status.message}</p>
        <p className="type-body mx-auto mt-3 max-w-md">
          If it is urgent, {site.contactEmail} reaches the same people.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="glass edge-lit rounded-[10px] p-6 sm:p-8 lg:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          label="Name"
          required
          error={errors.name}
        >
          <TextInput
            id={fieldId("name")}
            name="name"
            autoComplete="name"
            error={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId("name")}-error` : undefined}
          />
        </Field>

        <Field
          id={fieldId("email")}
          label="Work email"
          required
          error={errors.email}
        >
          <TextInput
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            error={Boolean(errors.email)}
            aria-describedby={errors.email ? `${fieldId("email")}-error` : undefined}
          />
        </Field>

        <Field
          id={fieldId("role")}
          label="Your role"
          hint="e.g. Chief Data Officer"
          required
          error={errors.role}
        >
          <TextInput
            id={fieldId("role")}
            name="role"
            autoComplete="organization-title"
            error={Boolean(errors.role)}
            aria-describedby={errors.role ? `${fieldId("role")}-error` : undefined}
          />
        </Field>

        <Field
          id={fieldId("institution")}
          label="Institution"
          required
          error={errors.institution}
        >
          <TextInput
            id={fieldId("institution")}
            name="institution"
            autoComplete="organization"
            error={Boolean(errors.institution)}
            aria-describedby={
              errors.institution ? `${fieldId("institution")}-error` : undefined
            }
          />
        </Field>

        <Field
          id={fieldId("institutionType")}
          label="Institution type"
          required
          error={errors.institutionType}
        >
          <Select
            id={fieldId("institutionType")}
            name="institutionType"
            defaultValue=""
            error={Boolean(errors.institutionType)}
            aria-describedby={
              errors.institutionType
                ? `${fieldId("institutionType")}-error`
                : undefined
            }
          >
            <option value="" disabled>
              Select…
            </option>
            {institutionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          id={fieldId("useCase")}
          label="Closest use case"
          required
          error={errors.useCase}
        >
          <Select
            id={fieldId("useCase")}
            name="useCase"
            defaultValue=""
            error={Boolean(errors.useCase)}
            aria-describedby={
              errors.useCase ? `${fieldId("useCase")}-error` : undefined
            }
          >
            <option value="" disabled>
              Select…
            </option>
            {useCaseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            id={fieldId("timeline")}
            label="Timeline"
            required
            error={errors.timeline}
          >
            <Select
              id={fieldId("timeline")}
              name="timeline"
              defaultValue=""
              error={Boolean(errors.timeline)}
              aria-describedby={
                errors.timeline ? `${fieldId("timeline")}-error` : undefined
              }
            >
              <option value="" disabled>
                Select…
              </option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id={fieldId("constraint")}
            label="What is actually blocking you today?"
            hint="Two or three sentences"
            required
            error={errors.constraint}
          >
            <TextArea
              id={fieldId("constraint")}
              name="constraint"
              placeholder="The core is frozen until Q3. Model risk wants per-decision reasoning we cannot currently produce. The board has asked for something in production by year end."
              error={Boolean(errors.constraint)}
              aria-describedby={
                errors.constraint ? `${fieldId("constraint")}-error` : undefined
              }
            />
          </Field>
        </div>
      </div>

      {/* Honeypot. Hidden from sight and from assistive technology. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("referralSource")}>Referral source</label>
        <input
          id={fieldId("referralSource")}
          name="referralSource"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-7 border-t border-[var(--line)] pt-6">
        <div className="flex gap-3">
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            className="mt-px h-5 w-5 shrink-0 accent-[var(--accent-fill)]"
            aria-describedby={
              errors.consent ? `${fieldId("consent")}-error` : undefined
            }
          />
          <label
            htmlFor={fieldId("consent")}
            className="text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]"
          >
            I agree that {site.name} may contact me about this enquiry. We do not
            add enquiries to a marketing list and we do not share them.
          </label>
        </div>
        {errors.consent ? (
          <p
            id={`${fieldId("consent")}-error`}
            className="type-mono mt-2 text-[0.6875rem] text-[var(--amber)]"
          >
            {errors.consent}
          </p>
        ) : null}
      </div>

      {status.kind === "failed" ? (
        <p
          role="alert"
          className="mt-6 border-l-2 border-[var(--amber)] pl-4 text-[0.875rem] leading-relaxed text-[var(--amber)]"
        >
          {status.message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={status.kind === "submitting"}
        >
          {status.kind === "submitting" ? "Sending…" : "Send enquiry"}
          {status.kind === "submitting" ? null : (
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </Button>
        <p className="type-mono text-[0.6875rem] text-[var(--ink-dim)]">
          Replies come from an engineer, usually same day.
        </p>
      </div>
    </form>
  );
}
