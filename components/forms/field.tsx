"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const controlClasses =
  "w-full rounded-[3px] border bg-[var(--surface-1)] px-3.5 py-2.5 text-[0.9375rem] " +
  "text-[var(--ink)] transition-colors duration-200 placeholder:text-[var(--ink-dim)] " +
  "hover:border-[var(--line-strong)] focus:border-[var(--accent-text)] focus:outline-none " +
  "focus-visible:outline-none";

/**
 * Form field wrapper.
 *
 * Labels are always visible, never placeholders standing in for labels: a
 * placeholder disappears the moment someone types, which is exactly when they
 * need to know what the field was.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-[0.8125rem] font-semibold text-[var(--ink)]"
      >
        <span>
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-[var(--accent-text)]">
              *
            </span>
          ) : null}
        </span>
        {hint ? (
          <span className="type-mono text-[0.625rem] font-normal text-[var(--ink-dim)]">
            {hint}
          </span>
        ) : null}
      </label>

      <div className="mt-2">{children}</div>

      {error ? (
        <p
          id={`${id}-error`}
          className="type-mono mt-2 text-[0.6875rem] text-[var(--amber)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  error,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"input"> & { error?: boolean }) {
  return (
    <input
      className={cn(
        controlClasses,
        error ? "border-[var(--amber)]" : "border-[var(--line)]",
        className,
      )}
      {...rest}
    />
  );
}

export function TextArea({
  error,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"textarea"> & { error?: boolean }) {
  return (
    <textarea
      className={cn(
        controlClasses,
        "min-h-[9rem] resize-y leading-relaxed",
        error ? "border-[var(--amber)]" : "border-[var(--line)]",
        className,
      )}
      {...rest}
    />
  );
}

export function Select({
  error,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"select"> & { error?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlClasses,
          "appearance-none pr-10",
          error ? "border-[var(--amber)]" : "border-[var(--line)]",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-dim)]"
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
          />
        </svg>
      </span>
    </div>
  );
}
