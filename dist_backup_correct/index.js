var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express3 from "express";

// server/routes.ts
import { createServer } from "http";
import express from "express";
import path from "path";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  aboutPageContent: () => aboutPageContent,
  attractionSchema: () => attractionSchema,
  brochureDownloads: () => brochureDownloads,
  categories: () => categories,
  changePasswordSchema: () => changePasswordSchema,
  changeUsernameSchema: () => changeUsernameSchema,
  contactCtaSection: () => contactCtaSection,
  destinations: () => destinations,
  emailSettingsSchema: () => emailSettingsSchema,
  faqs: () => faqs,
  footerLinks: () => footerLinks,
  guestExperienceSection: () => guestExperienceSection,
  heroSlides: () => heroSlides,
  hotels: () => hotels,
  inquiries: () => inquiries,
  insertAboutPageContentSchema: () => insertAboutPageContentSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertContactCtaSectionSchema: () => insertContactCtaSectionSchema,
  insertDestinationSchema: () => insertDestinationSchema,
  insertFaqSchema: () => insertFaqSchema,
  insertFooterLinkSchema: () => insertFooterLinkSchema,
  insertGuestExperienceSectionSchema: () => insertGuestExperienceSectionSchema,
  insertHeroSlideSchema: () => insertHeroSlideSchema,
  insertHotelSchema: () => insertHotelSchema,
  insertInquirySchema: () => insertInquirySchema,
  insertMediaSchema: () => insertMediaSchema,
  insertNavItemSchema: () => insertNavItemSchema,
  insertNewsletterSubscriberSchema: () => insertNewsletterSubscriberSchema,
  insertPackageSchema: () => insertPackageSchema,
  insertPageSchema: () => insertPageSchema,
  insertPostSchema: () => insertPostSchema,
  insertSectionSchema: () => insertSectionSchema,
  insertSettingSchema: () => insertSettingSchema,
  insertSiteConfigSchema: () => insertSiteConfigSchema,
  insertSiwaSectionSchema: () => insertSiwaSectionSchema,
  insertSocialLinkSchema: () => insertSocialLinkSchema,
  insertStayAccommodationTypeSchema: () => insertStayAccommodationTypeSchema,
  insertStayCtaSchema: () => insertStayCtaSchema,
  insertStayLuxuryFeatureSchema: () => insertStayLuxuryFeatureSchema,
  insertStayNileSectionSchema: () => insertStayNileSectionSchema,
  insertStayPageHeroSchema: () => insertStayPageHeroSchema,
  insertTestimonialSchema: () => insertTestimonialSchema,
  insertTourBookingSchema: () => insertTourBookingSchema,
  insertTourSchema: () => insertTourSchema,
  insertUserSchema: () => insertUserSchema,
  insertWhyChooseCardSchema: () => insertWhyChooseCardSchema,
  insertWhyChooseSectionSchema: () => insertWhyChooseSectionSchema,
  loginSchema: () => loginSchema,
  media: () => media,
  navItems: () => navItems,
  newsletterSubscribers: () => newsletterSubscribers,
  packages: () => packages,
  pages: () => pages,
  posts: () => posts,
  roomSchema: () => roomSchema,
  sections: () => sections,
  settings: () => settings,
  siteConfig: () => siteConfig,
  siteInfoSchema: () => siteInfoSchema,
  siwaSection: () => siwaSection,
  socialLinks: () => socialLinks,
  stayAccommodationTypes: () => stayAccommodationTypes,
  stayCta: () => stayCta,
  stayLuxuryFeatures: () => stayLuxuryFeatures,
  stayNileSection: () => stayNileSection,
  stayPageHero: () => stayPageHero,
  testimonials: () => testimonials,
  tourBookings: () => tourBookings,
  tours: () => tours,
  users: () => users,
  whyChooseCards: () => whyChooseCards,
  whyChooseSection: () => whyChooseSection
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("editor"),
  // admin, editor, translator, viewer
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  destination: text("destination"),
  preferredDates: text("preferred_dates"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleEs: text("title_es"),
  titleFr: text("title_fr"),
  titleJp: text("title_jp"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"),
  // draft, published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id)
});
var sections = pgTable("sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").references(() => pages.id).notNull(),
  type: text("type").notNull(),
  // hero, text, gallery, carousel, pricing, etc
  orderIndex: integer("order_index").notNull().default(0),
  contentJson: jsonb("content_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var posts = pgTable("posts", {
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
  createdBy: varchar("created_by").references(() => users.id)
});
var media = pgTable("media", {
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
  uploadedBy: varchar("uploaded_by").references(() => users.id)
});
var hotels = pgTable("hotels", {
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
  fullDescription: text("full_description"),
  // Extended description for about section
  highlights: text("highlights").array().notNull().default([]),
  // Hotel highlights
  gallery: text("gallery").array().notNull().default([]),
  // Gallery images
  rooms: jsonb("rooms").notNull().default([]),
  // Array of room objects
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id)
});
var destinations = pgTable("destinations", {
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
  createdBy: varchar("created_by").references(() => users.id)
});
var tours = pgTable("tours", {
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
  createdBy: varchar("created_by").references(() => users.id)
});
var packages = pgTable("packages", {
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
  tours: text("tours").array().notNull().default([]),
  // Array of tour IDs
  hotels: text("hotels").array().notNull().default([]),
  // Array of hotel IDs
  destinations: text("destinations").array().notNull().default([]),
  // Array of destination IDs
  category: text("category").notNull(),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id)
});
var categories = pgTable("categories", {
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
  createdBy: varchar("created_by").references(() => users.id)
});
var settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by").references(() => users.id)
});
var navItems = pgTable("nav_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  href: text("href").notNull(),
  parentId: varchar("parent_id"),
  // For dropdown items, references parent nav item
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var siteConfig = pgTable("site_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  // e.g., 'header_logo', 'footer_logo', 'footer_description', etc.
  value: text("value").notNull(),
  type: text("type").notNull().default("text"),
  // text, image, json
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by").references(() => users.id)
});
var footerLinks = pgTable("footer_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull(),
  // e.g., 'quick_links', 'experiences', 'support'
  label: text("label").notNull(),
  href: text("href").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var socialLinks = pgTable("social_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  // facebook, instagram, twitter, etc.
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var aboutPageContent = pgTable("about_page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  // who-we-are, iluxury-difference, your-experience, trusted-worldwide
  heroImage: text("hero_image"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroDescription: text("hero_description"),
  sectionImages: jsonb("section_images").notNull().default({}),
  // Object with section image URLs
  sections: jsonb("sections").notNull().default([]),
  // Array of section content
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by").references(() => users.id)
});
var faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  // Optional category for grouping FAQs
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id)
});
var newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var heroSlides = pgTable("hero_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  mediaType: text("media_type").notNull().default("video"),
  // "video" or "image"
  mediaUrl: text("media_url").notNull(),
  posterUrl: text("poster_url"),
  // poster image for videos
  subtitle: text("subtitle"),
  title: text("title").notNull(),
  description: text("description"),
  ctaText: varchar("cta_text", { length: 150 }),
  ctaLink: text("cta_link"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var siwaSection = pgTable("siwa_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediaType: text("media_type").notNull().default("video"),
  // "video" or "image"
  mediaUrl: text("media_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  ctaText: varchar("cta_text", { length: 150 }),
  ctaLink: text("cta_link"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var guestExperienceSection = pgTable("guest_experience_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  tagline: text("tagline"),
  // "Your journey, our promise."
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var whyChooseSection = pgTable("why_choose_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var whyChooseCards = pgTable("why_choose_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  location: text("location"),
  rating: integer("rating").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var contactCtaSection = pgTable("contact_cta_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var stayPageHero = pgTable("stay_page_hero", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  backgroundImage: text("background_image").notNull(),
  primaryButtonText: text("primary_button_text"),
  primaryButtonLink: text("primary_button_link"),
  secondaryButtonText: text("secondary_button_text"),
  secondaryButtonLink: text("secondary_button_link"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var stayAccommodationTypes = pgTable("stay_accommodation_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  icon: text("icon").notNull(),
  // star, waves, sparkles, shield
  title: text("title").notNull(),
  description: text("description").notNull(),
  count: text("count").notNull(),
  // e.g., "15+ Partners"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var stayLuxuryFeatures = pgTable("stay_luxury_features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sortOrder: integer("sort_order").notNull().default(0),
  icon: text("icon").notNull(),
  // utensils, sparkles, car, shield, wifi, star
  title: text("title").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var stayNileSection = pgTable("stay_nile_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  paragraphs: text("paragraphs").array().notNull().default([]),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  images: text("images").array().notNull().default([]),
  // 4 images
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var stayCta = pgTable("stay_cta", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  primaryButtonText: text("primary_button_text"),
  primaryButtonLink: text("primary_button_link"),
  secondaryButtonText: text("secondary_button_text"),
  secondaryButtonLink: text("secondary_button_link"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var tourBookings = pgTable("tour_bookings", {
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
  status: text("status").notNull().default("pending"),
  // pending, confirmed, cancelled, completed
  notes: text("notes"),
  // Admin notes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var brochureDownloads = pgTable("brochure_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  tourId: varchar("tour_id").references(() => tours.id),
  tourTitle: text("tour_title"),
  tourSlug: text("tour_slug"),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true
});
var insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true
}).extend({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  destination: z.string().optional(),
  preferredDates: z.string().optional(),
  specialRequests: z.string().optional()
});
var insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
  createdAt: true
});
var insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true
});
var roomSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Room name is required"),
  description: z.string().min(1, "Room description is required"),
  size: z.string().min(1, "Room size is required"),
  occupancy: z.number().min(1, "Occupancy is required"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([])
});
var attractionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Attraction name is required"),
  description: z.string().min(1, "Attraction description is required"),
  image: z.string().min(1, "Attraction image is required")
});
var insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
  createdAt: true,
  updatedAt: true
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
  featured: z.boolean().default(false)
});
var insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
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
  published: z.boolean().default(true)
});
var insertTourSchema = createInsertSchema(tours).omit({
  id: true,
  createdAt: true,
  updatedAt: true
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
  published: z.boolean().default(true)
});
var insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
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
  published: z.boolean().default(true)
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Please provide a valid image URL"),
  sortOrder: z.number().default(0),
  featured: z.boolean().default(false),
  categoryType: z.enum(["packages", "day-tours", "nile-cruise"]).default("packages")
});
var insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true
});
var insertAboutPageContentSchema = createInsertSchema(aboutPageContent).omit({
  id: true,
  updatedAt: true
});
var insertNavItemSchema = createInsertSchema(navItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false)
});
var insertSiteConfigSchema = createInsertSchema(siteConfig).omit({
  id: true,
  updatedAt: true
}).extend({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(["text", "image", "json"]).default("text")
});
var insertFooterLinkSchema = createInsertSchema(footerLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  section: z.string().min(1, "Section is required"),
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false)
});
var insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Valid URL is required"),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true)
});
var insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true)
});
var insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  email: z.string().email("Please enter a valid email address"),
  isActive: z.boolean().default(true)
});
var insertHeroSlideSchema = createInsertSchema(heroSlides).omit({
  id: true,
  createdAt: true,
  updatedAt: true
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
  isActive: z.boolean().default(true)
});
var insertSiwaSectionSchema = createInsertSchema(siwaSection).omit({
  id: true,
  updatedAt: true
}).extend({
  mediaType: z.enum(["video", "image"]).default("video"),
  mediaUrl: z.string().min(1, "Media URL is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  ctaText: z.string().max(150, "CTA text must be 150 characters or less").optional(),
  ctaLink: z.string().optional(),
  isActive: z.boolean().default(true)
});
var insertGuestExperienceSectionSchema = createInsertSchema(guestExperienceSection).omit({
  id: true,
  updatedAt: true
}).extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tagline: z.string().optional(),
  isActive: z.boolean().default(true)
});
var insertWhyChooseSectionSchema = createInsertSchema(whyChooseSection).omit({
  id: true,
  updatedAt: true
}).extend({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  isActive: z.boolean().default(true)
});
var insertWhyChooseCardSchema = createInsertSchema(whyChooseCards).omit({
  id: true,
  updatedAt: true
}).extend({
  sortOrder: z.number().default(0),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  isActive: z.boolean().default(true)
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  sortOrder: z.number().default(0),
  quote: z.string().min(1, "Quote is required"),
  author: z.string().min(1, "Author is required"),
  location: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  isActive: z.boolean().default(true)
});
var insertContactCtaSectionSchema = createInsertSchema(contactCtaSection).omit({
  id: true,
  updatedAt: true
}).extend({
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email required")
});
var insertTourBookingSchema = createInsertSchema(tourBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
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
  notes: z.string().optional()
});
var insertStayPageHeroSchema = createInsertSchema(stayPageHero).omit({
  id: true,
  updatedAt: true
}).extend({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  backgroundImage: z.string().min(1, "Background image is required"),
  primaryButtonText: z.string().optional(),
  primaryButtonLink: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional()
});
var insertStayAccommodationTypeSchema = createInsertSchema(stayAccommodationTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  sortOrder: z.number().default(0),
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  count: z.string().min(1, "Count is required"),
  isActive: z.boolean().default(true)
});
var insertStayLuxuryFeatureSchema = createInsertSchema(stayLuxuryFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  sortOrder: z.number().default(0),
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true)
});
var insertStayNileSectionSchema = createInsertSchema(stayNileSection).omit({
  id: true,
  updatedAt: true
}).extend({
  title: z.string().min(1, "Title is required"),
  paragraphs: z.array(z.string()).default([]),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  images: z.array(z.string()).default([])
});
var insertStayCtaSchema = createInsertSchema(stayCta).omit({
  id: true,
  updatedAt: true
}).extend({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  primaryButtonText: z.string().optional(),
  primaryButtonLink: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional()
});
var loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});
var changeUsernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters"),
  currentPassword: z.string().min(1, "Current password is required")
});
var changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var siteInfoSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(1, "Phone number is required"),
  contactAddress: z.string().min(1, "Address is required")
});
var emailSettingsSchema = z.object({
  inquiryNotificationEmail: z.string().email("Valid email required")
});

// server/storage.ts
import { eq, desc } from "drizzle-orm";

// server/db.ts
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import ws from "ws";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var isNeon = process.env.DATABASE_URL.includes("neon.tech");
var pool;
var db;
if (isNeon) {
  neonConfig.webSocketConstructor = ws;
  if (process.env.NODE_ENV === "development") {
    neonConfig.fetchConnectionCache = true;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema: schema_exports });
} else {
  pool = new PgPool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg({ client: pool, schema: schema_exports });
}

// server/storage.ts
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async updateUser(id, data) {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  // Inquiry methods
  async createInquiry(insertInquiry) {
    const result = await db.insert(inquiries).values(insertInquiry).returning();
    return result[0];
  }
  async getInquiries() {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }
  async getInquiry(id) {
    const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
    return result[0] || void 0;
  }
  // Page methods
  async createPage(page) {
    const result = await db.insert(pages).values(page).returning();
    return result[0];
  }
  async getPages() {
    return await db.select().from(pages).orderBy(desc(pages.createdAt));
  }
  async getPage(id) {
    const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    return result[0] || void 0;
  }
  async getPageBySlug(slug) {
    const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    return result[0] || void 0;
  }
  async updatePage(id, page) {
    const result = await db.update(pages).set({ ...page, updatedAt: /* @__PURE__ */ new Date() }).where(eq(pages.id, id)).returning();
    return result[0] || void 0;
  }
  async deletePage(id) {
    const result = await db.delete(pages).where(eq(pages.id, id)).returning();
    return result.length > 0;
  }
  // Section methods
  async createSection(section) {
    const result = await db.insert(sections).values(section).returning();
    return result[0];
  }
  async getSectionsByPageId(pageId) {
    return await db.select().from(sections).where(eq(sections.pageId, pageId)).orderBy(sections.orderIndex);
  }
  async updateSection(id, section) {
    const result = await db.update(sections).set(section).where(eq(sections.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteSection(id) {
    const result = await db.delete(sections).where(eq(sections.id, id)).returning();
    return result.length > 0;
  }
  // Post methods
  async createPost(post) {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }
  async getPosts() {
    const result = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return result || [];
  }
  async getPost(id) {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0] || void 0;
  }
  async getPostBySlug(slug) {
    const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    return result[0] || void 0;
  }
  async updatePost(id, post) {
    const result = await db.update(posts).set({ ...post, updatedAt: /* @__PURE__ */ new Date() }).where(eq(posts.id, id)).returning();
    return result[0] || void 0;
  }
  async deletePost(id) {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning();
    return result.length > 0;
  }
  // Media methods
  async createMedia(mediaData) {
    const result = await db.insert(media).values(mediaData).returning();
    return result[0];
  }
  async getMedia() {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  }
  async getMediaById(id) {
    const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
    return result[0] || void 0;
  }
  async deleteMedia(id) {
    const result = await db.delete(media).where(eq(media.id, id)).returning();
    return result.length > 0;
  }
  // Delete inquiry
  async deleteInquiry(id) {
    try {
      const result = await db.delete(inquiries).where(eq(inquiries.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      return false;
    }
  }
  // Hotel methods
  async getHotels() {
    try {
      const hotelsList = await db.select().from(hotels).orderBy(hotels.createdAt);
      return hotelsList;
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return [];
    }
  }
  async getHotel(id) {
    try {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
      return hotel || void 0;
    } catch (error) {
      console.error("Error fetching hotel:", error);
      return void 0;
    }
  }
  async getHotelBySlug(slug) {
    try {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.slug, slug));
      return hotel || void 0;
    } catch (error) {
      console.error("Error fetching hotel by slug:", error);
      return void 0;
    }
  }
  async createHotel(data) {
    try {
      const [hotel] = await db.insert(hotels).values(data).returning();
      return hotel;
    } catch (error) {
      console.error("Error creating hotel:", error);
      throw error;
    }
  }
  async updateHotel(id, data) {
    try {
      const [hotel] = await db.update(hotels).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(hotels.id, id)).returning();
      return hotel || void 0;
    } catch (error) {
      console.error("Error updating hotel:", error);
      throw error;
    }
  }
  async deleteHotel(id) {
    try {
      const result = await db.delete(hotels).where(eq(hotels.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting hotel:", error);
      return false;
    }
  }
  // Destination methods
  async createDestination(data) {
    try {
      const [destination] = await db.insert(destinations).values(data).returning();
      return destination;
    } catch (error) {
      console.error("Error creating destination:", error);
      throw error;
    }
  }
  async getDestinations() {
    try {
      return await db.select().from(destinations).orderBy(desc(destinations.createdAt));
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  }
  async getDestination(id) {
    try {
      const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
      return destination || void 0;
    } catch (error) {
      console.error("Error fetching destination:", error);
      return void 0;
    }
  }
  async getDestinationBySlug(slug) {
    try {
      const [destination] = await db.select().from(destinations).where(eq(destinations.slug, slug));
      return destination || void 0;
    } catch (error) {
      console.error("Error fetching destination by slug:", error);
      return void 0;
    }
  }
  async updateDestination(id, data) {
    try {
      const [destination] = await db.update(destinations).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(destinations.id, id)).returning();
      return destination || void 0;
    } catch (error) {
      console.error("Error updating destination:", error);
      throw error;
    }
  }
  async deleteDestination(id) {
    try {
      const result = await db.delete(destinations).where(eq(destinations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting destination:", error);
      return false;
    }
  }
  // Tour methods
  async createTour(data) {
    try {
      const [tour] = await db.insert(tours).values(data).returning();
      return tour;
    } catch (error) {
      console.error("Error creating tour:", error);
      throw error;
    }
  }
  async getTours() {
    try {
      return await db.select().from(tours).orderBy(desc(tours.createdAt));
    } catch (error) {
      console.error("Error fetching tours:", error);
      return [];
    }
  }
  async getTour(id) {
    try {
      const [tour] = await db.select().from(tours).where(eq(tours.id, id));
      return tour || void 0;
    } catch (error) {
      console.error("Error fetching tour:", error);
      return void 0;
    }
  }
  async getTourBySlug(slug) {
    try {
      const [tour] = await db.select().from(tours).where(eq(tours.slug, slug));
      return tour || void 0;
    } catch (error) {
      console.error("Error fetching tour by slug:", error);
      return void 0;
    }
  }
  async updateTour(id, data) {
    try {
      const [tour] = await db.update(tours).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tours.id, id)).returning();
      return tour || void 0;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    }
  }
  async deleteTour(id) {
    try {
      const result = await db.delete(tours).where(eq(tours.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting tour:", error);
      return false;
    }
  }
  // Package methods
  async createPackage(data) {
    try {
      const [pkg] = await db.insert(packages).values(data).returning();
      return pkg;
    } catch (error) {
      console.error("Error creating package:", error);
      throw error;
    }
  }
  async getPackages() {
    try {
      return await db.select().from(packages).orderBy(desc(packages.createdAt));
    } catch (error) {
      console.error("Error fetching packages:", error);
      return [];
    }
  }
  async getPackage(id) {
    try {
      const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
      return pkg || void 0;
    } catch (error) {
      console.error("Error fetching package:", error);
      return void 0;
    }
  }
  async getPackageBySlug(slug) {
    try {
      const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));
      return pkg || void 0;
    } catch (error) {
      console.error("Error fetching package by slug:", error);
      return void 0;
    }
  }
  async updatePackage(id, data) {
    try {
      const [pkg] = await db.update(packages).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(packages.id, id)).returning();
      return pkg || void 0;
    } catch (error) {
      console.error("Error updating package:", error);
      throw error;
    }
  }
  async deletePackage(id) {
    try {
      const result = await db.delete(packages).where(eq(packages.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting package:", error);
      return false;
    }
  }
  // Category methods
  async createCategory(data) {
    try {
      const [category] = await db.insert(categories).values(data).returning();
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }
  async getCategories() {
    try {
      return await db.select().from(categories).orderBy(categories.sortOrder, desc(categories.createdAt));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
  async getCategory(id) {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.id, id));
      return category || void 0;
    } catch (error) {
      console.error("Error fetching category:", error);
      return void 0;
    }
  }
  async getCategoryBySlug(slug) {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
      return category || void 0;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      return void 0;
    }
  }
  async updateCategory(id, data) {
    try {
      const [category] = await db.update(categories).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(categories.id, id)).returning();
      return category || void 0;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }
  async deleteCategory(id) {
    try {
      const result = await db.delete(categories).where(eq(categories.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }
  // Settings
  async getSetting(key) {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }
  async getAllSettings() {
    return await db.select().from(settings);
  }
  async upsertSetting(key, value, updatedBy) {
    const existing = await this.getSetting(key);
    if (existing) {
      const [updated] = await db.update(settings).set({ value, updatedBy, updatedAt: /* @__PURE__ */ new Date() }).where(eq(settings.key, key)).returning();
      return updated;
    } else {
      const [created] = await db.insert(settings).values({ key, value, updatedBy }).returning();
      return created;
    }
  }
  // Navigation Items methods
  async getNavItems() {
    return await db.select().from(navItems).orderBy(navItems.sortOrder);
  }
  async getNavItem(id) {
    const [item] = await db.select().from(navItems).where(eq(navItems.id, id));
    return item;
  }
  async createNavItem(data) {
    const [item] = await db.insert(navItems).values(data).returning();
    return item;
  }
  async updateNavItem(id, data) {
    const [item] = await db.update(navItems).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(navItems.id, id)).returning();
    return item;
  }
  async deleteNavItem(id) {
    const result = await db.delete(navItems).where(eq(navItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Site Config methods
  async getSiteConfig(key) {
    const [config] = await db.select().from(siteConfig).where(eq(siteConfig.key, key));
    return config;
  }
  async getAllSiteConfig() {
    return await db.select().from(siteConfig);
  }
  async upsertSiteConfig(key, value, type = "text", updatedBy) {
    const existing = await this.getSiteConfig(key);
    if (existing) {
      const [updated] = await db.update(siteConfig).set({ value, type, updatedBy, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteConfig.key, key)).returning();
      return updated;
    } else {
      const [created] = await db.insert(siteConfig).values({ key, value, type, updatedBy }).returning();
      return created;
    }
  }
  // Footer Links methods
  async getFooterLinks() {
    return await db.select().from(footerLinks).orderBy(footerLinks.section, footerLinks.sortOrder);
  }
  async getFooterLink(id) {
    const [link] = await db.select().from(footerLinks).where(eq(footerLinks.id, id));
    return link;
  }
  async createFooterLink(data) {
    const [link] = await db.insert(footerLinks).values(data).returning();
    return link;
  }
  async updateFooterLink(id, data) {
    const [link] = await db.update(footerLinks).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(footerLinks.id, id)).returning();
    return link;
  }
  async deleteFooterLink(id) {
    const result = await db.delete(footerLinks).where(eq(footerLinks.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Social Links methods
  async getSocialLinks() {
    return await db.select().from(socialLinks).orderBy(socialLinks.sortOrder);
  }
  async getSocialLink(id) {
    const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return link;
  }
  async createSocialLink(data) {
    const [link] = await db.insert(socialLinks).values(data).returning();
    return link;
  }
  async updateSocialLink(id, data) {
    const [link] = await db.update(socialLinks).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(socialLinks.id, id)).returning();
    return link;
  }
  async deleteSocialLink(id) {
    const result = await db.delete(socialLinks).where(eq(socialLinks.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // FAQ methods
  async getFaqs() {
    return await db.select().from(faqs).orderBy(faqs.sortOrder);
  }
  async getVisibleFaqs() {
    return await db.select().from(faqs).where(eq(faqs.isVisible, true)).orderBy(faqs.sortOrder);
  }
  async getFaq(id) {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq;
  }
  async createFaq(data) {
    const [faq] = await db.insert(faqs).values(data).returning();
    return faq;
  }
  async updateFaq(id, data) {
    const [faq] = await db.update(faqs).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(faqs.id, id)).returning();
    return faq;
  }
  async deleteFaq(id) {
    const result = await db.delete(faqs).where(eq(faqs.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Newsletter Subscriber methods
  async getNewsletterSubscribers() {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  }
  async getNewsletterSubscriber(id) {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return subscriber;
  }
  async getNewsletterSubscriberByEmail(email) {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return subscriber;
  }
  async createNewsletterSubscriber(data) {
    const [subscriber] = await db.insert(newsletterSubscribers).values(data).returning();
    return subscriber;
  }
  async updateNewsletterSubscriber(id, data) {
    const [subscriber] = await db.update(newsletterSubscribers).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(newsletterSubscribers.id, id)).returning();
    return subscriber;
  }
  async deleteNewsletterSubscriber(id) {
    const result = await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Tour Booking methods
  async getTourBookings() {
    return await db.select().from(tourBookings).orderBy(desc(tourBookings.createdAt));
  }
  async getTourBooking(id) {
    const [booking] = await db.select().from(tourBookings).where(eq(tourBookings.id, id));
    return booking;
  }
  async createTourBooking(data) {
    const [booking] = await db.insert(tourBookings).values(data).returning();
    return booking;
  }
  async updateTourBooking(id, data) {
    const [booking] = await db.update(tourBookings).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tourBookings.id, id)).returning();
    return booking;
  }
  async deleteTourBooking(id) {
    const result = await db.delete(tourBookings).where(eq(tourBookings.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Brochure Download methods
  async getBrochureDownloads() {
    return await db.select().from(brochureDownloads).orderBy(desc(brochureDownloads.downloadedAt));
  }
  async createBrochureDownload(data) {
    const [download] = await db.insert(brochureDownloads).values(data).returning();
    return download;
  }
  async deleteBrochureDownload(id) {
    const result = await db.delete(brochureDownloads).where(eq(brochureDownloads.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Hero Slides methods
  async getHeroSlides() {
    return await db.select().from(heroSlides).orderBy(heroSlides.sortOrder);
  }
  async getActiveHeroSlides() {
    return await db.select().from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(heroSlides.sortOrder);
  }
  async getHeroSlide(id) {
    const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
    return slide;
  }
  async createHeroSlide(data) {
    const [slide] = await db.insert(heroSlides).values(data).returning();
    return slide;
  }
  async updateHeroSlide(id, data) {
    const [slide] = await db.update(heroSlides).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(heroSlides.id, id)).returning();
    return slide;
  }
  async deleteHeroSlide(id) {
    const result = await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Siwa Section methods
  async getSiwaSection() {
    const [section] = await db.select().from(siwaSection).limit(1);
    return section;
  }
  async upsertSiwaSection(data) {
    const existing = await this.getSiwaSection();
    if (existing) {
      const [updated] = await db.update(siwaSection).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siwaSection.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(siwaSection).values(data).returning();
      return created;
    }
  }
  // Guest Experience Section methods
  async getGuestExperienceSection() {
    const [section] = await db.select().from(guestExperienceSection).limit(1);
    return section;
  }
  async upsertGuestExperienceSection(data) {
    const existing = await this.getGuestExperienceSection();
    if (existing) {
      const [updated] = await db.update(guestExperienceSection).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(guestExperienceSection.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(guestExperienceSection).values(data).returning();
      return created;
    }
  }
  // Why Choose Section methods
  async getWhyChooseSection() {
    const [section] = await db.select().from(whyChooseSection).limit(1);
    return section;
  }
  async upsertWhyChooseSection(data) {
    const existing = await this.getWhyChooseSection();
    if (existing) {
      const [updated] = await db.update(whyChooseSection).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(whyChooseSection.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(whyChooseSection).values(data).returning();
      return created;
    }
  }
  // Why Choose Cards methods
  async getWhyChooseCards() {
    return await db.select().from(whyChooseCards).orderBy(whyChooseCards.sortOrder);
  }
  async getWhyChooseCard(id) {
    const [card] = await db.select().from(whyChooseCards).where(eq(whyChooseCards.id, id));
    return card;
  }
  async createWhyChooseCard(data) {
    const [card] = await db.insert(whyChooseCards).values(data).returning();
    return card;
  }
  async updateWhyChooseCard(id, data) {
    const [card] = await db.update(whyChooseCards).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(whyChooseCards.id, id)).returning();
    return card;
  }
  async deleteWhyChooseCard(id) {
    const result = await db.delete(whyChooseCards).where(eq(whyChooseCards.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Testimonials methods
  async getTestimonials() {
    return await db.select().from(testimonials).orderBy(testimonials.sortOrder);
  }
  async getTestimonial(id) {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }
  async createTestimonial(data) {
    const [testimonial] = await db.insert(testimonials).values(data).returning();
    return testimonial;
  }
  async updateTestimonial(id, data) {
    const [testimonial] = await db.update(testimonials).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(testimonials.id, id)).returning();
    return testimonial;
  }
  async deleteTestimonial(id) {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Contact CTA Section methods
  async getContactCtaSection() {
    const [section] = await db.select().from(contactCtaSection).limit(1);
    return section;
  }
  async upsertContactCtaSection(data) {
    const existing = await this.getContactCtaSection();
    if (existing) {
      const [updated] = await db.update(contactCtaSection).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(contactCtaSection.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(contactCtaSection).values(data).returning();
      return created;
    }
  }
  // Stay Page Hero methods
  async getStayPageHero() {
    const [hero] = await db.select().from(stayPageHero).limit(1);
    return hero;
  }
  async upsertStayPageHero(data) {
    const existing = await this.getStayPageHero();
    if (existing) {
      const [updated] = await db.update(stayPageHero).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(stayPageHero.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(stayPageHero).values(data).returning();
      return created;
    }
  }
  // Stay Accommodation Types methods
  async getStayAccommodationTypes() {
    return await db.select().from(stayAccommodationTypes).orderBy(stayAccommodationTypes.sortOrder);
  }
  async getStayAccommodationType(id) {
    const [type] = await db.select().from(stayAccommodationTypes).where(eq(stayAccommodationTypes.id, id));
    return type;
  }
  async createStayAccommodationType(data) {
    const [type] = await db.insert(stayAccommodationTypes).values(data).returning();
    return type;
  }
  async updateStayAccommodationType(id, data) {
    const [type] = await db.update(stayAccommodationTypes).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(stayAccommodationTypes.id, id)).returning();
    return type;
  }
  async deleteStayAccommodationType(id) {
    const result = await db.delete(stayAccommodationTypes).where(eq(stayAccommodationTypes.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Stay Luxury Features methods
  async getStayLuxuryFeatures() {
    return await db.select().from(stayLuxuryFeatures).orderBy(stayLuxuryFeatures.sortOrder);
  }
  async getStayLuxuryFeature(id) {
    const [feature] = await db.select().from(stayLuxuryFeatures).where(eq(stayLuxuryFeatures.id, id));
    return feature;
  }
  async createStayLuxuryFeature(data) {
    const [feature] = await db.insert(stayLuxuryFeatures).values(data).returning();
    return feature;
  }
  async updateStayLuxuryFeature(id, data) {
    const [feature] = await db.update(stayLuxuryFeatures).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(stayLuxuryFeatures.id, id)).returning();
    return feature;
  }
  async deleteStayLuxuryFeature(id) {
    const result = await db.delete(stayLuxuryFeatures).where(eq(stayLuxuryFeatures.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Stay Nile Section methods
  async getStayNileSection() {
    const [section] = await db.select().from(stayNileSection).limit(1);
    return section;
  }
  async upsertStayNileSection(data) {
    const existing = await this.getStayNileSection();
    if (existing) {
      const [updated] = await db.update(stayNileSection).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(stayNileSection.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(stayNileSection).values(data).returning();
      return created;
    }
  }
  // Stay CTA methods
  async getStayCta() {
    const [cta] = await db.select().from(stayCta).limit(1);
    return cta;
  }
  async upsertStayCta(data) {
    const existing = await this.getStayCta();
    if (existing) {
      const [updated] = await db.update(stayCta).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(stayCta.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(stayCta).values(data).returning();
      return created;
    }
  }
};
var storage = new DatabaseStorage();
async function seedDatabase() {
  try {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      await storage.createUser({
        username: "admin",
        email: "admin@luxuryegypt.com",
        password: "$2b$10$jya3D5zQkarnCNp7ex9E1eQFFdHa5pQgvriM2BK5yiPM/BNO77Hf.",
        // bcrypt hash of "admin123"
        role: "admin"
      });
      console.log("\u2713 Admin user seeded");
    }
    const existingHotels = await storage.getHotels();
    if (existingHotels.length === 0) {
      const sampleHotels = [
        {
          name: "Mena House Hotel",
          location: "Giza",
          region: "Cairo & Giza",
          type: "Palace",
          rating: 5,
          priceTier: "$$$$",
          amenities: ["Pyramid Views", "Historic Heritage", "Luxury Spa", "Fine Dining"],
          image: "/api/assets/the-pyramid-from-mena-house_1757459228638.jpeg",
          description: "Historic palace hotel with direct views of the Great Pyramids. A legendary retreat where royalty and celebrities have stayed for over a century.",
          featured: true
        },
        {
          name: "Sofitel Winter Palace",
          location: "Luxor",
          region: "Luxor",
          type: "Palace",
          rating: 5,
          priceTier: "$$$$",
          amenities: ["Nile Gardens", "Royal Heritage", "Pool Complex", "Historic Charm"],
          image: "/api/assets/luxor_1757531163688.jpg",
          description: "Victorian grandeur on the banks of the Nile. This legendary hotel has hosted dignitaries and explorers since 1886.",
          featured: true
        },
        {
          name: "Four Seasons Hotel Cairo at Nile Plaza",
          location: "Cairo",
          region: "Cairo & Giza",
          type: "Resort",
          rating: 5,
          priceTier: "$$$$",
          amenities: ["Nile Views", "Luxury Spa", "Fine Dining", "Business Center"],
          image: "/api/assets/suite-nile_1757457083796.jpg",
          description: "Modern luxury with panoramic Nile views in the heart of Cairo. Contemporary elegance meets Egyptian hospitality.",
          featured: true
        }
      ];
      for (const hotel of sampleHotels) {
        await storage.createHotel(hotel);
      }
      console.log("\u2713 Sample hotels seeded");
    }
    const existingInquiries = await storage.getInquiries();
    if (existingInquiries.length === 0) {
      const sampleInquiries = [
        {
          fullName: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1-555-0123",
          destination: "Luxor & Aswan",
          preferredDates: "March 15-25, 2025",
          specialRequests: "Anniversary celebration, prefer Nile view rooms"
        },
        {
          fullName: "David Chen",
          email: "david.chen@email.com",
          phone: "+1-555-0456",
          destination: "Cairo & Giza",
          preferredDates: "April 10-20, 2025",
          specialRequests: "Photography tour, need early pyramid access"
        }
      ];
      for (const inquiry of sampleInquiries) {
        await storage.createInquiry(inquiry);
      }
      console.log("\u2713 Sample inquiries seeded");
    }
    const existingSettings = await storage.getAllSettings();
    if (existingSettings.length === 0) {
      await storage.upsertSetting("contact_email", "info@luxortravel.com", "admin");
      await storage.upsertSetting("inquiry_notification_email", "support@luxortravel.com", "admin");
      await storage.upsertSetting("site_name", "Luxury Egypt Tours", "admin");
      await storage.upsertSetting("site_tagline", "Experience the magic of Egypt.", "admin");
      console.log("\u2713 Sample settings seeded");
    }
    console.log("\u2713 Database seeding completed");
  } catch (error) {
    console.error("Database seeding error:", error);
  }
}
seedDatabase();

// server/routes.ts
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { z as z2 } from "zod";

// server/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is required for security");
  process.exit(1);
}
var JWT_SECRET_STRING = JWT_SECRET;
var JWT_EXPIRES_IN = "7d";
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET_STRING,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_STRING);
  } catch (error) {
    return null;
  }
}
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
  const user = await storage.getUser(decoded.id);
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }
  req.user = user;
  next();
}
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
var requireAdmin = requireRole(["admin"]);
var requireEditor = requireRole(["admin", "editor"]);
var requireAuth = authenticateToken;

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      console.log("New luxury travel inquiry received:", {
        name: inquiry.fullName,
        email: inquiry.email,
        destination: inquiry.destination,
        dates: inquiry.preferredDates
      });
      res.status(201).json({
        success: true,
        message: "Thank you for your inquiry! Our luxury travel specialists will contact you within 24 hours to craft your bespoke Egyptian journey.",
        inquiry: {
          id: inquiry.id,
          fullName: inquiry.fullName,
          email: inquiry.email
        }
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({
          success: false,
          message: "Please check your form data",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
      } else {
        console.error("Error creating inquiry:", error);
        res.status(500).json({
          success: false,
          message: "We apologize, but there was an error processing your inquiry. Please try again or contact us directly."
        });
      }
    }
  });
  app2.get("/api/public/tours", async (req, res) => {
    try {
      const { category } = req.query;
      const allTours = await storage.getTours();
      const tours2 = category ? allTours.filter((tour) => tour.category === category) : allTours;
      res.json({ success: true, tours: tours2 });
    } catch (error) {
      console.error("Error fetching tours:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching tours"
      });
    }
  });
  app2.get("/api/public/tours/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tour = await storage.getTourBySlug(slug);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }
      res.json({ success: true, tour });
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching tour"
      });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user);
      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      if (error instanceof Error && error.message && error.message.includes("map")) {
        return res.status(503).json({
          message: "Database not initialized. Please contact administrator.",
          hint: "Try calling /api/init-db first"
        });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/register", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(userData.password);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/auth/verify", requireAuth, async (req, res) => {
    const authReq = req;
    res.json({
      success: true,
      user: {
        id: authReq.user.id,
        username: authReq.user.username,
        email: authReq.user.email,
        role: authReq.user.role
      }
    });
  });
  app2.post("/api/init-db", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Database initialization is only allowed in development mode"
      });
    }
    try {
      const seedResponse = await fetch("http://localhost:5000/api/auth/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const hotelSeedResponse = await fetch("http://localhost:5000/api/hotels/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      res.json({
        success: true,
        message: "Database initialized successfully",
        details: {
          admin: await seedResponse.json(),
          hotels: await hotelSeedResponse.json()
        }
      });
    } catch (error) {
      console.error("Database initialization error:", error);
      res.status(500).json({
        success: false,
        message: "Error initializing database",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/auth/seed", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Admin seeding is only allowed in development mode"
      });
    }
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.json({
          success: true,
          message: "Admin user already exists"
        });
      }
      const hashedPassword = await hashPassword("admin123");
      const adminUser = await storage.createUser({
        username: "admin",
        email: "admin@luxortravel.com",
        password: hashedPassword,
        role: "admin"
      });
      res.json({
        success: true,
        message: "Default admin user created successfully",
        credentials: {
          username: "admin",
          password: "admin123"
        }
      });
    } catch (error) {
      console.error("Error seeding admin user:", error);
      res.status(500).json({ message: "Error creating admin user" });
    }
  });
  app2.post("/api/hotels/seed", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Hotel seeding is only allowed in development mode"
      });
    }
    try {
      const existingHotels = await storage.getHotels();
      if (existingHotels.length > 0) {
        return res.json({
          success: true,
          message: "Hotels already exist in database",
          count: existingHotels.length
        });
      }
      let adminUser = await storage.getUserByUsername("admin");
      if (!adminUser) {
        const hashedPassword = await hashPassword("admin123");
        adminUser = await storage.createUser({
          username: "admin",
          email: "admin@luxortravel.com",
          password: hashedPassword,
          role: "admin"
        });
      }
      const hotelsToSeed = [
        {
          id: "mena-house",
          name: "Mena House Hotel",
          location: "Giza",
          region: "Cairo & Giza",
          type: "Palace",
          rating: 5,
          priceTier: "$$$$",
          amenities: ["Pyramid Views", "Historic Heritage", "Luxury Spa", "Fine Dining"],
          image: "/api/assets/the-pyramid-from-mena-house_1757459228638.jpeg",
          description: "Historic palace hotel with direct views of the Great Pyramids. A legendary retreat where royalty and celebrities have stayed for over a century.",
          featured: true,
          createdBy: adminUser.id
        },
        {
          id: "sofitel-winter-palace",
          name: "Sofitel Winter Palace",
          location: "Luxor",
          region: "Luxor",
          type: "Palace",
          rating: 5,
          priceTier: "$$$$",
          amenities: ["Nile Gardens", "Royal Heritage", "Pool Complex", "Historic Charm"],
          image: "/api/assets/luxor_1757531163688.jpg",
          description: "Victorian grandeur on the banks of the Nile. This legendary hotel has hosted dignitaries and explorers since 1886.",
          featured: true,
          createdBy: adminUser.id
        },
        {
          id: "adrere-amellal",
          name: "Adr\xE8re Amellal",
          location: "Siwa Oasis",
          region: "Siwa",
          type: "Eco-Lodge",
          rating: 4,
          priceTier: "$$$",
          amenities: ["Eco-Friendly", "Desert Views", "Natural Architecture", "Wellness"],
          image: "/api/assets/siwa_1757531163689.jpg",
          description: "Eco-luxury desert lodge built entirely from natural materials. Experience the serene beauty of the Sahara in sustainable comfort.",
          featured: true,
          createdBy: adminUser.id
        },
        {
          id: "four-seasons-nile-plaza",
          name: "Four Seasons Hotel Cairo at Nile Plaza",
          location: "Cairo",
          region: "Cairo & Giza",
          type: "Resort",
          rating: 5,
          priceTier: "$$$$",
          amenities: ["Nile Views", "Luxury Spa", "Fine Dining", "Business Center"],
          image: "/api/assets/suite-nile_1757457083796.jpg",
          description: "Modern luxury with panoramic Nile views in the heart of Cairo. Contemporary elegance meets Egyptian hospitality.",
          featured: true,
          createdBy: adminUser.id
        }
      ];
      const createdHotels = [];
      for (const hotelData of hotelsToSeed) {
        const { id, ...hotelWithoutId } = hotelData;
        const hotel = await storage.createHotel(hotelWithoutId);
        createdHotels.push(hotel);
      }
      res.json({
        success: true,
        message: "Hotels seeded successfully",
        count: createdHotels.length,
        hotels: createdHotels
      });
    } catch (error) {
      console.error("Error seeding hotels:", error);
      res.status(500).json({ message: "Error seeding hotels" });
    }
  });
  app2.post("/api/tours/seed", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Tour seeding is only allowed in development mode"
      });
    }
    try {
      const existingTours = await storage.getTours();
      if (existingTours.length > 0) {
        return res.json({
          success: true,
          message: "Tours already exist in database",
          count: existingTours.length
        });
      }
      let adminUser = await storage.getUserByUsername("admin");
      if (!adminUser) {
        const hashedPassword = await hashPassword("admin123");
        adminUser = await storage.createUser({
          username: "admin",
          email: "admin@luxortravel.com",
          password: hashedPassword,
          role: "admin"
        });
      }
      const toursToSeed = [
        {
          title: "The Ultimate Egypt Tour",
          slug: "ultimate-egypt-tour",
          description: "Experience the ultimate family adventure across Egypt's most iconic destinations. This comprehensive 10-day luxury journey takes your family from the Great Pyramids of Giza to the magnificent temples of Luxor and Aswan, with a luxurious Nile cruise, hot air balloon rides, and countless unforgettable experiences.",
          shortDescription: "The ultimate 10-day family adventure covering Egypt's greatest wonders from Cairo to Aswan.",
          heroImage: "/api/assets/pyramid-from-lobby_1757459228637.jpeg",
          gallery: ["/api/assets/pyramid-from-lobby_1757459228637.jpeg", "/api/assets/the-pyramid-from-mena-house_1757459228638.jpeg", "/api/assets/luxor_1757531163688.jpg", "/api/assets/suite-nile_1757457083796.jpg"],
          duration: "10 Days / 9 Nights",
          groupSize: "4-16 people",
          difficulty: "Easy",
          price: 3850,
          currency: "USD",
          includes: ["9 nights luxury accommodation", "All meals", "Private Egyptologist guide", "Domestic flights", "Hot air balloon ride", "3-night Nile cruise", "All entrance fees", "Private transportation", "Camel ride", "Traditional felucca sailing", "Sound and Light show", "Airport transfers"],
          excludes: ["International flights", "Travel insurance", "Pyramid interior entry", "Personal expenses", "Tips and gratuities", "Visa fees"],
          itinerary: [
            { day: 1, title: "Arrival in Cairo", activities: ["Airport meet and greet", "Hotel check-in", "Welcome dinner"] },
            { day: 2, title: "Pyramids & Sphinx", activities: ["Visit Great Pyramid", "See the Sphinx", "Camel ride", "Solar Boat Museum"] },
            { day: 3, title: "Egyptian Museum & Islamic Cairo", activities: ["Egyptian Museum tour", "Tutankhamun treasures", "Khan el-Khalili bazaar", "Mohamed Ali Mosque"] },
            { day: 4, title: "Flight to Aswan & Nile Cruise", activities: ["Flight to Aswan", "Board Nile cruise", "Visit Philae Temple", "Aswan High Dam"] },
            { day: 5, title: "Abu Simbel & Sailing", activities: ["Optional Abu Simbel excursion", "Sailing the Nile", "Cooking demonstration", "Captain's dinner"] },
            { day: 6, title: "Kom Ombo & Edfu", activities: ["Kom Ombo Temple", "Temple of Horus at Edfu", "Horse carriage ride", "Galabeya party"] },
            { day: 7, title: "Valley of the Kings", activities: ["Optional hot air balloon", "Valley of the Kings", "Hatshepsut Temple", "Colossi of Memnon"] },
            { day: 8, title: "Karnak & Luxor Temples", activities: ["Karnak Temple complex", "Luxor Temple", "Sound and Light Show"] },
            { day: 9, title: "Free Day & Activities", activities: ["Optional temple visits", "Hieroglyphics workshop", "Pool relaxation", "Farewell dinner"] },
            { day: 10, title: "Departure", activities: ["Final breakfast", "Airport transfer", "Departure"] }
          ],
          destinations: ["Cairo", "Giza", "Aswan", "Kom Ombo", "Edfu", "Luxor"],
          category: "Family Luxury",
          featured: true,
          published: true,
          createdBy: adminUser.id
        },
        {
          title: "Family Pyramid Adventure & Camel Ride",
          slug: "family-pyramid-adventure",
          description: "An unforgettable family experience at the Giza Pyramids including private tours, camel rides, and interactive activities designed specifically for children. Expert Egyptologists guide families through ancient mysteries while keeping young explorers engaged with age-appropriate storytelling and hands-on learning experiences.",
          shortDescription: "Perfect family adventure at the Great Pyramids with camel rides and kid-friendly activities.",
          heroImage: "/api/assets/pyramid-from-lobby_1757459228637.jpeg",
          gallery: ["/api/assets/pyramid-from-lobby_1757459228637.jpeg", "/api/assets/the-pyramid-from-mena-house_1757459228638.jpeg"],
          duration: "Full Day (8 hours)",
          groupSize: "4-12 people",
          difficulty: "Easy",
          price: 450,
          currency: "USD",
          includes: ["Private Egyptologist guide", "Camel ride for all family members", "Egyptian Museum entry with kid-friendly tour", "Lunch at pyramid-view restaurant", "Hotel pickup and drop-off", "Bottled water and snacks"],
          excludes: ["Pyramid interior entry (can be added)", "Personal expenses", "Gratuities"],
          itinerary: [
            { day: 1, title: "Family Pyramid Adventure", activities: ["Morning pickup from Cairo hotel", "Guided tour of the Great Pyramids with storytelling for children", "Camel ride around the Giza Plateau", "Visit the Sphinx with photo opportunities", "Lunch with pyramid views", "Interactive Egyptian Museum tour focusing on Tutankhamun treasures", "Return to hotel"] }
          ],
          destinations: ["Cairo", "Giza"],
          category: "Family Luxury",
          featured: true,
          published: true,
          createdBy: adminUser.id
        },
        {
          title: "Alexandria Family Beach & History Escape",
          slug: "alexandria-family-beach-history",
          description: "Perfect blend of history and relaxation designed for families seeking both culture and leisure. This 3-day coastal getaway takes your family to Alexandria, Egypt's Mediterranean jewel, where ancient wonders meet pristine beaches. Explore the legendary Bibliotheca Alexandrina, walk through Roman catacombs, and enjoy quality beach time at family-friendly resorts. Your children will love the interactive science museum, traditional fish market visits, and beach activities while learning about Cleopatra's legendary city.",
          shortDescription: "Mediterranean family adventure combining Alexandria's historic sites with beach relaxation.",
          heroImage: "/api/assets/pyramid-from-lobby_1757459228637.jpeg",
          gallery: ["/api/assets/pyramid-from-lobby_1757459228637.jpeg", "/api/assets/the-pyramid-from-mena-house_1757459228638.jpeg"],
          duration: "3 Days / 2 Nights",
          groupSize: "4-12 people",
          difficulty: "Easy",
          price: 680,
          currency: "USD",
          includes: ["2 nights at family-friendly beach resort", "All meals (breakfast, lunch, dinner)", "Private family guide throughout", "Round-trip transportation from Cairo", "All entrance fees and permits", "Beach resort access and activities", "Science museum planetarium show", "Traditional seafood lunch at harbor", "Ice cream stop for children", "Beach toys and equipment"],
          excludes: ["Water sports activities (optional add-ons)", "Personal expenses", "Tips and gratuities", "Room service at hotel"],
          itinerary: [
            { day: 1, title: "Cairo to Alexandria - Coastal Arrival", activities: ["Morning pickup from Cairo hotel (3-hour scenic drive)", "Stop at rest area with refreshments", "Arrive Alexandria and check-in at beach resort", "Welcome lunch with Mediterranean sea views", "Afternoon beach time with kids' activities", "Visit to Bibliotheca Alexandrina (modern library)", "Interactive children's discovery center", "Sunset walk along the Corniche", "Dinner at resort with family entertainment"] },
            { day: 2, title: "Ancient Alexandria & Marine Adventures", activities: ["Breakfast at resort", "Visit Catacombs of Kom el Shoqafa", "Explore Pompey's Pillar with storytelling for kids", "Stop at traditional fish market", "Fresh seafood lunch at harbor restaurant", "Visit Citadel of Qaitbay (built on ancient lighthouse site)", "Ice cream break at famous Alexandria parlor", "Return to resort for swimming and beach games", "Evening BBQ dinner on the beach"] },
            { day: 3, title: "Science & Culture - Return to Cairo", activities: ["Leisurely breakfast", "Morning beach time and resort activities", "Visit Alexandria Planetarium Science Museum", "Interactive exhibits perfect for children", "Lunch at resort", "Check out and depart for Cairo", "Stop for photos at Montazah Palace gardens", "Return to Cairo hotel (arrive evening)", "End of Alexandria family adventure"] }
          ],
          destinations: ["Alexandria", "Cairo"],
          category: "Family Luxury",
          featured: true,
          published: true,
          createdBy: adminUser.id
        }
      ];
      const createdTours = [];
      for (const tourData of toursToSeed) {
        const tour = await storage.createTour(tourData);
        createdTours.push(tour);
      }
      res.json({
        success: true,
        message: "Tours seeded successfully",
        count: createdTours.length,
        tours: createdTours
      });
    } catch (error) {
      console.error("Error seeding tours:", error);
      res.status(500).json({ message: "Error seeding tours" });
    }
  });
  app2.get("/api/cms/pages", requireAuth, requireEditor, async (req, res) => {
    try {
      const pages2 = await storage.getPages();
      res.json({ success: true, pages: pages2 });
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Error fetching pages" });
    }
  });
  app2.post("/api/cms/pages", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const pageData = insertPageSchema.parse(req.body);
      const page = await storage.createPage({
        ...pageData,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, page });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Error creating page" });
    }
  });
  app2.get("/api/blog/posts", async (req, res) => {
    try {
      const allPosts = await storage.getPosts();
      const publishedPosts = allPosts.filter((post) => post.status === "published");
      res.json({ success: true, posts: publishedPosts });
    } catch (error) {
      console.error("Error fetching published posts:", error);
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  app2.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      if (post.status !== "published") {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ success: true, post });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });
  app2.get("/api/cms/posts", requireAuth, requireEditor, async (req, res) => {
    try {
      const posts2 = await storage.getPosts();
      res.json({ success: true, posts: posts2 });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  });
  app2.post("/api/cms/posts", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const postData = insertPostSchema.parse(req.body);
      const sanitizedSlug = postData.slug.trim().replace(/^[\s/]+|[\s/]+$/g, "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      const post = await storage.createPost({
        ...postData,
        slug: sanitizedSlug,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, post });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post" });
    }
  });
  app2.get("/api/cms/posts/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ success: true, post });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Error fetching post" });
    }
  });
  app2.put("/api/cms/posts/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const postData = insertPostSchema.partial().parse(req.body);
      if (postData.slug) {
        postData.slug = postData.slug.trim().replace(/^[\s/]+|[\s/]+$/g, "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      }
      const post = await storage.updatePost(req.params.id, postData);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ success: true, post });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Error updating post" });
    }
  });
  app2.delete("/api/cms/posts/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Error deleting post" });
    }
  });
  app2.get("/api/hotels", async (req, res) => {
    try {
      const hotels2 = await storage.getHotels();
      res.json({ success: true, hotels: hotels2 });
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ message: "Error fetching hotels" });
    }
  });
  app2.get("/api/hotels/:idOrSlug", async (req, res) => {
    try {
      const param = req.params.idOrSlug;
      let hotel = await storage.getHotelBySlug(param);
      if (!hotel) {
        hotel = await storage.getHotel(param);
      }
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json({ success: true, hotel });
    } catch (error) {
      console.error("Error fetching hotel:", error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  });
  app2.post("/api/cms/hotels", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const hotelData = insertHotelSchema.parse(req.body);
      let slug = hotelData.slug || hotelData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      let slugCounter = 1;
      let finalSlug = slug;
      while (await storage.getHotelBySlug(finalSlug)) {
        finalSlug = `${slug}-${slugCounter}`;
        slugCounter++;
      }
      const hotel = await storage.createHotel({
        ...hotelData,
        slug: finalSlug,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, hotel });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error creating hotel:", error);
      res.status(500).json({ message: "Error creating hotel" });
    }
  });
  app2.put("/api/cms/hotels/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const hotelData = insertHotelSchema.partial().parse(req.body);
      const hotel = await storage.updateHotel(req.params.id, hotelData);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json({ success: true, hotel });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error updating hotel:", error);
      res.status(500).json({ message: "Error updating hotel" });
    }
  });
  app2.delete("/api/cms/hotels/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteHotel(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json({ success: true, message: "Hotel deleted successfully" });
    } catch (error) {
      console.error("Error deleting hotel:", error);
      res.status(500).json({ message: "Error deleting hotel" });
    }
  });
  app2.get("/api/cms/hotels", requireAuth, requireEditor, async (req, res) => {
    try {
      const hotels2 = await storage.getHotels();
      res.json({ success: true, hotels: hotels2 });
    } catch (error) {
      console.error("Error fetching hotels for CMS:", error);
      res.status(500).json({ message: "Error fetching hotels" });
    }
  });
  app2.get("/api/cms/tours", requireAuth, requireEditor, async (req, res) => {
    try {
      const tours2 = await storage.getTours();
      res.json({ success: true, tours: tours2 });
    } catch (error) {
      console.error("Error fetching tours for CMS:", error);
      res.status(500).json({ message: "Error fetching tours" });
    }
  });
  app2.get("/api/cms/tours/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const tour = await storage.getTour(req.params.id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json({ success: true, tour });
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({ message: "Error fetching tour" });
    }
  });
  app2.post("/api/cms/tours", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const tourData = insertTourSchema.parse(req.body);
      const tour = await storage.createTour({
        ...tourData,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, tour });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error creating tour:", error);
      res.status(500).json({ message: "Error creating tour" });
    }
  });
  app2.post("/api/cms/tours/bulk-import", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const { tours: tours2 } = req.body;
      if (!Array.isArray(tours2) || tours2.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No tours provided for import"
        });
      }
      const results = {
        imported: 0,
        failed: 0,
        errors: []
      };
      const existingTours = await storage.getTours();
      const existingSlugs = new Set(existingTours.map((t) => t.slug));
      for (let i = 0; i < tours2.length; i++) {
        const tour = tours2[i];
        try {
          let slug = tour.slug;
          let slugCounter = 1;
          while (existingSlugs.has(slug)) {
            slug = `${tour.slug}-${slugCounter}`;
            slugCounter++;
          }
          if (!tour.title || !tour.description || !tour.heroImage || !tour.duration || !tour.category) {
            throw new Error("Missing required fields");
          }
          const tourData = insertTourSchema.parse({
            title: tour.title,
            slug,
            description: tour.description,
            shortDescription: tour.shortDescription || "",
            heroImage: tour.heroImage,
            gallery: tour.gallery || [],
            duration: tour.duration,
            groupSize: tour.groupSize || "",
            difficulty: tour.difficulty || "Easy",
            price: Number(tour.price) || 0,
            currency: tour.currency || "USD",
            category: tour.category,
            includes: tour.includes || [],
            excludes: tour.excludes || [],
            destinations: tour.destinations || [],
            itinerary: tour.itinerary || [],
            featured: Boolean(tour.featured),
            published: tour.published !== false,
            createdBy: authReq.user.id
          });
          await storage.createTour(tourData);
          existingSlugs.add(slug);
          results.imported++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            row: i + 2,
            // +2 because row 1 is header, and array is 0-indexed
            message: error.message || "Unknown error"
          });
        }
      }
      res.json({
        success: results.imported > 0,
        imported: results.imported,
        failed: results.failed,
        errors: results.errors
      });
    } catch (error) {
      console.error("Error in bulk import:", error);
      res.status(500).json({
        success: false,
        message: "Error processing bulk import",
        imported: 0,
        failed: 0,
        errors: [{ row: 0, message: "Server error during import" }]
      });
    }
  });
  app2.put("/api/cms/tours/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const tourData = insertTourSchema.partial().parse(req.body);
      const tour = await storage.updateTour(req.params.id, tourData);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json({ success: true, tour });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error updating tour:", error);
      res.status(500).json({ message: "Error updating tour" });
    }
  });
  app2.delete("/api/cms/tours/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteTour(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json({ success: true, message: "Tour deleted successfully" });
    } catch (error) {
      console.error("Error deleting tour:", error);
      res.status(500).json({ message: "Error deleting tour" });
    }
  });
  app2.get("/api/cms/packages", requireAuth, requireEditor, async (req, res) => {
    try {
      const packages2 = await storage.getPackages();
      res.json({ success: true, packages: packages2 });
    } catch (error) {
      console.error("Error fetching packages for CMS:", error);
      res.status(500).json({ message: "Error fetching packages" });
    }
  });
  app2.post("/api/cms/packages", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const packageData = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage({
        ...packageData,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, package: pkg });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error creating package:", error);
      res.status(500).json({ message: "Error creating package" });
    }
  });
  app2.put("/api/cms/packages/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const packageData = insertPackageSchema.partial().parse(req.body);
      const pkg = await storage.updatePackage(req.params.id, packageData);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json({ success: true, package: pkg });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error updating package:", error);
      res.status(500).json({ message: "Error updating package" });
    }
  });
  app2.delete("/api/cms/packages/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deletePackage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json({ success: true, message: "Package deleted successfully" });
    } catch (error) {
      console.error("Error deleting package:", error);
      res.status(500).json({ message: "Error deleting package" });
    }
  });
  app2.get("/api/cms/categories", requireAuth, requireEditor, async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json({ success: true, categories: categories2 });
    } catch (error) {
      console.error("Error fetching categories for CMS:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.post("/api/cms/categories", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory({
        ...categoryData,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, category });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });
  app2.put("/api/cms/categories/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ success: true, category });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });
  app2.delete("/api/cms/categories/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });
  app2.get("/api/public/categories", async (req, res) => {
    try {
      const { type } = req.query;
      const categories2 = await storage.getCategories();
      const filtered = typeof type === "string" ? categories2.filter((category) => category.categoryType === type) : categories2;
      res.json({ success: true, categories: filtered });
    } catch (error) {
      console.error("Error fetching public categories:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching categories"
      });
    }
  });
  app2.get("/api/public/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const categories2 = await storage.getCategories();
      const category = categories2.find((cat) => cat.slug === slug);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }
      res.json({ success: true, category });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching category"
      });
    }
  });
  app2.get("/api/public/destinations", async (req, res) => {
    try {
      const destinations2 = await storage.getDestinations();
      const publishedDestinations = destinations2.filter((dest) => dest.published);
      res.json({ success: true, destinations: publishedDestinations });
    } catch (error) {
      console.error("Error fetching public destinations:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching destinations"
      });
    }
  });
  app2.get("/api/public/destinations/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const destinations2 = await storage.getDestinations();
      const destination = destinations2.find((dest) => dest.slug === slug && dest.published);
      if (!destination) {
        return res.status(404).json({
          success: false,
          message: "Destination not found"
        });
      }
      res.json({ success: true, destination });
    } catch (error) {
      console.error("Error fetching destination:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching destination"
      });
    }
  });
  app2.get("/api/cms/destinations", requireAuth, requireEditor, async (req, res) => {
    try {
      const destinations2 = await storage.getDestinations();
      res.json(destinations2);
    } catch (error) {
      console.error("Error fetching destinations for CMS:", error);
      res.status(500).json({ message: "Error fetching destinations" });
    }
  });
  app2.post("/api/cms/destinations", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const destinationData = insertDestinationSchema.parse(req.body);
      const destination = await storage.createDestination({
        ...destinationData,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, destination });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      if (error?.constraint === "destinations_slug_unique" || error?.code === "23505") {
        return res.status(400).json({
          message: "A destination with this slug already exists. Please use a different slug."
        });
      }
      console.error("Error creating destination:", error);
      res.status(500).json({ message: "Error creating destination" });
    }
  });
  app2.get("/api/cms/destinations/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json({ success: true, destination });
    } catch (error) {
      console.error("Error fetching destination:", error);
      res.status(500).json({ message: "Error fetching destination" });
    }
  });
  app2.put("/api/cms/destinations/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const destinationData = insertDestinationSchema.partial().parse(req.body);
      const destination = await storage.updateDestination(req.params.id, destinationData);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json({ success: true, destination });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Error updating destination:", error);
      res.status(500).json({ message: "Error updating destination" });
    }
  });
  app2.delete("/api/cms/destinations/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteDestination(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json({ success: true, message: "Destination deleted successfully" });
    } catch (error) {
      console.error("Error deleting destination:", error);
      res.status(500).json({ message: "Error deleting destination" });
    }
  });
  app2.get("/api/cms/stats", requireAuth, requireEditor, async (req, res) => {
    try {
      const [hotels2, inquiries2, pages2, posts2, packages2, tours2, destinations2] = await Promise.all([
        storage.getHotels(),
        storage.getInquiries(),
        storage.getPages(),
        storage.getPosts(),
        storage.getPackages(),
        storage.getTours(),
        storage.getDestinations()
      ]);
      res.json({
        success: true,
        stats: {
          hotels: hotels2.length,
          inquiries: inquiries2.length,
          pages: pages2.length,
          posts: posts2.length,
          packages: packages2.length,
          tours: tours2.length,
          destinations: destinations2.length,
          media: 24
          // Static for now
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  });
  app2.get("/api/inquiries", requireAuth, requireEditor, async (req, res) => {
    try {
      const inquiries2 = await storage.getInquiries();
      res.json({
        success: true,
        inquiries: inquiries2
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching inquiries"
      });
    }
  });
  app2.get("/api/inquiries/:id", async (req, res) => {
    try {
      const inquiry = await storage.getInquiry(req.params.id);
      if (!inquiry) {
        res.status(404).json({
          success: false,
          message: "Inquiry not found"
        });
        return;
      }
      res.json({
        success: true,
        inquiry
      });
    } catch (error) {
      console.error("Error fetching inquiry:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching inquiry"
      });
    }
  });
  const uploadPath = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads");
  import("fs").then((fs2) => {
    if (!fs2.existsSync(uploadPath)) {
      fs2.mkdirSync(uploadPath, { recursive: true });
      console.log("Created uploads directory:", uploadPath);
    }
  });
  const storage_config = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const filename = `${uuidv4()}${fileExtension}`;
      cb(null, filename);
    }
  });
  const upload = multer({
    storage: storage_config,
    limits: { fileSize: 50 * 1024 * 1024 },
    // 50MB limit for videos
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp|avif|mp4|mov|webm|avi|pdf|doc|docx/;
      const allowedMimeTypes = /image\/|video\/|application\/pdf|application\/msword|application\/vnd/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedMimeTypes.test(file.mimetype);
      if (mimetype || extname) {
        return cb(null, true);
      } else {
        cb(new Error("Only images, videos and documents are allowed!"));
      }
    }
  });
  app2.get("/api/cms/media", requireAuth, requireEditor, async (req, res) => {
    try {
      const media2 = await storage.getMedia();
      res.json({ success: true, media: media2 });
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Error fetching media" });
    }
  });
  app2.get("/api/cms/media/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const media2 = await storage.getMediaById(req.params.id);
      if (!media2) {
        return res.status(404).json({ message: "Media not found" });
      }
      res.json({ success: true, media: media2 });
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Error fetching media" });
    }
  });
  app2.post("/api/cms/media", requireAuth, requireEditor, upload.single("file"), async (req, res) => {
    try {
      const authReq = req;
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const mediaData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/api/assets/uploads/${req.file.filename}`,
        uploadedBy: authReq.user.id
      };
      const media2 = await storage.createMedia(mediaData);
      res.status(201).json({ success: true, media: media2 });
    } catch (error) {
      console.error("Error uploading media:", error);
      res.status(500).json({ message: "Error uploading media" });
    }
  });
  app2.delete("/api/cms/media/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const media2 = await storage.getMediaById(req.params.id);
      if (!media2) {
        return res.status(404).json({ message: "Media not found" });
      }
      const success = await storage.deleteMedia(req.params.id);
      if (success) {
        try {
          const filePath = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads", media2.filename);
          await import("fs").then((fs2) => fs2.promises.unlink(filePath));
        } catch (fileError) {
          console.warn("Could not delete file from disk:", fileError);
        }
        res.json({ success: true, message: "Media deleted successfully" });
      } else {
        res.status(500).json({ message: "Error deleting media" });
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ message: "Error deleting media" });
    }
  });
  app2.get("/api/cms/settings", requireAuth, requireEditor, async (req, res) => {
    try {
      const allSettings = await storage.getAllSettings();
      const settingsObj = allSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      res.json({ success: true, settings: settingsObj });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Error fetching settings" });
    }
  });
  app2.post("/api/cms/settings/change-username", requireAuth, async (req, res) => {
    try {
      const authReq = req;
      const { newUsername, currentPassword } = req.body;
      const isValidPassword = await verifyPassword(currentPassword, authReq.user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      const existingUser = await storage.getUserByUsername(newUsername);
      if (existingUser && existingUser.id !== authReq.user.id) {
        return res.status(400).json({ message: "Username already taken" });
      }
      const updatedUser = await storage.updateUser(authReq.user.id, { username: newUsername });
      res.json({
        success: true,
        message: "Username updated successfully",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
    } catch (error) {
      console.error("Error changing username:", error);
      res.status(500).json({ message: "Error changing username" });
    }
  });
  app2.post("/api/cms/settings/change-password", requireAuth, async (req, res) => {
    try {
      const authReq = req;
      const { currentPassword, newPassword } = req.body;
      const isValidPassword = await verifyPassword(currentPassword, authReq.user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(authReq.user.id, { password: hashedPassword });
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Error changing password" });
    }
  });
  app2.post("/api/cms/settings/site-info", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const { siteName, siteTitle, faviconUrl, contactEmail, contactPhone, contactAddress } = req.body;
      await Promise.all([
        storage.upsertSetting("site_name", siteName, authReq.user.id),
        storage.upsertSetting("site_title", siteTitle, authReq.user.id),
        storage.upsertSetting("favicon_url", faviconUrl || "", authReq.user.id),
        storage.upsertSetting("contact_email", contactEmail, authReq.user.id),
        storage.upsertSetting("contact_phone", contactPhone, authReq.user.id),
        storage.upsertSetting("contact_address", contactAddress, authReq.user.id)
      ]);
      res.json({ success: true, message: "Site information updated successfully" });
    } catch (error) {
      console.error("Error updating site info:", error);
      res.status(500).json({ message: "Error updating site information" });
    }
  });
  app2.get("/api/public/site-metadata", async (req, res) => {
    try {
      const [titleSetting, faviconSetting] = await Promise.all([
        storage.getSetting("site_title"),
        storage.getSetting("favicon_url")
      ]);
      res.json({
        success: true,
        siteTitle: titleSetting?.value || "I.LuxuryEgypt - Bespoke Luxury Travel in Egypt",
        faviconUrl: faviconSetting?.value || null
      });
    } catch (error) {
      console.error("Error fetching site metadata:", error);
      res.status(500).json({ message: "Error fetching site metadata" });
    }
  });
  app2.post("/api/cms/settings/email", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const { inquiryNotificationEmail } = req.body;
      await storage.upsertSetting("inquiry_notification_email", inquiryNotificationEmail, authReq.user.id);
      res.json({ success: true, message: "Email settings updated successfully" });
    } catch (error) {
      console.error("Error updating email settings:", error);
      res.status(500).json({ message: "Error updating email settings" });
    }
  });
  app2.post("/api/cms/settings/brochure", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const { brochureUrl } = req.body;
      await storage.upsertSetting("brochure_url", brochureUrl, authReq.user.id);
      res.json({ success: true, message: "Brochure URL updated successfully" });
    } catch (error) {
      console.error("Error updating brochure settings:", error);
      res.status(500).json({ message: "Error updating brochure settings" });
    }
  });
  app2.get("/api/public/brochure", async (req, res) => {
    try {
      const setting = await storage.getSetting("brochure_url");
      res.json({ success: true, brochureUrl: setting?.value || null });
    } catch (error) {
      console.error("Error fetching brochure URL:", error);
      res.status(500).json({ message: "Error fetching brochure URL" });
    }
  });
  app2.post("/api/cms/settings/whatsapp", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const { whatsappNumber, whatsappEnabled } = req.body;
      await storage.upsertSetting("whatsapp_number", whatsappNumber, authReq.user.id);
      await storage.upsertSetting("whatsapp_enabled", whatsappEnabled ? "true" : "false", authReq.user.id);
      res.json({ success: true, message: "WhatsApp settings updated successfully" });
    } catch (error) {
      console.error("Error updating WhatsApp settings:", error);
      res.status(500).json({ message: "Error updating WhatsApp settings" });
    }
  });
  app2.get("/api/public/whatsapp-settings", async (req, res) => {
    try {
      const numberSetting = await storage.getSetting("whatsapp_number");
      const enabledSetting = await storage.getSetting("whatsapp_enabled");
      res.json({
        success: true,
        whatsappNumber: numberSetting?.value || null,
        whatsappEnabled: enabledSetting?.value === "true"
      });
    } catch (error) {
      console.error("Error fetching WhatsApp settings:", error);
      res.status(500).json({ message: "Error fetching WhatsApp settings" });
    }
  });
  app2.get("/api/cms/contact-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting("contact_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching contact page content:", error);
      res.status(500).json({ message: "Error fetching contact page content" });
    }
  });
  app2.post("/api/cms/contact-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const content = req.body;
      await storage.upsertSetting("contact_page_content", JSON.stringify(content), authReq.user.id);
      res.json({ success: true, message: "Contact page updated successfully" });
    } catch (error) {
      console.error("Error updating contact page content:", error);
      res.status(500).json({ message: "Error updating contact page content" });
    }
  });
  app2.get("/api/public/contact-page", async (req, res) => {
    try {
      const setting = await storage.getSetting("contact_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching contact page content:", error);
      res.status(500).json({ message: "Error fetching contact page content" });
    }
  });
  app2.get("/api/cms/who-we-are-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting("who_we_are_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching who we are page content:", error);
      res.status(500).json({ message: "Error fetching who we are page content" });
    }
  });
  app2.post("/api/cms/who-we-are-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const content = req.body;
      await storage.upsertSetting("who_we_are_page_content", JSON.stringify(content), authReq.user.id);
      res.json({ success: true, message: "Who we are page content updated" });
    } catch (error) {
      console.error("Error updating who we are page content:", error);
      res.status(500).json({ message: "Error updating who we are page content" });
    }
  });
  app2.get("/api/public/who-we-are-page", async (req, res) => {
    try {
      const setting = await storage.getSetting("who_we_are_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching who we are page content:", error);
      res.status(500).json({ message: "Error fetching who we are page content" });
    }
  });
  app2.get("/api/cms/iluxury-difference-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting("iluxury_difference_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching iLuxury Difference page content:", error);
      res.status(500).json({ message: "Error fetching iLuxury Difference page content" });
    }
  });
  app2.post("/api/cms/iluxury-difference-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const content = req.body;
      await storage.upsertSetting("iluxury_difference_page_content", JSON.stringify(content), authReq.user.id);
      res.json({ success: true, message: "iLuxury Difference page content updated" });
    } catch (error) {
      console.error("Error updating iLuxury Difference page content:", error);
      res.status(500).json({ message: "Error updating iLuxury Difference page content" });
    }
  });
  app2.get("/api/public/iluxury-difference-page", async (req, res) => {
    try {
      const setting = await storage.getSetting("iluxury_difference_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching iLuxury Difference page content:", error);
      res.status(500).json({ message: "Error fetching iLuxury Difference page content" });
    }
  });
  app2.get("/api/cms/your-experience-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting("your_experience_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching Your Experience page content:", error);
      res.status(500).json({ message: "Error fetching Your Experience page content" });
    }
  });
  app2.post("/api/cms/your-experience-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const content = req.body;
      await storage.upsertSetting("your_experience_page_content", JSON.stringify(content), authReq.user.id);
      res.json({ success: true, message: "Your Experience page content updated" });
    } catch (error) {
      console.error("Error updating Your Experience page content:", error);
      res.status(500).json({ message: "Error updating Your Experience page content" });
    }
  });
  app2.get("/api/public/your-experience-page", async (req, res) => {
    try {
      const setting = await storage.getSetting("your_experience_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching Your Experience page content:", error);
      res.status(500).json({ message: "Error fetching Your Experience page content" });
    }
  });
  app2.get("/api/cms/trusted-worldwide-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting("trusted_worldwide_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching Trusted Worldwide page content:", error);
      res.status(500).json({ message: "Error fetching Trusted Worldwide page content" });
    }
  });
  app2.post("/api/cms/trusted-worldwide-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const content = req.body;
      await storage.upsertSetting("trusted_worldwide_page_content", JSON.stringify(content), authReq.user.id);
      res.json({ success: true, message: "Trusted Worldwide page content updated" });
    } catch (error) {
      console.error("Error updating Trusted Worldwide page content:", error);
      res.status(500).json({ message: "Error updating Trusted Worldwide page content" });
    }
  });
  app2.get("/api/public/trusted-worldwide-page", async (req, res) => {
    try {
      const setting = await storage.getSetting("trusted_worldwide_page_content");
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching Trusted Worldwide page content:", error);
      res.status(500).json({ message: "Error fetching Trusted Worldwide page content" });
    }
  });
  app2.use("/api/assets", express.static(path.resolve(import.meta.dirname, "..", "attached_assets")));
  app2.get("/api/public/nav-items", async (req, res) => {
    try {
      const items = await storage.getNavItems();
      const visibleItems = items.filter((item) => item.isVisible);
      res.json({ success: true, navItems: visibleItems });
    } catch (error) {
      console.error("Error fetching nav items:", error);
      res.status(500).json({ message: "Error fetching navigation items" });
    }
  });
  app2.get("/api/cms/nav-items", requireAuth, requireEditor, async (req, res) => {
    try {
      const items = await storage.getNavItems();
      res.json({ success: true, navItems: items });
    } catch (error) {
      console.error("Error fetching nav items:", error);
      res.status(500).json({ message: "Error fetching navigation items" });
    }
  });
  app2.post("/api/cms/nav-items", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertNavItemSchema.parse(req.body);
      const item = await storage.createNavItem(data);
      res.status(201).json({ success: true, navItem: item });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error creating nav item:", error);
      res.status(500).json({ message: "Error creating navigation item" });
    }
  });
  app2.put("/api/cms/nav-items/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertNavItemSchema.partial().parse(req.body);
      const item = await storage.updateNavItem(req.params.id, data);
      if (!item) {
        return res.status(404).json({ message: "Navigation item not found" });
      }
      res.json({ success: true, navItem: item });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error updating nav item:", error);
      res.status(500).json({ message: "Error updating navigation item" });
    }
  });
  app2.delete("/api/cms/nav-items/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteNavItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Navigation item not found" });
      }
      res.json({ success: true, message: "Navigation item deleted" });
    } catch (error) {
      console.error("Error deleting nav item:", error);
      res.status(500).json({ message: "Error deleting navigation item" });
    }
  });
  app2.get("/api/public/site-config", async (req, res) => {
    try {
      const config = await storage.getAllSiteConfig();
      const configObj = config.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      res.json({ success: true, config: configObj });
    } catch (error) {
      console.error("Error fetching site config:", error);
      res.status(500).json({ message: "Error fetching site configuration" });
    }
  });
  app2.get("/api/cms/site-config", requireAuth, requireEditor, async (req, res) => {
    try {
      const config = await storage.getAllSiteConfig();
      res.json({ success: true, config });
    } catch (error) {
      console.error("Error fetching site config:", error);
      res.status(500).json({ message: "Error fetching site configuration" });
    }
  });
  app2.post("/api/cms/site-config", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const { key, value, type } = req.body;
      const config = await storage.upsertSiteConfig(key, value, type || "text", authReq.user.id);
      res.json({ success: true, config });
    } catch (error) {
      console.error("Error updating site config:", error);
      res.status(500).json({ message: "Error updating site configuration" });
    }
  });
  app2.post("/api/cms/site-config/bulk", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const { configs } = req.body;
      const results = await Promise.all(
        configs.map(
          (cfg) => storage.upsertSiteConfig(cfg.key, cfg.value, cfg.type || "text", authReq.user.id)
        )
      );
      res.json({ success: true, configs: results });
    } catch (error) {
      console.error("Error bulk updating site config:", error);
      res.status(500).json({ message: "Error updating site configuration" });
    }
  });
  app2.get("/api/public/footer-links", async (req, res) => {
    try {
      const links = await storage.getFooterLinks();
      const visibleLinks = links.filter((link) => link.isVisible);
      const grouped = visibleLinks.reduce((acc, link) => {
        if (!acc[link.section]) acc[link.section] = [];
        acc[link.section].push(link);
        return acc;
      }, {});
      res.json({ success: true, footerLinks: grouped });
    } catch (error) {
      console.error("Error fetching footer links:", error);
      res.status(500).json({ message: "Error fetching footer links" });
    }
  });
  app2.get("/api/cms/footer-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const links = await storage.getFooterLinks();
      res.json({ success: true, footerLinks: links });
    } catch (error) {
      console.error("Error fetching footer links:", error);
      res.status(500).json({ message: "Error fetching footer links" });
    }
  });
  app2.post("/api/cms/footer-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertFooterLinkSchema.parse(req.body);
      const link = await storage.createFooterLink(data);
      res.status(201).json({ success: true, footerLink: link });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error creating footer link:", error);
      res.status(500).json({ message: "Error creating footer link" });
    }
  });
  app2.put("/api/cms/footer-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertFooterLinkSchema.partial().parse(req.body);
      const link = await storage.updateFooterLink(req.params.id, data);
      if (!link) {
        return res.status(404).json({ message: "Footer link not found" });
      }
      res.json({ success: true, footerLink: link });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error updating footer link:", error);
      res.status(500).json({ message: "Error updating footer link" });
    }
  });
  app2.delete("/api/cms/footer-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteFooterLink(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Footer link not found" });
      }
      res.json({ success: true, message: "Footer link deleted" });
    } catch (error) {
      console.error("Error deleting footer link:", error);
      res.status(500).json({ message: "Error deleting footer link" });
    }
  });
  app2.get("/api/public/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      const visibleLinks = links.filter((link) => link.isVisible);
      res.json({ success: true, socialLinks: visibleLinks });
    } catch (error) {
      console.error("Error fetching social links:", error);
      res.status(500).json({ message: "Error fetching social links" });
    }
  });
  app2.get("/api/cms/social-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json({ success: true, socialLinks: links });
    } catch (error) {
      console.error("Error fetching social links:", error);
      res.status(500).json({ message: "Error fetching social links" });
    }
  });
  app2.post("/api/cms/social-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertSocialLinkSchema.parse(req.body);
      const link = await storage.createSocialLink(data);
      res.status(201).json({ success: true, socialLink: link });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error creating social link:", error);
      res.status(500).json({ message: "Error creating social link" });
    }
  });
  app2.put("/api/cms/social-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertSocialLinkSchema.partial().parse(req.body);
      const link = await storage.updateSocialLink(req.params.id, data);
      if (!link) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json({ success: true, socialLink: link });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error updating social link:", error);
      res.status(500).json({ message: "Error updating social link" });
    }
  });
  app2.delete("/api/cms/social-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteSocialLink(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json({ success: true, message: "Social link deleted" });
    } catch (error) {
      console.error("Error deleting social link:", error);
      res.status(500).json({ message: "Error deleting social link" });
    }
  });
  app2.get("/api/public/faqs", async (req, res) => {
    try {
      const faqList = await storage.getVisibleFaqs();
      res.json({ success: true, faqs: faqList });
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Error fetching FAQs" });
    }
  });
  app2.get("/api/cms/faqs", requireAuth, requireEditor, async (req, res) => {
    try {
      const faqList = await storage.getFaqs();
      res.json({ success: true, faqs: faqList });
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Error fetching FAQs" });
    }
  });
  app2.get("/api/cms/faqs/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const faq = await storage.getFaq(req.params.id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json({ success: true, faq });
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      res.status(500).json({ message: "Error fetching FAQ" });
    }
  });
  app2.post("/api/cms/faqs", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req;
      const data = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq({
        ...data,
        createdBy: authReq.user.id
      });
      res.status(201).json({ success: true, faq });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error creating FAQ:", error);
      res.status(500).json({ message: "Error creating FAQ" });
    }
  });
  app2.put("/api/cms/faqs/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFaq(req.params.id, data);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json({ success: true, faq });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error updating FAQ:", error);
      res.status(500).json({ message: "Error updating FAQ" });
    }
  });
  app2.delete("/api/cms/faqs/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteFaq(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json({ success: true, message: "FAQ deleted" });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ message: "Error deleting FAQ" });
    }
  });
  app2.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const data = insertNewsletterSubscriberSchema.parse(req.body);
      const existing = await storage.getNewsletterSubscriberByEmail(data.email);
      if (existing) {
        if (existing.isActive) {
          return res.status(400).json({ message: "This email is already subscribed to our newsletter." });
        } else {
          const updated = await storage.updateNewsletterSubscriber(existing.id, { isActive: true });
          return res.json({ success: true, message: "Welcome back! Your subscription has been reactivated." });
        }
      }
      const subscriber = await storage.createNewsletterSubscriber(data);
      res.status(201).json({ success: true, message: "Thank you for subscribing to our newsletter!" });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Please enter a valid email address", errors: error.errors });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });
  app2.get("/api/cms/newsletter", requireAuth, requireEditor, async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json({ success: true, subscribers });
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({ message: "Error fetching newsletter subscribers" });
    }
  });
  app2.put("/api/cms/newsletter/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertNewsletterSubscriberSchema.partial().parse(req.body);
      const subscriber = await storage.updateNewsletterSubscriber(req.params.id, data);
      if (!subscriber) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      res.json({ success: true, subscriber });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating subscriber:", error);
      res.status(500).json({ message: "Error updating subscriber" });
    }
  });
  app2.delete("/api/cms/newsletter/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteNewsletterSubscriber(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      res.json({ success: true, message: "Subscriber deleted" });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).json({ message: "Error deleting subscriber" });
    }
  });
  app2.post("/api/tour-bookings", async (req, res) => {
    try {
      const data = insertTourBookingSchema.parse(req.body);
      const booking = await storage.createTourBooking(data);
      res.status(201).json({ success: true, message: "Booking submitted successfully! We will contact you soon.", booking });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating tour booking:", error);
      res.status(500).json({ message: "Error submitting booking" });
    }
  });
  app2.get("/api/cms/tour-bookings", requireAuth, requireEditor, async (req, res) => {
    try {
      const bookings = await storage.getTourBookings();
      res.json({ success: true, bookings });
    } catch (error) {
      console.error("Error fetching tour bookings:", error);
      res.status(500).json({ message: "Error fetching tour bookings" });
    }
  });
  app2.get("/api/cms/tour-bookings/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const booking = await storage.getTourBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ success: true, booking });
    } catch (error) {
      console.error("Error fetching tour booking:", error);
      res.status(500).json({ message: "Error fetching tour booking" });
    }
  });
  app2.put("/api/cms/tour-bookings/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertTourBookingSchema.partial().parse(req.body);
      const booking = await storage.updateTourBooking(req.params.id, data);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ success: true, booking });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating tour booking:", error);
      res.status(500).json({ message: "Error updating tour booking" });
    }
  });
  app2.delete("/api/cms/tour-bookings/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteTourBooking(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ success: true, message: "Booking deleted" });
    } catch (error) {
      console.error("Error deleting tour booking:", error);
      res.status(500).json({ message: "Error deleting tour booking" });
    }
  });
  app2.post("/api/brochure-downloads", async (req, res) => {
    try {
      const { email, tourId, tourTitle, tourSlug } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const download = await storage.createBrochureDownload({ email, tourId, tourTitle, tourSlug });
      res.status(201).json({ success: true, message: "Email submitted successfully", download });
    } catch (error) {
      console.error("Error saving brochure download:", error);
      res.status(500).json({ message: "Error submitting email" });
    }
  });
  app2.get("/api/cms/brochure-downloads", requireAuth, requireEditor, async (req, res) => {
    try {
      const downloads = await storage.getBrochureDownloads();
      res.json({ success: true, downloads });
    } catch (error) {
      console.error("Error fetching brochure downloads:", error);
      res.status(500).json({ message: "Error fetching brochure downloads" });
    }
  });
  app2.delete("/api/cms/brochure-downloads/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteBrochureDownload(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Download record not found" });
      }
      res.json({ success: true, message: "Download record deleted" });
    } catch (error) {
      console.error("Error deleting brochure download:", error);
      res.status(500).json({ message: "Error deleting download record" });
    }
  });
  app2.get("/api/public/hero-slides", async (req, res) => {
    try {
      const slides = await storage.getActiveHeroSlides();
      res.json({ success: true, slides });
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      res.status(500).json({ message: "Error fetching hero slides" });
    }
  });
  app2.get("/api/cms/hero-slides", requireAuth, requireEditor, async (req, res) => {
    try {
      const slides = await storage.getHeroSlides();
      res.json({ success: true, slides });
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      res.status(500).json({ message: "Error fetching hero slides" });
    }
  });
  app2.get("/api/cms/hero-slides/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const slide = await storage.getHeroSlide(req.params.id);
      if (!slide) {
        return res.status(404).json({ message: "Slide not found" });
      }
      res.json({ success: true, slide });
    } catch (error) {
      console.error("Error fetching hero slide:", error);
      res.status(500).json({ message: "Error fetching hero slide" });
    }
  });
  app2.post("/api/cms/hero-slides", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertHeroSlideSchema.parse(req.body);
      const slide = await storage.createHeroSlide(data);
      res.status(201).json({ success: true, slide });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating hero slide:", error);
      res.status(500).json({ message: "Error creating hero slide" });
    }
  });
  app2.put("/api/cms/hero-slides/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertHeroSlideSchema.partial().parse(req.body);
      const slide = await storage.updateHeroSlide(req.params.id, data);
      if (!slide) {
        return res.status(404).json({ message: "Slide not found" });
      }
      res.json({ success: true, slide });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating hero slide:", error);
      res.status(500).json({ message: "Error updating hero slide" });
    }
  });
  app2.delete("/api/cms/hero-slides/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteHeroSlide(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Slide not found" });
      }
      res.json({ success: true, message: "Slide deleted" });
    } catch (error) {
      console.error("Error deleting hero slide:", error);
      res.status(500).json({ message: "Error deleting hero slide" });
    }
  });
  app2.get("/api/public/siwa-section", async (req, res) => {
    try {
      const section = await storage.getSiwaSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error("Error fetching siwa section:", error);
      res.status(500).json({ message: "Error fetching siwa section" });
    }
  });
  app2.get("/api/cms/siwa-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getSiwaSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error("Error fetching siwa section:", error);
      res.status(500).json({ message: "Error fetching siwa section" });
    }
  });
  app2.post("/api/cms/siwa-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertSiwaSectionSchema.parse(req.body);
      const section = await storage.upsertSiwaSection(data);
      res.json({ success: true, section });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating siwa section:", error);
      res.status(500).json({ message: "Error updating siwa section" });
    }
  });
  app2.get("/api/public/guest-experience-section", async (req, res) => {
    try {
      const section = await storage.getGuestExperienceSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error("Error fetching guest experience section:", error);
      res.status(500).json({ message: "Error fetching guest experience section" });
    }
  });
  app2.get("/api/cms/guest-experience-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getGuestExperienceSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error("Error fetching guest experience section:", error);
      res.status(500).json({ message: "Error fetching guest experience section" });
    }
  });
  app2.post("/api/cms/guest-experience-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertGuestExperienceSectionSchema.parse(req.body);
      const section = await storage.upsertGuestExperienceSection(data);
      res.json({ success: true, section });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating guest experience section:", error);
      res.status(500).json({ message: "Error updating guest experience section" });
    }
  });
  app2.get("/api/public/why-choose-section", async (req, res) => {
    try {
      const section = await storage.getWhyChooseSection();
      const cards = await storage.getWhyChooseCards();
      res.json({ success: true, section, cards });
    } catch (error) {
      console.error("Error fetching why choose section:", error);
      res.status(500).json({ message: "Error fetching why choose section" });
    }
  });
  app2.get("/api/cms/why-choose-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getWhyChooseSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error("Error fetching why choose section:", error);
      res.status(500).json({ message: "Error fetching why choose section" });
    }
  });
  app2.post("/api/cms/why-choose-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertWhyChooseSectionSchema.parse(req.body);
      const section = await storage.upsertWhyChooseSection(data);
      res.json({ success: true, section });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating why choose section:", error);
      res.status(500).json({ message: "Error updating why choose section" });
    }
  });
  app2.get("/api/cms/why-choose-cards", requireAuth, requireEditor, async (req, res) => {
    try {
      const cards = await storage.getWhyChooseCards();
      res.json({ success: true, cards });
    } catch (error) {
      console.error("Error fetching why choose cards:", error);
      res.status(500).json({ message: "Error fetching why choose cards" });
    }
  });
  app2.post("/api/cms/why-choose-cards", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertWhyChooseCardSchema.parse(req.body);
      const card = await storage.createWhyChooseCard(data);
      res.status(201).json({ success: true, card });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating why choose card:", error);
      res.status(500).json({ message: "Error creating why choose card" });
    }
  });
  app2.put("/api/cms/why-choose-cards/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertWhyChooseCardSchema.partial().parse(req.body);
      const card = await storage.updateWhyChooseCard(req.params.id, data);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json({ success: true, card });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating why choose card:", error);
      res.status(500).json({ message: "Error updating why choose card" });
    }
  });
  app2.delete("/api/cms/why-choose-cards/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteWhyChooseCard(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json({ success: true, message: "Card deleted" });
    } catch (error) {
      console.error("Error deleting why choose card:", error);
      res.status(500).json({ message: "Error deleting why choose card" });
    }
  });
  app2.get("/api/public/testimonials", async (req, res) => {
    try {
      const allTestimonials = await storage.getTestimonials();
      const activeTestimonials = allTestimonials.filter((t) => t.isActive);
      res.json({ testimonials: activeTestimonials });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });
  app2.get("/api/cms/testimonials", requireAuth, requireEditor, async (req, res) => {
    try {
      const allTestimonials = await storage.getTestimonials();
      res.json({ testimonials: allTestimonials });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });
  app2.post("/api/cms/testimonials", requireAuth, requireEditor, async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.json({ testimonial });
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Error creating testimonial" });
    }
  });
  app2.put("/api/cms/testimonials/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json({ testimonial });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Error updating testimonial" });
    }
  });
  app2.delete("/api/cms/testimonials/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteTestimonial(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json({ success: true, message: "Testimonial deleted" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Error deleting testimonial" });
    }
  });
  app2.get("/api/public/contact-cta-section", async (req, res) => {
    try {
      const section = await storage.getContactCtaSection();
      res.json({ section });
    } catch (error) {
      console.error("Error fetching contact CTA section:", error);
      res.status(500).json({ message: "Error fetching contact CTA section" });
    }
  });
  app2.get("/api/cms/contact-cta-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getContactCtaSection();
      res.json({ section });
    } catch (error) {
      console.error("Error fetching contact CTA section:", error);
      res.status(500).json({ message: "Error fetching contact CTA section" });
    }
  });
  app2.post("/api/cms/contact-cta-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.upsertContactCtaSection(req.body);
      res.json({ section });
    } catch (error) {
      console.error("Error updating contact CTA section:", error);
      res.status(500).json({ message: "Error updating contact CTA section" });
    }
  });
  app2.get("/api/public/stay-page", async (req, res) => {
    try {
      const hero = await storage.getStayPageHero();
      const accommodationTypes = await storage.getStayAccommodationTypes();
      const luxuryFeatures = await storage.getStayLuxuryFeatures();
      const nileSection = await storage.getStayNileSection();
      const cta = await storage.getStayCta();
      res.json({
        hero,
        accommodationTypes: accommodationTypes.filter((t) => t.isActive),
        luxuryFeatures: luxuryFeatures.filter((f) => f.isActive),
        nileSection,
        cta
      });
    } catch (error) {
      console.error("Error fetching stay page content:", error);
      res.status(500).json({ message: "Error fetching stay page content" });
    }
  });
  app2.get("/api/cms/stay-page/hero", requireAuth, requireEditor, async (req, res) => {
    try {
      const hero = await storage.getStayPageHero();
      res.json({ hero });
    } catch (error) {
      console.error("Error fetching stay page hero:", error);
      res.status(500).json({ message: "Error fetching stay page hero" });
    }
  });
  app2.post("/api/cms/stay-page/hero", requireAuth, requireEditor, async (req, res) => {
    try {
      const hero = await storage.upsertStayPageHero(req.body);
      res.json({ hero });
    } catch (error) {
      console.error("Error updating stay page hero:", error);
      res.status(500).json({ message: "Error updating stay page hero" });
    }
  });
  app2.get("/api/cms/stay-page/accommodation-types", requireAuth, requireEditor, async (req, res) => {
    try {
      const types = await storage.getStayAccommodationTypes();
      res.json({ types });
    } catch (error) {
      console.error("Error fetching accommodation types:", error);
      res.status(500).json({ message: "Error fetching accommodation types" });
    }
  });
  app2.post("/api/cms/stay-page/accommodation-types", requireAuth, requireEditor, async (req, res) => {
    try {
      const type = await storage.createStayAccommodationType(req.body);
      res.json({ type });
    } catch (error) {
      console.error("Error creating accommodation type:", error);
      res.status(500).json({ message: "Error creating accommodation type" });
    }
  });
  app2.put("/api/cms/stay-page/accommodation-types/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const type = await storage.updateStayAccommodationType(req.params.id, req.body);
      if (!type) {
        return res.status(404).json({ message: "Accommodation type not found" });
      }
      res.json({ type });
    } catch (error) {
      console.error("Error updating accommodation type:", error);
      res.status(500).json({ message: "Error updating accommodation type" });
    }
  });
  app2.delete("/api/cms/stay-page/accommodation-types/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteStayAccommodationType(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Accommodation type not found" });
      }
      res.json({ success: true, message: "Accommodation type deleted" });
    } catch (error) {
      console.error("Error deleting accommodation type:", error);
      res.status(500).json({ message: "Error deleting accommodation type" });
    }
  });
  app2.get("/api/cms/stay-page/luxury-features", requireAuth, requireEditor, async (req, res) => {
    try {
      const features = await storage.getStayLuxuryFeatures();
      res.json({ features });
    } catch (error) {
      console.error("Error fetching luxury features:", error);
      res.status(500).json({ message: "Error fetching luxury features" });
    }
  });
  app2.post("/api/cms/stay-page/luxury-features", requireAuth, requireEditor, async (req, res) => {
    try {
      const feature = await storage.createStayLuxuryFeature(req.body);
      res.json({ feature });
    } catch (error) {
      console.error("Error creating luxury feature:", error);
      res.status(500).json({ message: "Error creating luxury feature" });
    }
  });
  app2.put("/api/cms/stay-page/luxury-features/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const feature = await storage.updateStayLuxuryFeature(req.params.id, req.body);
      if (!feature) {
        return res.status(404).json({ message: "Luxury feature not found" });
      }
      res.json({ feature });
    } catch (error) {
      console.error("Error updating luxury feature:", error);
      res.status(500).json({ message: "Error updating luxury feature" });
    }
  });
  app2.delete("/api/cms/stay-page/luxury-features/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteStayLuxuryFeature(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Luxury feature not found" });
      }
      res.json({ success: true, message: "Luxury feature deleted" });
    } catch (error) {
      console.error("Error deleting luxury feature:", error);
      res.status(500).json({ message: "Error deleting luxury feature" });
    }
  });
  app2.get("/api/cms/stay-page/nile-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getStayNileSection();
      res.json({ section });
    } catch (error) {
      console.error("Error fetching nile section:", error);
      res.status(500).json({ message: "Error fetching nile section" });
    }
  });
  app2.post("/api/cms/stay-page/nile-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.upsertStayNileSection(req.body);
      res.json({ section });
    } catch (error) {
      console.error("Error updating nile section:", error);
      res.status(500).json({ message: "Error updating nile section" });
    }
  });
  app2.get("/api/cms/stay-page/cta", requireAuth, requireEditor, async (req, res) => {
    try {
      const cta = await storage.getStayCta();
      res.json({ cta });
    } catch (error) {
      console.error("Error fetching CTA:", error);
      res.status(500).json({ message: "Error fetching CTA" });
    }
  });
  app2.post("/api/cms/stay-page/cta", requireAuth, requireEditor, async (req, res) => {
    try {
      const cta = await storage.upsertStayCta(req.body);
      res.json({ cta });
    } catch (error) {
      console.error("Error updating CTA:", error);
      res.status(500).json({ message: "Error updating CTA" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (req.method !== "GET") return next();
    if (url.startsWith("/api")) return next();
    if (url.includes(".") && !url.endsWith("/")) return next();
    const accept = req.headers.accept;
    if (accept && !accept.includes("text/html") && accept !== "*/*") return next();
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  app2.use("/api/*", (_req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("/api/*", (_req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
