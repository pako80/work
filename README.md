# Mario Borg, Selected Work

In-depth case-study portfolio. Same visual language as marioborg.com (Circular Std, #f3f3f0, square corners), with scroll-led storytelling.

```bash
npm i
npm run dev     # http://localhost:5174
npm run build   # outputs to dist/
```

## Adding real content

All content lives in `src/content/caseStudies.ts`. Each case study has the five sections:
Introduction, Impact, Key stages, Solution (a gallery of up to six phone screenshots), Learnings.

- Every string starting with "Replace with" or "Add" is a placeholder. Swap in real copy.
- Images are phone mockups: transparent PNGs at 936x1836 (the KTO mockup frame). Two sportsbook screens in
  `public/work/mockups/` stand in for every project. Put each project's own screens in `public/work/<slug>/` and list them:
  `thumbnail` is the one phone shown on the cards, each stage `shots` takes 1-2, and `outcomeScreens` (the Solution gallery) takes up to 6.
- A stage's picture is one of: phone mockups (`shots`, add `crop: true` to enlarge and crop them), a finished image
  on the panel (`image`, with `imageWidth`, `imageOffset` or `imageBottom` to size and place it), a cropped screenshot
  (`screen`), or animated badges (`badges`). A stage's `body` can hold several paragraphs, separated by a blank line.
- Text links to prototypes go in a project's `links` list. They show as a Prototypes section and tab.
- `comingSoon: true` puts a "Coming soon" label on a project and turns its carousel card into a non-link.
- An empty `learnings` list hides the Learnings section and tab.
- Impact values count up when they start with a number ("38%", "2.4x", "120k").
- Set `draft: false` when a study is ready (the flag is kept for tracking; no badge is shown).

Deploying as an SPA: route all paths to `index.html` (Vercel/Netlify do this with a rewrite rule).
