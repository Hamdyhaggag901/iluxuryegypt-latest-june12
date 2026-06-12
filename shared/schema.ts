import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("editor"), // admin, editor, translator, viewer
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  destination: text("destination"),
  preferredDates: text("preferred_dates"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CMS Tables
export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleEs: text("title_es"),
  titleFr: text("title_fr"),
  titleJp: text("title_jp"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"), // draft, published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const sections = pgTable("sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").references(() => pages.id).notNull(),
  type: text("type").notNull(), // hero, text, gallery, carousel, pricing, etc
  orderIndex: integer("order_index").notNull().default(0),
  contentJson: jsonb("content_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleEs: text("title_es"),
  titleFr: text("title_fr"),
  titleJp: text("title_jp"),
  bodyEn: text("body_en"),
  bodyEs: text("body_es"),
  bodyFr: text("body_fr"),
  bodyJp: text("body_jp"),
  featuredImage: text("featured_image"),
  excerpt: text("excerpt"),
  category: text("category"),
  tags: text("tags").array(),
  focusKeyword: text("focus_keyword"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altEn: text("alt_en"),
  altEs: text("alt_es"),
  altFr: text("alt_fr"),
  altJp: text("alt_jp"),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
});

export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  location: text("location").notNull(),
  region: text("region").notNull(),
  type: text("type").notNull(),
  rating: integer("rating").notNull(),
  priceTier: text("price_tier").notNull(),
  amenities: text("amenities").array().notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"), // Extended description for about section
  highlights: text("highlights").array().notNull().default([]), // Hotel highlights
  gallery: text("gallery").array().notNull().default([]), // Gallery images
  rooms: jsonb("rooms").notNull().default([]), // Array of room objects
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  heroImage: text("hero_image").notNull(),
  gallery: text("gallery").array().notNull().default([]),
  highlights: text("highlights").array().notNull().default([]),
  attractions: jsonb("attractions").notNull().default([]),
  bestTimeToVisit: text("best_time_to_visit"),
  duration: text("duration"),
  difficulty: text("difficulty").default("Easy"),
  region: text("region").notNull(),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const tours = pgTable("tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  heroImage: text("hero_image").notNull(),
  gallery: text("gallery").array().notNull().default([]),
  duration: text("duration").notNull(),
  groupSize: text("group_size"),
  difficulty: text("difficulty").default("Easy"),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  includes: text("includes").array().notNull().default([]),
  excludes: text("excludes").array().notNull().default([]),
  itinerary: jsonb("itinerary").notNull(),
  destinations: text("destinations").array().notNull().default([]),
  category: text("category").notNull(),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  brochureUrl: text("brochure_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  heroImage: text("hero_image").notNull(),
  gallery: text("gallery").array().notNull().default([]),
  duration: text("duration").notNull(),
  groupSize: text("group_size"),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  includes: text("includes").array().notNull().default([]),
  excludes: text("excludes").array().notNull().default([]),
  tours: text("tours").array().notNull().default([]), // Array of tour IDs
  hotels: text("hotels").array().notNull().default([]), // Array of hotel IDs
  destinations: text("destinations").array().notNull().default([]), // Array of destination IDs
  category: text("category").notNull(),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  categoryType: text("category_type").notNull().default("packages"),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by").references(() => users.id),
});

// Navigation Items for Header
export const navItems = pgTable("nav_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  href: text("href").notNull(),
  parentId: varchar("parent_id"), // For dropdown items, references parent nav item
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Site Configuration (Header & Footer)
export const siteConfig = pgTable("site_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(), // e.g., 'header_logo', 'footer_logo', 'footer_description', etc.
  value: text("value").notNull(),
  type: text("type").notNull().default("text"), // text, image, json
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by").references(() => users.id),
});

// Footer Links (organized by sections)
export const footerLinks = pgTable("footer_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull(), // e.g., 'quick_links', 'experiences', 'support'
  label: text("label").notNull(),
  href: text("href").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Social Media Links
export const socialLinks = pgTable("social_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // facebook, instagram, twitter, etc.
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aboutPageContent = pgTable("about_page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(), // who-we-are, iluxury-difference, your-experience, trusted-worldwide
  heroImage: text("hero_image"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroDescription: text("hero_description"),
  sectionImages: jsonb("section_images").notNull().default({}), // Object with section image URLs
  sections: jsonb("sections").notNull().default([]), // Array of section content
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by").references(() => users.id),
});

// FAQ Items
export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"), // Optional category for grouping FAQs
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Newsletter Subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Hero Slides for Home Page
export const heroSlides = pgTable("hero_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  mediaType: text("media_type").notNull().default("video"), // "video" or "image"
  mediaUrl: text("media_url").notNull(),
  posterUrl: text("poster_url"), // poster image for videos
  subtitle: text("subtitle"),
  title: text("title").notNull(),
  description: text("description"),
  ctaText: varchar("cta_text", { length: 150 }),
  ctaLink: text("cta_link"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Siwa Section Content
export const siwaSection = pgTable("siwa_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediaType: text("media_type").notNull().default("video"), // "video" or "image"
  mediaUrl: text("media_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  ctaText: varchar("cta_text", { length: 150 }),
  ctaLink: text("cta_link"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Guest Experience Section Content
export const guestExperienceSection = pgTable("guest_experience_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  tagline: text("tagline"), // "Your journey, our promise."
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Why Choose Section Content
export const whyChooseSection = pgTable("why_choose_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Why Choose Cards (4 cards)
export const whyChooseCards = pgTable("why_choose_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Guest Testimonials/Reviews
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  location: text("location"),
  rating: integer("rating").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contact CTA Section (phone and email)
export const contactCtaSection = pgTable("contact_cta_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Stay Page Content Tables
export const stayPageHero = pgTable("stay_page_hero", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  backgroundImage: text("background_image").notNull(),
  primaryButtonText: text("primary_button_text"),
  primaryButtonLink: text("primary_button_link"),
  secondaryButtonText: text("secondary_button_text"),
  secondaryButtonLink: text("secondary_button_link"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stayAccommodationTypes = pgTable("stay_accommodation_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  icon: text("icon").notNull(), // star, waves, sparkles, shield
  title: text("title").notNull(),
  description: text("description").notNull(),
  count: text("count").notNull(), // e.g., "15+ Partners"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stayLuxuryFeatures = pgTable("stay_luxury_features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  icon: text("icon").notNull(), // utensils, sparkles, car, shield, wifi, star
  title: text("title").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stayNileSection = pgTable("stay_nile_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  paragraphs: text("paragraphs").array().notNull().default([]),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  images: text("images").array().notNull().default([]), // 4 images
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stayCta = pgTable("stay_cta", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  primaryButtonText: text("primary_button_text"),
  primaryButtonLink: text("primary_button_link"),
  secondaryButtonText: text("secondary_button_text"),
  secondaryButtonLink: text("secondary_button_link"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tour Bookings/Submissions
export const tourBookings = pgTable("tour_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Tour Information
  tourId: varchar("tour_id").references(() => tours.id),
  tourTitle: text("tour_title").notNull(),
  tourSlug: text("tour_slug"),
  tourPrice: integer("tour_price"),
  tourDuration: text("tour_duration"),
  // Customer Information
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredDates: text("preferred_dates"),
  numberOfGuests: integer("number_of_guests"),
  specialRequests: text("special_requests"),
  // Status
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  notes: text("notes"), // Admin notes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Brochure Downloads - Email capture for brochure downloads
export const brochureDownloads = pgTable("brochure_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  tourId: varchar("tour_id").references(() => tours.id),
  tourTitle: text("tour_title"),
  tourSlug: text("tour_slug"),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
}).extend({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  destination: z.string().optional(),
  preferredDates: z.string().optional(),
  specialRequests: z.string().optional(),
});

// CMS Schemas
export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

// Room schema for hotels
export const roomSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Room name is required"),
  description: z.string().min(1, "Room description is required"),
  size: z.string().min(1, "Room size is required"),
  occupancy: z.number().min(1, "Occupancy is required"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});

export const attractionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Attraction name is required"),
  description: z.string().min(1, "Attraction description is required"),
  image: z.string().min(1, "Attraction image is required"),
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Hotel name is required"),
  location: z.string().min(1, "Location is required"),
  region: z.string().min(1, "Region is required"),
  type: z.string().min(1, "Hotel type is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  priceTier: z.string().min(1, "Price tier is required"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  image: z.string().min(1, "Hero image is required"),
  description: z.string().min(1, "Description is required"),
  fullDescription: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  rooms: z.array(roomSchema).default([]),
  featured: z.boolean().default(false),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Destination name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  heroImage: z.string().min(1, "Hero image is required"),
  region: z.string().min(1, "Region is required"),
  gallery: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  attractions: z.array(attractionSchema).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  heroImage: z.string().url("Please provide a valid hero image URL"),
  duration: z.string().min(1, "Duration is required"),
  groupSize: z.string().optional(),
  difficulty: z.string().optional().default("Easy"),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().default("USD"),
  category: z.string().min(1, "Category is required"),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  destinations: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  itinerary: z.any(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Package name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  heroImage: z.string().url("Please provide a valid hero image URL"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().default("USD"),
  category: z.string().min(1, "Category is required"),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  tours: z.array(z.string()).default([]),
  hotels: z.array(z.string()).default([]),
  destinations: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Please provide a valid image URL"),
  sortOrder: z.number().default(0),
  featured: z.boolean().default(false),
  categoryType: z.enum(["packages", "day-tours", "nile-cruise"]).default("packages"),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertAboutPageContentSchema = createInsertSchema(aboutPageContent).omit({
  id: true,
  updatedAt: true,
});

export const insertNavItemSchema = createInsertSchema(navItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({
  id: true,
  updatedAt: true,
}).extend({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(["text", "image", "json"]).default("text"),
});

export const insertFooterLinkSchema = createInsertSchema(footerLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  section: z.string().min(1, "Section is required"),
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Valid URL is required"),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  isActive: z.boolean().default(true),
});

export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sortOrder: z.number().default(0),
  mediaType: z.enum(["video", "image"]).default("video"),
  mediaUrl: z.string().min(1, "Media URL is required"),
  posterUrl: z.string().optional(),
  subtitle: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  ctaText: z.string().max(150, "CTA text must be 150 characters or less").optional(),
  ctaLink: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertSiwaSectionSchema = createInsertSchema(siwaSection).omit({
  id: true,
  updatedAt: true,
}).extend({
  mediaType: z.enum(["video", "image"]).default("video"),
  mediaUrl: z.string().min(1, "Media URL is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  ctaText: z.string().max(150, "CTA text must be 150 characters or less").optional(),
  ctaLink: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertGuestExperienceSectionSchema = createInsertSchema(guestExperienceSection).omit({
  id: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tagline: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertWhyChooseSectionSchema = createInsertSchema(whyChooseSection).omit({
  id: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertWhyChooseCardSchema = createInsertSchema(whyChooseCards).omit({
  id: true,
  updatedAt: true,
}).extend({
  sortOrder: z.number().default(0),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  isActive: z.boolean().default(true),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sortOrder: z.number().default(0),
  quote: z.string().min(1, "Quote is required"),
  author: z.string().min(1, "Author is required"),
  location: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
});

export const insertContactCtaSectionSchema = createInsertSchema(contactCtaSection).omit({
  id: true,
  updatedAt: true,
}).extend({
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email required"),
});

export const insertTourBookingSchema = createInsertSchema(tourBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  tourId: z.string().optional(),
  tourTitle: z.string().min(1, "Tour title is required"),
  tourSlug: z.string().optional(),
  tourPrice: z.number().optional(),
  tourDuration: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  preferredDates: z.string().optional(),
  numberOfGuests: z.number().optional(),
  specialRequests: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending"),
  notes: z.string().optional(),
});

// Stay Page Schemas
export const insertStayPageHeroSchema = createInsertSchema(stayPageHero).omit({
  id: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  backgroundImage: z.string().min(1, "Background image is required"),
  primaryButtonText: z.string().optional(),
  primaryButtonLink: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
});

export const insertStayAccommodationTypeSchema = createInsertSchema(stayAccommodationTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sortOrder: z.number().default(0),
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  count: z.string().min(1, "Count is required"),
  isActive: z.boolean().default(true),
});

export const insertStayLuxuryFeatureSchema = createInsertSchema(stayLuxuryFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sortOrder: z.number().default(0),
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
});

export const insertStayNileSectionSchema = createInsertSchema(stayNileSection).omit({
  id: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  paragraphs: z.array(z.string()).default([]),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  images: z.array(z.string()).default([]),
});

export const insertStayCtaSchema = createInsertSchema(stayCta).omit({
  id: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  primaryButtonText: z.string().optional(),
  primaryButtonLink: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
});

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Settings Schemas
export const changeUsernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters"),
  currentPassword: z.string().min(1, "Current password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const siteInfoSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(1, "Phone number is required"),
  contactAddress: z.string().min(1, "Address is required"),
});

export const emailSettingsSchema = z.object({
  inquiryNotificationEmail: z.string().email("Valid email required"),
});

// Type Exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotels.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof tours.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertAboutPageContent = z.infer<typeof insertAboutPageContentSchema>;
export type AboutPageContent = typeof aboutPageContent.$inferSelect;
export type InsertNavItem = z.infer<typeof insertNavItemSchema>;
export type NavItem = typeof navItems.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertFooterLink = z.infer<typeof insertFooterLinkSchema>;
export type FooterLink = typeof footerLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertTourBooking = z.infer<typeof insertTourBookingSchema>;
export type TourBooking = typeof tourBookings.$inferSelect;
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertSiwaSection = z.infer<typeof insertSiwaSectionSchema>;
export type SiwaSection = typeof siwaSection.$inferSelect;
export type InsertGuestExperienceSection = z.infer<typeof insertGuestExperienceSectionSchema>;
export type GuestExperienceSection = typeof guestExperienceSection.$inferSelect;
export type InsertWhyChooseSection = z.infer<typeof insertWhyChooseSectionSchema>;
export type WhyChooseSection = typeof whyChooseSection.$inferSelect;
export type InsertWhyChooseCard = z.infer<typeof insertWhyChooseCardSchema>;
export type WhyChooseCard = typeof whyChooseCards.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertContactCtaSection = z.infer<typeof insertContactCtaSectionSchema>;
export type ContactCtaSection = typeof contactCtaSection.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type ChangeUsernameRequest = z.infer<typeof changeUsernameSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
export type SiteInfoRequest = z.infer<typeof siteInfoSchema>;
export type EmailSettingsRequest = z.infer<typeof emailSettingsSchema>;
export type Room = z.infer<typeof roomSchema>;
export type Attraction = z.infer<typeof attractionSchema>;
export type InsertStayPageHero = z.infer<typeof insertStayPageHeroSchema>;
export type StayPageHero = typeof stayPageHero.$inferSelect;
export type InsertStayAccommodationType = z.infer<typeof insertStayAccommodationTypeSchema>;
export type StayAccommodationType = typeof stayAccommodationTypes.$inferSelect;
export type InsertStayLuxuryFeature = z.infer<typeof insertStayLuxuryFeatureSchema>;
export type StayLuxuryFeature = typeof stayLuxuryFeatures.$inferSelect;
export type InsertStayNileSection = z.infer<typeof insertStayNileSectionSchema>;
export type StayNileSection = typeof stayNileSection.$inferSelect;
export type InsertStayCta = z.infer<typeof insertStayCtaSchema>;
export type StayCta = typeof stayCta.$inferSelect;
