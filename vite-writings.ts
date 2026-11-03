import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import mammoth from "mammoth";
import type { Plugin } from "vite";
import { META_KEYS, humanise, isDraft, normaliseDate, readingMinutes, shorten, slugOf, type MetaKey } from "./src/content/writingMeta.ts";

/*
 * Turns the Word files (.docx) in src/writings/ into writings at build time.
 * Word, Pages, Google Docs and TextEdit can all save or export as .docx.
 * The result is offered to the app as the virtual module "virtual:writings-docx".
 */

const VIRTUAL = "virtual:writings-docx";
const RESOLVED = `\0${VIRTUAL}`;

// Word styles to the plain tags the site is built for. Heading 1 and 2 become the section headings of the text,
// because the title of the piece is set separately.
const STYLE_MAP = [
  "p[style-name='Title'] => h1:fresh",
  ...["Heading 1", "heading 1", "Heading"].map((n) => `p[style-name='${n}'] => h2:fresh`),
  ...["Heading 2", "heading 2", "Heading 3", "heading 3", "Subheading"].map((n) => `p[style-name='${n}'] => h3:fresh`),
  ...["Quote", "Intense Quote", "Block Text", "Block Quotation"].map((n) => `p[style-name='${n}'] => blockquote:fresh`),
];

const ALLOWED = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "s", "sup", "sub", "a", "ul", "ol", "li", "blockquote", "br", "hr", "table", "thead", "tbody", "tr", "th", "td"]);
const SAFE_LINK = /^(https?:\/\/|mailto:|\/|#)/i;

const decode = (text: string) =>
  text.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, "&");
const stripTags = (html: string) => decode(html.replace(/<[^>]*>/g, ""));

/** Keeps only the tags in ALLOWED, with no attributes except a safe link address. Pictures and anything unknown are dropped. */
function sanitise(html: string): string {
  return html
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (tag, name: string, attrs: string) => {
      const lower = name.toLowerCase();
      if (!ALLOWED.has(lower)) return "";
      if (tag.startsWith("</")) return `</${lower}>`;
      if (lower === "a") {
        const href = attrs.match(/href="([^"]*)"/i)?.[1];
        if (!href || !SAFE_LINK.test(decode(href))) return "<a>";
        const external = /^https?:\/\//i.test(href);
        return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
      }
      return `<${lower}>`;
    })
    .replace(/<a>([\s\S]*?)<\/a>/g, "$1") // a link with no usable address is just its text
    .replace(/<p>\s*<\/p>/g, "");
}

async function convert(file: string) {
  const { value } = await mammoth.convertToHtml({ path: file }, { styleMap: STYLE_MAP, convertImage: mammoth.images.imgElement(async () => ({ src: "" })) });
  let html = sanitise(value);

  // The leading paragraphs made only of "Key: value" lines are the details of the piece, not its text.
  const meta: Partial<Record<MetaKey, string>> = {};
  for (;;) {
    const match = html.match(/^\s*<p>([\s\S]*?)<\/p>/);
    if (!match) break;
    const lines = match[1].split(/<br\s*\/?>/i).map((l) => stripTags(l).trim()).filter(Boolean);
    const parsed = lines.map((l) => l.match(/^([A-Za-z]+):\s*(.*)$/));
    if (!lines.length || !parsed.every((m) => m && (META_KEYS as readonly string[]).includes(m[1].toLowerCase()))) break;
    for (const m of parsed) meta[m![1].toLowerCase() as MetaKey] = m![2].trim();
    html = html.slice(match[0].length);
  }

  // No Title line: a leading Title/Heading-style line is the title instead.
  if (!meta.title) {
    const lead = html.match(/^\s*<h1>([\s\S]*?)<\/h1>/);
    if (lead) {
      meta.title = stripTags(lead[1]).trim();
      html = html.slice(lead[0].length);
    }
  }

  html = html.trim();
  const text = stripTags(html.replace(/<\/(p|h[1-6]|li|blockquote)>/g, " "));
  const firstParagraph = stripTags(html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "");
  const slug = slugOf(path.basename(file));
  return {
    slug,
    title: meta.title || humanise(slug),
    date: meta.date ? normaliseDate(meta.date) : "",
    subject: meta.subject || undefined,
    place: meta.place || undefined,
    summary: meta.summary || undefined,
    draft: isDraft(meta.draft),
    html,
    minutes: readingMinutes(text.split(/\s+/).filter(Boolean).length),
    excerpt: shorten(meta.summary || firstParagraph),
  };
}

export function writingsDocx(): Plugin {
  let dir = "";
  return {
    name: "writings-docx",
    configResolved(config) {
      dir = path.resolve(config.root, "src/writings");
    },
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : undefined;
    },
    async load(id) {
      if (id !== RESOLVED) return;
      const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.docx$/i.test(f) && !f.startsWith("_") && !f.startsWith("~$") && !f.startsWith(".")) : [];
      files.sort((a, b) => a.localeCompare(b));
      const entries: Awaited<ReturnType<typeof convert>>[] = [];
      for (const name of files) {
        const file = path.join(dir, name);
        this.addWatchFile(file);
        try {
          const entry = await convert(file);
          if (!entries.some((e) => e.slug === entry.slug)) entries.push(entry);
        } catch (error) {
          // A file that cannot be read is skipped, with a note, so one bad file never breaks the site.
          this.warn(`Could not read ${name}: ${(error as Error).message}`);
        }
      }
      return `export default ${JSON.stringify(entries)};`;
    },
    configureServer(server) {
      server.watcher.add(dir);
      const refresh = (file: string) => {
        if (!/\.docx$/i.test(file) || !file.startsWith(dir)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", refresh).on("change", refresh).on("unlink", refresh);
    },
  };
}
