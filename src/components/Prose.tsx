import { Fragment, type ReactNode } from "react";
import type { Block } from "../content/writings";

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
// Only ordinary web, mail and on-site addresses become links; anything else is shown as plain text.
const SAFE_LINK = /^(https?:\/\/|mailto:|\/|#)/i;

/** Bold, italic and links inside a line of text. Built as React nodes, never as raw HTML. */
function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i} className="font-medium">{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const [, label, href] = link;
          if (!SAFE_LINK.test(href)) return <Fragment key={i}>{label}</Fragment>;
          const external = /^https?:\/\//i.test(href);
          return (
            <a
              key={i}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
            >
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** The text of a writing: paragraphs, small headings, quotes, lists and rules. The first paragraph gets a drop cap. */
export function Prose({ blocks }: { blocks: Block[] }) {
  let first = true;
  return (
    <div className="max-w-[62ch] text-lg leading-[1.75] text-fg md:text-[1.2rem] md:leading-[1.8]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h":
            return (
              <h2 key={i} className="mt-14 text-2xl font-bold leading-snug tracking-[-0.02em] text-fg md:text-3xl">
                <Inline text={block.text} />
              </h2>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-10 border-l-2 border-line pl-6 text-2xl font-medium leading-snug tracking-[-0.015em] text-fg md:pl-8 md:text-[2rem] md:leading-[1.35]">
                <Inline text={block.text} />
              </blockquote>
            );
          case "list":
            return (
              <ul key={i} className="mt-6 list-disc space-y-2 pl-6 marker:text-soft">
                {block.items.map((item, n) => (
                  <li key={n}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "rule":
            return <hr key={i} className="my-12 border-0 border-t border-line" />;
          default: {
            const opening = first;
            first = false;
            return (
              <p key={i} className={opening ? "writing-opening" : "mt-6"}>
                <Inline text={block.text} />
              </p>
            );
          }
        }
      })}
    </div>
  );
}

/**
 * The text of a Word file. The HTML was cleaned when the site was built (vite-writings.ts keeps only plain tags and
 * safe links) and comes from your own files, so it is shown as it is. Styling is the `.rich` rules in index.css.
 */
export function RichText({ html }: { html: string }) {
  return <div className="rich" dangerouslySetInnerHTML={{ __html: html }} />;
}
