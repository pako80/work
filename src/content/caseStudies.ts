/*
 * Case study content.
 *
 * Only the project names, company and role are real. Everything else is
 * placeholder copy written as an instruction. Images are phone mockups
 * (transparent PNG, 936 x 1836); two KTO sportsbook screens stand in for every
 * project until each has its own. Replace both, then set `draft: false`.
 *
 * Impact values animate when they start with a number ("38%", "2.4x", "120k").
 */

export interface Image {
  src: string;
  alt: string;
}

export interface Stage {
  name: string;
  summary: string;
  /** Separate paragraphs with a blank line (\n\n). */
  body: string;
  /** Optional numbered list shown under the body text. */
  points?: string[];
  /** Optional second block of text shown under the first. */
  more?: { body: string; points?: string[] };
  /** One or two phone mockups. */
  shots?: Image[];
  /** Animated badges side by side instead of phones. */
  badges?: Badge[];
  /** A cropped screenshot of one screen, without a phone frame. */
  screen?: Screen;
  /** A finished wide image (cards, components) shown whole and centred on the panel, without phones. */
  image?: Image;
  /** Width of that image as a percentage of the panel. Above 100 the panel edge crops it. Defaults to 100. */
  imageWidth?: number;
  /** Nudge of that image inside the panel in pixels, as [right, down]. */
  imageOffset?: [number, number];
  /** Pin a tall image to the panel's bottom edge, so the panel crops the top of it. */
  imageBottom?: boolean;
  /** Phones enlarged so the panel's bottom edge crops them. */
  crop?: boolean;
  /** A short label under the image: just the title of what it shows. */
  caption?: string;
  /** An SVG of the component this step is about, shown under the text. */
  illustration?: Screen;
}

/** A tightly cropped screenshot of one screen. Width and height are the file's own pixels. */
export interface Screen extends Image {
  width: number;
  height: number;
  /** Where the top edge sits in its panel, as a percentage of the panel height. Defaults to 10. */
  top?: number;
  /** Display size relative to the file's own size, for illustrations. Defaults to 1. */
  scale?: number;
  /** Extra space above the screenshot, like the status bar of a phone, as a percentage of the screen's width. */
  headerSpace?: number;
  /** Colour of that space and of the screen behind it. Match the top of the screenshot. Defaults to black. */
  headerBg?: string;
}

/** A Lottie icon with a text label drawn in the icon's own colour. */
export interface Badge {
  /** Path to a Lottie JSON file in public/. */
  src: string;
  label: string;
  /** The icon's main colour, reused for the label so the two always match. */
  color: string;
}

export interface StudyLink {
  label: string;
  url: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Learning {
  statement: string;
  body: string;
}

export interface CaseStudy {
  slug: string;
  /** Shows a "Coming soon" label on the project's cards. */
  comingSoon?: boolean;
  draft: boolean;
  title: string;
  /** Two or three sentences shown on the work card. */
  description: string;
  company: string;
  role: string;
  years: string;
  /** The phone shown on this project's cards, in the hero and the carousels. */
  thumbnail: Image;
  introduction: string[];
  impact: { lead: string; metrics: Metric[] };
  stages: Stage[];
  /** Up to six full-size phone screenshots shown in the Solution section. */
  outcomeScreens: Image[];
  /** Optional text links, e.g. live prototypes. The Links section only shows when this has entries. */
  links?: StudyLink[];
  learnings: Learning[];
}

// Placeholder mockups, until each project has its own screens in public/work/<slug>/.
const players: Image = { src: "/work/mockups/players.png", alt: "Placeholder: KTO sportsbook, top players market" };
// Sportsbook "Define" copy.
const defineBody =
  "Working with a platform like Kambi allows designers to add custom widgets, these are areas in the frontend where operators can inject their custom code to improve the UX. We identified a list of areas of improvements:";
const definePoints = ["Event Cards", "Navigation", "Player Props", "Combi & Bet Builder Bets", "FOMO components", "Redesigned Live Lobby"];

// One improvement area of the sportsbook, titled by its name. Text is a placeholder until written.
const areaStage = (
  name: string,
  media: Pick<Stage, "shots" | "badges" | "screen">,
  body = "Replace with what the problem was in this area, what you designed, and what changed as a result.",
  caption = name,
): Stage => ({
  name,
  summary: name,
  body,
  caption,
  ...media,
});

// FOMO badges, in the colours of the Lottie animations they sit beside.
const fomoBadges: Badge[] = [
  { src: "/lottie/fomo-top.json", label: "Sizzling", color: "#ff5353" },
  { src: "/lottie/fomo-hot.json", label: "Hot", color: "#fa9600" },
  { src: "/lottie/fomo-trending.json", label: "Trending", color: "#fad749" },
];
const sportsbookHome: Image = { src: "/work/mockups/sportsbook-home.png", alt: "KTO sportsbook home screen with a Raphinha to score boost, popular events and the Brasileirão match list" };
const casinoExploreHome: Image = { src: "/work/mockups/casino-explore-home.png", alt: "KTO native casino home with featured game carousel, filters and Continue Playing" };
const casinoExplore: Image = { src: "/work/mockups/casino-explore.png", alt: "KTO native casino Explore screen with search, suggested games and top categories" };
const casinoBestGames: Image = { src: "/work/mockups/casino-best-games.png", alt: "KTO native casino home scrolled to Best Games, Promotions and Top 10 on KTO" };
const casinoProviders: Image = { src: "/work/mockups/casino-providers.png", alt: "KTO native casino Select Providers filter with provider chips" };
const casinoDeposit: Image = { src: "/work/mockups/casino-deposit.png", alt: "KTO native casino in-game Deposit sheet over Ganesha Gold with quick amounts" };
const casinoCrash: Image = { src: "/work/mockups/casino-crash-games.png", alt: "KTO native casino Crash Games category with sort by popularity" };
const casinoVisuals: Image = { src: "/work/mockups/casino-visuals.png", alt: "KTO native casino game cards: Ganesha Fortune, The Tiger Is Back and The Great Icescape" };
const casinoNavigationGames: Image = { src: "/work/mockups/casino-navigation-games.png", alt: "Game cards in the native casino: Piggy Gold, Fortune Dragon and Fortune Tiger" };
const casinoFiltering: Image = { src: "/work/mockups/casino-filtering.png", alt: "Game filtering in the native casino" };
const casinoDepositPhone: Image = { src: "/work/mockups/casino-deposit.png", alt: "KTO native casino in-game Deposit sheet over Ganesha Gold with quick amounts" };
const casinoHome: Image = { src: "/work/mockups/casino-home.png", alt: "KTO casino home screen with the Icescape promotion, game categories, Continue Playing and Best Games" };
const jackpotsHome: Image = { src: "/work/mockups/jackpots-home.png", alt: "KTO Jackpot screen with the Mega, Major, Minor and Mini prizes above the prize wheel" };
const trunfoHome: Image = { src: "/work/mockups/trunfo-home.png", alt: "KTO Trunfo opt-in screen: draw a card daily, collect cards and claim rewards" };
// Player props market screen, cropped tightly to the screen.
const playerProps: Screen = {
  src: "/work/mockups/player-props.png",
  alt: "KTO sportsbook Players tab listing top players with their to score and to score or assist odds",
  width: 750,
  height: 1253,
  top: 2,
  headerSpace: 12,
};
// The event card component, drawn as an SVG for the Event Cards step.
const eventCardComponent: Screen = {
  src: "/work/components/sports-card.svg",
  alt: "The event card component: teams, live score, match winner odds and a Hot trend label",
  width: 320,
  height: 146,
};
// The navigation component, drawn as an SVG for the Navigation step.
const navigationComponent: Screen = {
  src: "/work/components/sports-navigation.svg",
  alt: "The navigation component: the Popular, Live and Players tabs above the Football, Tennis, Basketball and More Sports chips",
  width: 392,
  height: 100,
};
// The multipurpose widget, drawn as an SVG for the Combi & Bet Builder Bets step.
const multipurposeWidget: Screen = {
  src: "/work/components/sports-multipurpose-widget.svg",
  alt: "The multipurpose widget: a Gaucho Goal Fest promotion for Both Teams to score, with two picks, a Show More link and boosted odds",
  width: 320,
  height: 201,
};

// The FOMO illustration, drawn as an SVG for the FOMO component step.
const fomoIllustration: Screen = {
  src: "/work/components/sports-fomo.svg",
  alt: "An event card carrying a FOMO label: Flamengo against Bahia, live score, match winner odds and a Sizzling tag",
  width: 367,
  height: 144,
};

// The live lobby illustration, drawn as an SVG for the Redesigned Live Lobby step.
const liveLobbyIllustration: Screen = {
  src: "/work/components/sports-live.svg",
  alt: "The redesigned live lobby: filter chips, the Multiplas View switch and a Pinned section with a live tennis match and its odds",
  width: 371,
  height: 300,
};

// The player props row component, drawn as an SVG for the Player Props step.
const playerPropsComponent: Screen = {
  src: "/work/components/sports-playerprops.svg",
  alt: "The player props row component, a player with their match, kick-off time and two 1.60 odds buttons, above a set of football shirt icons in different kit colours with numbers",
  width: 346,
  height: 198,
};

// The live lobby on the Hot tab: live tennis matches with scores and Match Winner odds.
const liveHot: Image = {
  src: "/work/mockups/live-hot.png",
  alt: "KTO sportsbook live lobby on the Hot tab: live tennis matches with set scores and Match Winner odds",
};

// The live lobby with two pinned matches: the Pin filter holds the matches a customer is following.
const livePinned: Image = {
  src: "/work/mockups/live-pinned.png",
  alt: "KTO sportsbook live lobby with the Pin filter showing two pinned live tennis matches and their Match Winner odds",
};

// The Players tab with the Filters sheet open: pick teams, then Apply.
const playerFilters: Image = {
  src: "/work/mockups/player-filters.png",
  alt: "KTO sportsbook Players tab with the Filters sheet open, showing a team list with checkboxes and Clear All and Apply buttons",
};

// The lobby home screen, where the event cards appear under "Eventos Populares".
const eventCardsScreen: Screen = {
  src: "/work/mockups/event-cards.png",
  alt: "KTO sportsbook home screen: sport chips, a Raphinha to score boost, the Eventos Populares event cards and the Popular, Live and Players tabs",
  width: 750,
  height: 1374,
  top: 2,
  headerSpace: 6,
};

// The lobby below the league list: the Combinations section with a combination card.
// Raised so the Combinations cards sit inside the tile instead of the league list above them.
const combinationsScreen: Screen = {
  src: "/work/mockups/combinations.png",
  alt: "KTO sportsbook lobby: the league list, then the Combinations section with a Clash of the Titans combination card and its total odds",
  width: 750,
  height: 1338,
  top: -9,
};

// The lobby navigation: the Popular, Live and Players tabs over the sport chips and the market selector.
const navigationScreen: Screen = {
  src: "/work/mockups/navigation.png",
  alt: "KTO sportsbook lobby navigation: the Popular, Live and Players tabs, the sport chips and the Choose a market selector above the Brasileirao match list",
  width: 750,
  height: 1410,
  top: 2,
  headerSpace: 6,
};

// The redesigned live lobby: pinned events, Hot filter and live matches under Popular.
const liveLobbyScreen: Screen = {
  src: "/work/mockups/live-lobby.png",
  alt: "KTO sportsbook live lobby: pin and Hot filters, a Multiplas view switch, and live and half time matches under Popular with Sizzling and Hot labels",
  width: 750,
  height: 1320,
  top: 2,
  headerSpace: 6,
};

// The lobby before the redesign: three rows of navigation stacked above the match list.
const oldLobby: Screen = {
  src: "/work/mockups/old-lobby.png",
  alt: "The previous lobby: three rows of navigation (league tabs, league chips and a league header) above the match list",
  width: 575,
  height: 904,
  top: 2,
  headerSpace: 10,
  headerBg: "#1e1e1e",
};
const brasileirao: Image = { src: "/work/mockups/brasileirao.png", alt: "Placeholder: KTO sportsbook, Brasileirão match list" };

/*
 * Placeholder scaffolding shared by every study until real content lands.
 * Once a study has real material, replace its `...draftContent(slug)` spread
 * with the actual fields.
 */
const draftContent = () => ({
  draft: true,
  description:
    "Replace with two or three sentences about the project. What the problem was, what you and the team did, and the result it led to.",
  years: "Add year",
  introduction: [
    "Replace with the starting point. What did the business need, who was it for, and why did design matter to the outcome? Two or three sentences.",
    "Replace with your role. What you owned, who you partnered with, and the decisions that were yours to make.",
  ],
  impact: {
    lead: "Replace with a one-line headline result the reader should remember.",
    metrics: [
      { value: "00%", label: "Metric to add, e.g. conversion uplift" },
      { value: "00%", label: "Metric to add, e.g. retention change" },
      { value: "00k", label: "Metric to add, e.g. monthly active players" },
    ],
  },
  stages: [
    {
      name: "Discover",
      summary: "Replace with what you set out to learn.",
      body: "Describe the research: who you spoke to, what data you looked at, and the insight that changed the direction.",
      shots: [players],
    },
    {
      name: "Define",
      summary: "Replace with the problem you committed to.",
      body: "Describe how you aligned stakeholders on one problem statement and the principles that guided the work.",
      shots: [brasileirao, players],
    },
    {
      name: "Develop",
      summary: "Replace with how the solution took shape.",
      body: "Describe the prototypes, the tests you ran, and what you killed along the way.",
      shots: [brasileirao],
    },
    {
      name: "Deliver",
      summary: "Replace with how it shipped.",
      body: "Describe the partnership with engineering, the rollout, and what happened after launch.",
      shots: [players, brasileirao],
    },
  ],
  outcomeScreens: [players, brasileirao, players],
  learnings: [
    {
      statement: "Replace with the first thing you would tell another design lead.",
      body: "One or two sentences on why it mattered.",
    },
    {
      statement: "Replace with what you would do differently next time.",
      body: "One or two sentences on what it cost and what you changed.",
    },
  ],
});

const kto = { company: "KTO Group", role: "Head of Design" };

export const caseStudies: CaseStudy[] = [
  {
    slug: "kto-sportsbook-redesign",
    title: "KTO Sportsbook",
    ...kto,
    ...draftContent(),
    description: "A complete redesign of the sportsbook lobby, live lobby and player prop offering based on the Kambi APIs.",
    thumbnail: sportsbookHome,
    stages: [
      {
        name: "Discover & Define",
        summary: "Discover & Define",
        body: "The old lobby struggled to surface the right events at the right time, required significant manual effort to curate relevant events, and relied on a convoluted three-tier navigation structure that overwhelmed customers.",
        more: { body: defineBody, points: definePoints },
        screen: oldLobby,
        caption: "The old lobby",
      },
      {
        ...areaStage(
          "Event Cards",
          { screen: eventCardsScreen },
          "Event cards immediately surfaced the most important events at any given time whether it is live or prematch. Their purpose was not just a faster way to bet on the winner but also a fast access to the event page of the most relevant events.",
        ),
        illustration: eventCardComponent,
      },
      {
        ...areaStage(
          "Navigation",
          { screen: navigationScreen },
          "Navigation was redesigned to help users move quickly between sports and leagues using an intuitive accordion structure. The Popular tab surfaced the most relevant events based on real-time betting activity, while the Live tab dynamically prioritised the most popular live events at any given moment. This created a more responsive, data-driven navigation experience that helped users find relevant betting opportunities faster.",
        ),
        illustration: navigationComponent,
      },
      {
        ...areaStage(
          "Player Props",
          { screen: playerProps },
          "A redesigned interface for the player bets, complete with trend logic and a complete football shirt icon system, was designed to make the offering more accessible within the lobby and list them by popularity while allowing the customer to choose the most popular markets.",
        ),
        illustration: playerPropsComponent,
      },
      {
        ...areaStage(
          "Combi & Bet Builder Bets",
          { screen: combinationsScreen },
          "Combi and Bet Builder bets represented a significant share of KTO’s sports revenue, so introducing a pre-packed solution had a direct and meaningful impact on performance. Integrated FOMO mechanics and event narratives helped create a stronger sense of urgency and relevance, while aligning the product experience with KTO’s marketing and social media activity.",
        ),
        illustration: multipurposeWidget,
      },
      {
        ...areaStage(
          "FOMO component",
          { badges: fomoBadges },
          "A set of Lottie icon animations was designed and developed to visually communicate different levels of event popularity. The animations became stronger at higher popularity tiers, creating a clear sense of momentum and FOMO, particularly around the most popular events, and encouraging users to explore and engage with them.",
        ),
        illustration: fomoIllustration,
      },
      {
        ...areaStage(
          "Redesigned Live Lobby",
          { screen: liveLobbyScreen },
          "The Live lobby was redesigned from the ground up, with a new Hot tab surfacing the most popular live events in real time. This brought previously hidden opportunities, such as major Grand Slam matches, to the forefront, making them easier for customers to discover and bet on. The new Pin feature allowed users to follow multiple live bets throughout the lifecycle of an event, giving them a more focused and persistent way to track their bets.",
        ),
        illustration: liveLobbyIllustration,
      },
    ],
    role: "Lead Designer",
    years: "2025-2026",
    // Six screens, two rows of three.
    outcomeScreens: [sportsbookHome, brasileirao, players, liveHot, livePinned, playerFilters],
    links: [
      { label: "Live Lobby Prototype", url: "https://livelobby-lyart.vercel.app/" },
      { label: "Bet Tracking Prototype", url: "https://bettracking.vercel.app" },
      { label: "Sports Search Prototype", url: "https://sportsearch-ashy.vercel.app" },
    ],
    learnings: [
      {
        statement: "Surfacing what’s relevant is one of the most important challenges to get right when designing sports interfaces.",
        body: "By prioritising relevance over traditional search and navigation patterns, we can reduce reliance on legacy structures, many of which are dictated by sportsbook providers rather than designed around the customer’s needs.",
      },
      {
        statement: "Swiping cards are often underutilised, with operators typically reserving the pattern for promotional content.",
        body: "By applying the same interaction to live events, we turned a familiar browsing pattern into a more engaging way to explore betting opportunities, resulting in significantly stronger customer engagement.",
      },
    ],
    impact: {
      metrics: [
        { value: "+10%", label: "Jump of player engagement with previously difficult-to-find-markets like player props" },
        { value: "30%", label: "Reduction of time to place a three fold combination bet" },
        { value: "23.4%", label: "Reduction of time to find and place a live 1x2 bet" },
      ],
      lead: "A significantly improved, fully automated lobby powered by a trends service that increased event relevance, simplified navigation, enriched punters with useful information, and introduced FOMO-driven elements to encourage engagement.",
    },
    introduction: [
      "As a brand with sports in its DNA, KTO wanted to own every part of their sportsbook offering, adding relevance, automation and improving flows.",
      "I worked with stakeholders and PMs and tech to create a new design system and build a completely new front end based on the Kambi APIs.",
    ],
  },
  {
    slug: "kto-native-casino",
    title: "KTO Native Casino",
    ...kto,
    ...draftContent(),
    introduction: [
      "The challenge was to bring KTO’s web casino experience to native, while preserving the simplicity and usability customers already loved.",
      "At the same time, we introduced native-specific features such as improved filtering and richer game information, including slot volatility, to help customers discover and choose games more easily.",
    ],
    impact: {
      ...draftContent().impact,
      lead: "Within the first six months, 55% of customers had moved to the native app, embracing a more immersive and engaging casino experience.",
      metrics: [
        { value: "55%", label: "of existing customers moved to the app in the first 6 months" },
      ],
    },
    description: "A fully native redesign of KTO’s main casino vertical based on the inhouse platform.",
    thumbnail: casinoHome,
    stages: [
      {
        name: "Discover & Define",
        summary: "Discover & Define",
        body: "",
        points: ["Simplify Navigation", "Enrich UI With Casino Visuals", "Game Filtering", "In-Game Deposit", "Improved Search"],
        shots: [casinoHome],
        crop: true,
      },
      {
        name: "Simplify Navigation",
        summary: "Simplify Navigation",
        body: "Improve categorisation and leverage native functionality like swipe left and swipe right to navigate between categories.",
        image: casinoNavigationGames,
        imageWidth: 100,
        shots: [],
      },
      {
        name: "Enrich UI With Casino Visuals",
        summary: "Enrich UI With Casino Visuals",
        body: "The casino experience was enriched by leveraging game imagery and visual elements to create a more immersive, Netflix-like browsing experience.\n\nThe goal was to move beyond a functional game catalogue and make discovery more engaging, using rich visuals, curated content and stronger hierarchy to help customers quickly find games they want to play.",
        image: casinoVisuals,
        imageWidth: 135,
        shots: [],
      },
      {
        name: "Game Filtering",
        summary: "Game Filtering",
        body: "The game filtering experience was redesigned to make finding relevant titles faster and more intuitive. Popularity logic was improved to surface the most relevant games, while new filters allowed customers to search by game name and provider.\n\nThe UX focused on reducing browsing effort and giving customers more control over how they discover and navigate the game catalogue.",
        image: casinoFiltering,
        imageWidth: 100,
        imageOffset: [100, 100],
        shots: [],
      },
      {
        name: "In-Game Deposit",
        summary: "In-Game Deposit",
        body: "The In-Game Deposit feature was designed to remove friction from the deposit journey, allowing customers to top up their account without leaving the game.\n\nBy keeping the deposit experience within the gameplay context, the UX reduced disruption and made it faster and easier for customers to continue playing, contributing to increased deposit activity.",
        image: casinoDepositPhone,
        imageWidth: 80,
        imageBottom: true,
        shots: [],
      },
      {
        name: "Improved Search",
        summary: "Improved Search",
        body: "A new Explore feature was designed to make game discovery more intuitive and personalised. Instead of relying solely on categories and filters, the experience recommends games based on customer interests, behaviour and previous play.\n\nThe UX was designed to reduce the effort of finding something new, while giving customers a more relevant and engaging way to browse the casino.",
        image: casinoExplore,
        imageWidth: 80,
        imageBottom: true,
        shots: [],
      },
    ],
    years: "2025-2026",
    learnings: [],
    outcomeScreens: [casinoExploreHome, casinoBestGames, casinoCrash, casinoDeposit, casinoProviders, casinoExplore],
  },
  {
    slug: "kto-jackpots",
    title: "KTO Jackpot",
    ...kto,
    ...draftContent(),
    description: "A side-bet jackpot product for casino slots, built on PrizeFlex APIs. The experience gives customers an additional chance to win progressive jackpot rewards while playing their favourite games.",
    thumbnail: jackpotsHome,
    comingSoon: true,
  },
  {
    slug: "kto-trunfo",
    title: "KTO Trunfo",
    ...kto,
    ...draftContent(),
    description: "An in-house reward-based card game designed to drive daily engagement. Customers collect and open card packs, with each pack offering the chance to unlock rewards daily.",
    thumbnail: trunfoHome,
    comingSoon: true,
  },
];

/** The single phone shown on a project's cards (home hero and carousels). */
export const thumbnailOf = (study: CaseStudy): Image => study.thumbnail;

export const findCaseStudy = (slug: string | undefined) =>
  caseStudies.find((c) => c.slug === slug);
