import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 font-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 " +
  "rounded-[3px] whitespace-nowrap select-none active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  // Indigo fill with white text clears 5.7:1 — safe for the primary action.
  primary:
    "bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border border-transparent " +
    "shadow-[0_0_0_1px_var(--accent-fill),0_10px_40px_-12px_var(--glow-indigo)] " +
    "hover:bg-[var(--indigo-bright)] hover:shadow-[0_0_0_1px_var(--indigo-bright),0_14px_46px_-10px_var(--glow-indigo)]",
  secondary:
    "border border-[var(--line-strong)] text-[var(--ink)] bg-[var(--glass-fill)] " +
    "backdrop-blur-xl hover:border-[var(--accent-text)] hover:bg-[var(--glass-fill-strong)]",
  ghost:
    "text-[var(--ink-muted)] hover:text-[var(--ink)] border border-transparent " +
    "hover:border-[var(--line)]",
};

// Both sizes clear the 44px minimum touch target. A 40px button is fine with
// a mouse and awkward with a thumb, and half this audience reads on a phone.
const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-[0.8125rem] tracking-[-0.005em]",
  lg: "h-12 px-6 text-[0.9375rem] tracking-[-0.01em]",
};

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonLinkProps = SharedProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

type ButtonProps = SharedProps & ComponentPropsWithoutRef<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
