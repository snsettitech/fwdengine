import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The handful of block elements a container is ever legitimately rendered as. */
type ContainerTag = "div" | "section" | "article" | "header" | "footer" | "nav";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ContainerTag;
  /** `wide` relaxes the measure for diagrams and globes. */
  width?: "default" | "wide" | "prose";
};

const widths = {
  default: "max-w-[82rem]",
  wide: "max-w-[96rem]",
  prose: "max-w-[44rem]",
} as const;

export function Container({
  children,
  className,
  as: Tag = "div",
  width = "default",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", widths[width], className)}>
      {children}
    </Tag>
  );
}
