// The categories a blog post can be filed under.
//
// This list was duplicated in three places: the create dialog, the edit dialog
// and the public blog page's filter bar. A post given a category outside it is
// not a soft problem, it is invisible: the blog page filters on exact string
// equality, so an unrecognised value means the post appears under no filter at
// all. Keeping one copy is what stops that happening again.
//
// "All Posts" is the filter bar's "no filter" entry, not a real category, so it
// is kept separate from the values a post may actually be assigned.

export const POST_CATEGORIES = [
  "Culture & History",
  "Travel Tips",
  "Destinations",
  "Food & Culture",
  "Travel Planning",
  "Responsible Travel",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

/** The filter bar's options, including the "show everything" entry. */
export const ALL_POSTS = "All Posts";
export const POST_CATEGORY_FILTERS = [ALL_POSTS, ...POST_CATEGORIES];

export function isPostCategory(value: string | null | undefined): value is PostCategory {
  return !!value && (POST_CATEGORIES as readonly string[]).includes(value);
}
