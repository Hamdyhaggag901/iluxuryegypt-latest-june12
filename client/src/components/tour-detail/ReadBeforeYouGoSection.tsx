import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock } from "lucide-react";
import { curateReadBeforeYouGo, estimateReadMinutes, type CuratablePost } from "@/lib/article-curation";
import { getPostImageAlt } from "@/lib/seo-alt-text";
import { openLinkInNewTab } from "@/lib/open-in-new-tab";

export default function ReadBeforeYouGoSection() {
  const { data } = useQuery<{ success: boolean; posts: CuratablePost[] }>({
    queryKey: ["/api/blog/posts"],
  });

  const posts = data?.posts || [];
  const curated = curateReadBeforeYouGo(posts);

  if (curated.length === 0) return null;

  return (
    <section id="read-before-you-go" className="py-12 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-16">
          <div>
            <div className="w-12 md:w-16 h-px bg-accent mb-4 md:mb-6"></div>
            <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">
              Before Your Trip
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-primary mt-3 md:mt-4">
              Read Before You Go
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-xl">
              Practical guidance from our team for a first visit to Egypt — what to pack, when to go, and what to
              expect once you land.
            </p>
          </div>
          <Link href="/blog" target="_blank" rel="noopener noreferrer" onClick={openLinkInNewTab}>
            <span className="inline-block text-sm font-medium text-primary border-b border-accent pb-0.5 hover:text-accent transition-colors cursor-pointer whitespace-nowrap">
              View All Travel Guides
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {curated.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" onClick={openLinkInNewTab}>
              <article className="group cursor-pointer">
                {post.featuredImage && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img
                      src={post.featuredImage}
                      alt={getPostImageAlt(post)}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="font-serif text-lg text-primary leading-snug mb-2 transition-colors group-hover:text-accent">
                  {post.titleEn}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{estimateReadMinutes(post.bodyEn)} min read</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
