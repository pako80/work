/* Small pure helpers shared by the writings loader (browser) and the Word-file plugin (build time). */

/** Accepts 2026-10-30, 2026/10/30, 2026.10.30 and 30 Oct 2026. Returns YYYY-MM-DD, or "" if it is not a date. */
export function normaliseDate(value: string): string {
  const cleaned = value.trim().replace(/[./·]/g, "-").replace(/\s*-\s*/g, "-");
  const parsed = new Date(/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleaned) ? `${cleaned}T12:00:00` : `${value} 12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const humanise = (slug: string) => {
  const text = slug.replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** "File Name.docx" -> "file-name" */
export const slugOf = (fileName: string) => fileName.replace(/\.[^.]+$/, "").toLowerCase().replace(/\s+/g, "-");

export const isDraft = (value: string | undefined) => /^(yes|true|y|1)$/i.test(value ?? "");

/** Keys that may appear in the "Key: value" lines at the top of a writing. */
export const META_KEYS = ["title", "date", "subject", "place", "summary", "draft"] as const;
export type MetaKey = (typeof META_KEYS)[number];

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200));

export const shorten = (text: string, max = 170) => (text.length > max ? `${text.slice(0, max - 3).replace(/\s+\S*$/, "")}...` : text);
