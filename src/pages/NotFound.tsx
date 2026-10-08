import { Link } from "react-router";

export function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-4 md:px-8">
      <h1 className="text-5xl font-medium tracking-[-0.035em] md:text-7xl">This page does not exist.</h1>
      <p className="mt-6 max-w-[44ch] text-lg text-muted">The link may be old, or the case study may have moved.</p>
      <Link to="/" className="mt-10 inline-flex w-fit rounded-[10px] bg-fg px-6 py-4 text-[15px] font-medium text-on-fg active:scale-[0.98]">
        Back to all work
      </Link>
    </main>
  );
}
