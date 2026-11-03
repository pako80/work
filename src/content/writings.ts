/*
 * Writings are files in src/writings/: Word documents (.docx, saved or exported from Word, Pages, Google Docs or TextEdit) or plain
 * text (.txt). Drop a file in and it appears on the site: the file name becomes the address
 * (dear-young-designer.docx -> /writings/dear-young-designer).
 * Files whose name starts with an underscore are ignored, so the templates never show up.
 * Word files are converted at build time by vite-writings.ts. See src/writings/_template.docx for the format.
 */
import docxEntries from "virtual:writings-docx";
import { META_KEYS, humanise, isDraft, normaliseDate, readingMinutes, shorten, slugOf, type MetaKey } from "./writingMeta";

/** Name and one-line intro of the section, used in the header, on the home page and on the pages themselves. */
export const WRITINGS_NAME = "Writings";
export const WRITINGS_INTRO = "Thoughts, notes and the odd ramble.";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "rule" };

export interface Writing {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD), or "" when the file has none. */
  date: string;
  subject?: string;
  place?: string;
  summary?: string;
  draft: boolean;
  /** Text of a plain .txt file, as blocks. Empty for a Word file. */
  blocks: Block[];
  /** Text of a Word file, as clean HTML made by vite-writings.ts. */
  html?: string;
  minutes: number;
  /** One or two sentences for the lists: the summary if there is one, otherwise the opening of the text. */
  excerpt: string;
}

const files = import.meta.glob("../writings/*.txt", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of body.split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((l) => l.trimEnd());
    const text = lines.join("\n").trim();
    if (!text) continue;
    if (/^-{3,}$/.test(text)) blocks.push({ type: "rule" });
    else if (text.startsWith("## ")) blocks.push({ type: "h", text: text.slice(3).trim() });
    else if (lines.every((l) => l.startsWith("> ") || l === ">")) blocks.push({ type: "quote", text: lines.map((l) => l.replace(/^>\s?/, "")).join(" ").trim() });
    else if (lines.every((l) => /^[-*] /.test(l))) blocks.push({ type: "list", items: lines.map((l) => l.slice(2).trim()) });
    else blocks.push({ type: "p", text: lines.map((l) => l.trim()).join(" ") });
  }
  return blocks;
}

/** Strips the little bit of formatting (bold, italic, links) so a sentence can be shown as plain text. */
export const plain = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");

function parse(path: string, raw: string): Writing {
  const slug = slugOf(path.split("/").pop()!);
  const lines = raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");

  // The header is the run of "Key: value" lines at the top, ended by the first blank line.
  const meta: Partial<Record<MetaKey, string>> = {};
  let i = 0;
  while (i < lines.length) {
    const match = lines[i].match(/^([A-Za-z]+):\s*(.*)$/);
    if (!match || !(META_KEYS as readonly string[]).includes(match[1].toLowerCase())) break;
    meta[match[1].toLowerCase() as MetaKey] = match[2].trim();
    i++;
  }
  const body = (Object.keys(meta).length ? lines.slice(i) : lines).join("\n");
  const blocks = parseBlocks(body);

  const words = blocks.reduce((n, b) => n + ("text" in b ? b.text : b.type === "list" ? b.items.join(" ") : "").split(/\s+/).filter(Boolean).length, 0);
  const firstParagraph = blocks.find((b): b is Extract<Block, { type: "p" }> => b.type === "p")?.text ?? "";
  const lead = plain(meta.summary || firstParagraph);

  return {
    slug,
    title: meta.title || humanise(slug),
    date: meta.date ? normaliseDate(meta.date) : "",
    subject: meta.subject || undefined,
    place: meta.place || undefined,
    summary: meta.summary || undefined,
    draft: isDraft(meta.draft),
    blocks,
    minutes: readingMinutes(words),
    excerpt: shorten(lead),
  };
}

const fromText: Writing[] = Object.entries(files)
  .filter(([path]) => !path.split("/").pop()!.startsWith("_"))
  .map(([path, raw]) => parse(path, raw));

const fromWord: Writing[] = docxEntries.map((entry) => ({ ...entry, blocks: [] }));

/** Newest first. Files without a date go last. Drafts show only while developing locally, never in the built site.
 *  If a Word file and a text file share a name, the Word file wins. */
export const writings: Writing[] = [...fromWord, ...fromText.filter((t) => !fromWord.some((w) => w.slug === t.slug))]
  .filter((w) => !w.draft || import.meta.env.DEV)
  .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : !a.date ? 1 : !b.date ? -1 : b.date.localeCompare(a.date)));

export const findWriting = (slug: string | undefined) => writings.find((w) => w.slug === slug);

/** 2026-10-30 -> "2026 · 10 · 30" */
export const formatDate = (iso: string) => iso.replace(/-/g, " · ");
