import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Link } from "react-router";
import { Contact } from "../components/Contact";
import { MaskedTitle, Reveal } from "../components/motion";
import { Prose, RichText } from "../components/Prose";
import { WRITINGS_INTRO, WRITINGS_NAME, findWriting, formatDate, writings, type Writing } from "../content/writings";

function useTop() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
}

/* ---------------------------------------------------------------- Index */

export function WritingsIndex() {
  useTop();
  useEffect(() => {
    document.title = `${WRITINGS_NAME}, Mario Borg`;
  }, []);

  return (
    <>
      <main id="main" className="mx-auto min-h-[70dvh] max-w-[1400px] px-4 pb-8 pt-32 md:px-8 md:pt-44">
        <MaskedTitle text={WRITINGS_NAME} className="text-6xl font-medium leading-[1.02] tracking-[-0.035em] md:text-8xl" />
        <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted md:text-xl">{WRITINGS_INTRO}</p>

        {writings.length === 0 ? (
          <p className="mt-24 text-lg text-muted">Nothing here yet.</p>
        ) : (
          <ol className="mt-20 md:mt-28">
            {writings.map((w, i) => (
              <li key={w.slug}>
                <Reveal delay={Math.min(i, 6) * 0.05}>
                  <WritingRow writing={w} />
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </main>
      <Contact />
    </>
  );
}

/** One entry in a list: date, title and a short opening, the whole row being the link. */
export function WritingRow({ writing }: { writing: Writing }) {
  return (
    <Link
      to={`/writings/${writing.slug}`}
      className="group grid gap-3 border-t border-line py-8 md:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] md:gap-12 md:py-10"
    >
      <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-soft">
        {writing.date ? formatDate(writing.date) : "No date"}
        {writing.draft && <span className="ml-3 rounded-[10px] border border-line px-2 py-0.5 normal-case tracking-normal">Draft</span>}
      </p>
      <div>
        <h2 className="flex items-start justify-between gap-6 text-2xl font-medium leading-snug tracking-[-0.02em] md:text-4xl">
          <span className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">{writing.title}</span>
          <ArrowRight
            weight="light"
            aria-hidden
            className="mt-1 size-6 shrink-0 opacity-0 transition-all duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:opacity-100 md:size-8"
          />
        </h2>
        {writing.excerpt && <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{writing.excerpt}</p>}
        <p className="mt-3 text-[13px] text-soft">
          {[writing.subject, `${writing.minutes} min read`].filter(Boolean).join("  ·  ")}
        </p>
      </div>
    </Link>
  );
}

/* ---------------------------------------------------------------- One piece */

export function WritingPage({ slug }: { slug: string }) {
  const writing = findWriting(slug);
  useTop();
  useEffect(() => {
    document.title = writing ? `${writing.title}, Mario Borg` : `Not found, Mario Borg`;
  }, [writing]);

  if (!writing) {
    return (
      <>
        <main id="main" className="mx-auto flex min-h-[70dvh] max-w-[1400px] flex-col justify-center px-4 pt-32 md:px-8">
          <h1 className="text-5xl font-medium tracking-[-0.035em] md:text-7xl">This piece does not exist.</h1>
          <p className="mt-6 max-w-[44ch] text-lg text-muted">The link may be old, or it may have moved.</p>
          <BackLink />
        </main>
        <Contact />
      </>
    );
  }

  const index = writings.findIndex((w) => w.slug === slug);
  const newer = writings[index - 1];
  const older = writings[index + 1];
  const meta: [string, string][] = [
    ["Filed", writing.date ? formatDate(writing.date) : ""],
    ["Length", `${writing.minutes} min`],
    ["Subject", writing.subject ?? ""],
    ["Place", writing.place ?? ""],
  ];

  return (
    <>
      <main id="main" className="mx-auto max-w-[1400px] px-4 pt-28 md:px-8 md:pt-40">
        <BackLink />
        <header className="mt-10 grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-16 lg:pt-14">
          <MaskedTitle
            as="h1"
            text={writing.title}
            className="max-w-[20ch] text-5xl font-medium leading-[1.04] tracking-[-0.035em] md:text-7xl"
          />
          <Reveal delay={0.2}>
            <dl className="grid max-w-[22rem] gap-x-6 gap-y-2 text-[14px] lg:mt-3">
              {meta
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-line pb-2">
                    <dt className="font-mono text-[12px] uppercase tracking-[0.08em] text-soft">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>
            {writing.draft && <p className="mt-4 text-[13px] text-soft">Draft: only visible on your own computer.</p>}
          </Reveal>
        </header>

        <article className="mt-16 pb-24 md:mt-24 md:pb-32">
          <Reveal onLoad delay={0.45}>
            {writing.html ? <RichText html={writing.html} /> : <Prose blocks={writing.blocks} />}
          </Reveal>
        </article>

        {(newer || older) && (
          <nav aria-label="More writings" className="grid gap-px border-t border-line md:grid-cols-2">
            {newer ? <Neighbour writing={newer} label="Newer" /> : <span />}
            {older ? <Neighbour writing={older} label="Older" align="right" /> : <span />}
          </nav>
        )}
        <div className="pb-24 pt-10 md:pb-32">
          <Link to="/writings" className="inline-flex items-center gap-3 text-[15px] font-medium">
            <ArrowLeft className="size-4" />
            All {WRITINGS_NAME.toLowerCase()}
          </Link>
        </div>
      </main>
      <Contact />
    </>
  );
}

function BackLink() {
  return (
    <Link to="/writings" className="group inline-flex items-center gap-3 text-[15px] text-muted transition-colors hover:text-fg">
      <ArrowLeft className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-1" />
      Back to all {WRITINGS_NAME.toLowerCase()}
    </Link>
  );
}

function Neighbour({ writing, label, align }: { writing: Writing; label: string; align?: "right" }) {
  return (
    <Link to={`/writings/${writing.slug}`} className={`group block py-8 md:py-10 ${align === "right" ? "md:text-right" : ""}`}>
      <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-soft">
        {label}
        {writing.date ? `  ·  ${formatDate(writing.date)}` : ""}
      </p>
      <p className="mt-2 text-xl font-medium leading-snug tracking-[-0.02em] transition-opacity group-hover:opacity-60 md:text-2xl">{writing.title}</p>
    </Link>
  );
}
