declare module "virtual:writings-docx" {
  /** The Word files in src/writings/, already converted (see vite-writings.ts). */
  const entries: {
    slug: string;
    title: string;
    date: string;
    subject?: string;
    place?: string;
    summary?: string;
    draft: boolean;
    html: string;
    minutes: number;
    excerpt: string;
  }[];
  export default entries;
}
