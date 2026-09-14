// One definition of "is this blog post live", shared by every surface that has
// to answer the question: the public list endpoint, the single post endpoint,
// the sitemap, and the server rendered meta tags.
//
// Scheduling is deliberately NOT driven by a background job that flips a flag
// at the appointed minute. A post going live is a pure function of its own two
// fields and the current time, evaluated wherever it is read. There is no
// window in which a cron has not yet run and the post is visible in one place
// but not another, and nothing to recover if the process restarts.
//
// The three states an editor can choose map onto those two fields:
//
//   Draft         status !== "published"
//   Publish now   status === "published", scheduledAt null
//   Schedule      status === "published", scheduledAt in the future
//
// scheduled_at is a timestamptz, unlike the older naive timestamp columns on
// this table. A scheduled time is an instant, and storing it without a zone
// would make "9am" mean different things depending on the server's TZ setting.

export interface PostVisibilityFields {
  status?: string | null;
  scheduledAt?: Date | string | null;
}

/** True when the post should be visible to the public right now. */
export function isPostLive(post: PostVisibilityFields, now: Date = new Date()): boolean {
  if (post.status !== "published") return false;
  if (!post.scheduledAt) return true;
  const at = post.scheduledAt instanceof Date ? post.scheduledAt : new Date(post.scheduledAt);
  // An unparseable value is treated as "not yet": failing closed keeps an
  // unfinished article off the site, which is the recoverable direction.
  if (Number.isNaN(at.getTime())) return false;
  return at.getTime() <= now.getTime();
}

/** True when the post is published but still waiting for its moment. */
export function isPostScheduled(post: PostVisibilityFields, now: Date = new Date()): boolean {
  return post.status === "published" && !!post.scheduledAt && !isPostLive(post, now);
}

/** Draft / Scheduled / Published, for the admin list badge. */
export function postState(post: PostVisibilityFields, now: Date = new Date()): "draft" | "scheduled" | "published" {
  if (post.status !== "published") return "draft";
  return isPostScheduled(post, now) ? "scheduled" : "published";
}
