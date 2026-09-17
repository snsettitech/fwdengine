"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of delay before this element starts. */
  delay?: number;
  /** Distance travelled on entry, in px. */
  distance?: number;
  /** Stagger children that are themselves `RevealItem`s. */
  stagger?: number;
};

/**
 * Scroll-triggered entry. Content should feel like it is compiling into view:
 * a short rise, a blur resolving, nothing bouncy.
 *
 * When the OS asks for reduced motion, children render at their final state
 * immediately. There is no degraded half-animation.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 18,
  stagger,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: distance, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
        ...(stagger ? { staggerChildren: stagger, delayChildren: delay } : {}),
      },
    },
  };

  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/** A child of a `Reveal` that has `stagger` set. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div data-reveal="" className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/**
 * `RevealItem` for use directly inside a `ul`, `ol` or `menu`.
 *
 * A `div` between the list and its items breaks list semantics: a screen
 * reader stops announcing "list, 7 items" and the axe `list` / `listitem`
 * rules fail. So the animated element has to *be* the `li`.
 */
export function RevealListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <li className={className}>{children}</li>;
  }

  return (
    <motion.li data-reveal="" className={className} variants={itemVariants}>
      {children}
    </motion.li>
  );
}

/**
 * Headline text that assembles word by word, like a system resolving a string.
 * Used sparingly: the hero and one closing statement, nowhere else.
 *
 * The full string is always present for assistive technology; only the
 * decorative copy is animated.
 */
export function AssembleText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            data-reveal=""
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, y: "0.32em", filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + index * 0.045,
            }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
