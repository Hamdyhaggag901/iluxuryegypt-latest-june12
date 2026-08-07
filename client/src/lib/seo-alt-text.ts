// Centralized, automatic alt-text generation for content images — mirrors the
// philosophy of server/seo-meta.ts's resolvePageMeta: derive descriptive text
// from whatever fields the record already has, so new hotels/tours/posts get
// good alt text the moment they're saved from the admin, with no manual entry
// and no dedicated alt-text column in the database.

interface HotelForAlt {
  name: string;
  location?: string | null;
  type?: string | null;
  gallery?: string[] | null;
  galleryAlt?: Record<string, string> | null;
}

interface TourForAlt {
  title: string;
  category?: string | null;
}

interface PostForAlt {
  titleEn: string;
  category?: string | null;
}

/**
 * @param index Omit for the hero/main image. Pass the 0-based index for gallery photos.
 */
export function getHotelImageAlt(hotel: HotelForAlt, index?: number): string {
  const location = hotel.location ? `, ${hotel.location}` : "";
  if (index === undefined) {
    const type = hotel.type ? ` — ${hotel.type}` : "";
    return `${hotel.name}${location}, Egypt${type}`;
  }
  const url = hotel.gallery?.[index];
  const customAlt = url ? hotel.galleryAlt?.[url]?.trim() : undefined;
  if (customAlt) return customAlt;
  return `${hotel.name}${location} — gallery photo ${index + 1}`;
}

/**
 * @param index Omit for the hero/main image. Pass the 0-based index for gallery photos.
 */
export function getTourImageAlt(tour: TourForAlt, index?: number): string {
  const category = tour.category ? ` — ${tour.category}` : "";
  if (index === undefined) {
    return `${tour.title}${category}`;
  }
  return `${tour.title} — photo ${index + 1}`;
}

export function getPostImageAlt(post: PostForAlt): string {
  const category = post.category ? ` — ${post.category}` : "";
  return `${post.titleEn}${category}`;
}
