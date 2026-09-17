import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Insights are MDX files on disk, read at build time.
 *
 * Frontmatter is schema-validated rather than trusted: a typo in a date or a
 * missing title should fail the build loudly, not render a broken card and a
 * malformed structured-data block in production.
 */

const INSIGHTS_DIR = path.join(process.cwd(), "content", "insights");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  /** ISO date, e.g. 2026-08-14. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  author: z.string().min(1),
  /** Short label used as the article's kicker. */
  category: z.string().min(1),
  readingMinutes: z.number().int().positive(),
  draft: z.boolean().optional(),
});

export type InsightFrontmatter = z.infer<typeof frontmatterSchema>;

export type Insight = InsightFrontmatter & {
  slug: string;
  body: string;
};

function parseFile(fileName: string): Insight {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(INSIGHTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/insights/${fileName}: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")} ${issue.message}`)
        .join("; ")}`,
    );
  }

  return { ...parsed.data, slug, body: content };
}

/** Published insights, newest first. Drafts are excluded. */
export function getInsights(): Insight[] {
  if (!fs.existsSync(INSIGHTS_DIR)) return [];

  return fs
    .readdirSync(INSIGHTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map(parseFile)
    .filter((insight) => insight.draft !== true)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInsight(slug: string): Insight | undefined {
  return getInsights().find((insight) => insight.slug === slug);
}

export function formatInsightDate(date: string): string {
  // Fixed locale and UTC: this renders on the server and must not shift with
  // the build machine's locale or time zone.
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
