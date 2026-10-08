import { AnimatePresence } from "motion/react";
import { matchPath, useLocation } from "react-router";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { CaseStudySheet } from "./pages/CaseStudy";
import { NotFound } from "./pages/NotFound";

export default function App() {
  const { pathname } = useLocation();
  const work = matchPath("/work/:slug", pathname);
  // Home stays mounted under an open case study, so closing it lands exactly where the reader left.
  const showHome = pathname === "/" || !!work;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[80] rounded-[10px] bg-fg px-4 py-2 text-on-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      {showHome ? <Home /> : <NotFound />}
      <AnimatePresence>{work && <CaseStudySheet key="case-study" slug={work.params.slug ?? ""} />}</AnimatePresence>
    </>
  );
}
