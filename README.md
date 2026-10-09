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
  on the panel (`image`, with `imageWidth`, `imageOffset`, `imageBottom` or `imageTop` to size and place it, and an
  optional `overlay` Lottie in its corner), a cropped screenshot (`screen`), animated badges (`badges`), a Lottie
  (`lottie`), a row of cards drifting right to left (`marquee`), or the flipping Trunfo card (`cardFlip`).
  A stage's `body` can hold several paragraphs, separated by a blank line.
- `heroShots` sets the phones the home hero cycles through for a project. An image can carry a screen recording
  (`video`, with the still as its poster) or show the flipping card (`cardFlip`).
- `gallery` adds a titled row of extra images under the Solution screens.
- Text links to prototypes go in a project's `links` list. They show as a section and tab named by `linksTitle`
  (default "Prototypes").
- `comingSoon: true` puts a "Coming soon" label on a project and turns its carousel card into a non-link.
- An empty `learnings` list hides the Learnings section and tab. A project with no impact headline and no metrics
  hides Impact.
- Impact values count up when they start with a number ("38%", "2.4x", "120k").
- Set `draft: false` when a study is ready (the flag is kept for tracking; no badge is shown).

## Deploying

1. Push to GitHub, then import the repo in Vercel. It detects Vite: build command `npm run build`, output `dist`.
2. `vercel.json` rewrites every path to `index.html`, so links like `/work/kto-jackpots` work on refresh. On Netlify, add the same rule in `_redirects`.
