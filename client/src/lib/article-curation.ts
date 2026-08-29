// Picks the blog articles most relevant to a first-time Egypt visitor for
// the tour page's "Read Before You Go" section, using whatever the post
// already has (category/tags, falling back to title/excerpt text) — no new
// CMS field required, and it degrades gracefully if an admin hasn't
// consistently tagged all posts.

export interface CuratablePost {
  slug: string;
  titleEn: string;
  excerpt?: string | null;
  category?: string | null;
  tags?: string[] | null;
  featuredImage?: string | null;
  bodyEn?: string | null;
}

const RELEVANT_KEYWORDS = [
  "egypt travel tips",
  "what to pack",
  "packing",
  "visa",
  "best time to visit",
  "first-time",
  "first time",
  "etiquette",
  "safety",
  "currency",
  "money",
  "tipping",
  "what to wear",
  "travel guide",
  "before you go",
  "getting around",
  "climate",
  "weather",
];

function scorePost(post: CuratablePost): number {
  const haystack = [post.category, ...(post.tags || []), post.titleEn, post.excerpt]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return RELEVANT_KEYWORDS.reduce((score, kw) => (haystack.includes(kw) ? score + 1 : score), 0);
}

/**
 * Returns up to `limit` posts, ranked by relevance. If fewer than `minCount`
 * posts actually match the first-time-visitor keyword set, fills the rest
 * from the remaining posts (in the order given) rather than showing a
 * sparse section — real content may not have every post tagged.
 */
export function curateReadBeforeYouGo(
  posts: CuratablePost[],
  { limit = 6, minCount = 4 }: { limit?: number; minCount?: number } = {}
): CuratablePost[] {
  const scored = posts.map((post) => ({ post, score: scorePost(post) })).sort((a, b) => b.score - a.score);
  const matched = scored.filter(({ score }) => score > 0).map(({ post }) => post);

  if (matched.length >= minCount) return matched.slice(0, limit);

  const matchedSlugs = new Set(matched.map((p) => p.slug));
  const filler = posts.filter((p) => !matchedSlugs.has(p.slug));
  return [...matched, ...filler].slice(0, limit);
}

/** ~200 wpm reading estimate from the post body, stripped of HTML tags. */
export function estimateReadMinutes(bodyEn?: string | null): number {
  if (!bodyEn) return 3;
  const text = bodyEn.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}
