import {
  type User, type InsertUser, type Inquiry, type InsertInquiry,
  type Page, type InsertPage, type Section, type InsertSection,
  type Post, type InsertPost, type Media, type InsertMedia,
  type Hotel, type InsertHotel, type Tour, type InsertTour,
  type Package, type InsertPackage, type Destination, type InsertDestination,
  type Category, type InsertCategory, type Setting, type InsertSetting,
  type NavItem, type InsertNavItem, type SiteConfig, type InsertSiteConfig,
  type FooterLink, type InsertFooterLink, type SocialLink, type InsertSocialLink,
  type Faq, type InsertFaq,
  type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type TourBooking, type InsertTourBooking,
  type HeroSlide, type InsertHeroSlide,
  type SiwaSection, type InsertSiwaSection,
  type GuestExperienceSection, type InsertGuestExperienceSection,
  type WhyChooseSection, type InsertWhyChooseSection,
  type WhyChooseCard, type InsertWhyChooseCard,
  type Testimonial, type InsertTestimonial,
  type ContactCtaSection, type InsertContactCtaSection,
  type StayPageHero, type InsertStayPageHero,
  type StayAccommodationType, type InsertStayAccommodationType,
  type StayLuxuryFeature, type InsertStayLuxuryFeature,
  type StayNileSection, type InsertStayNileSection,
  type StayCta, type InsertStayCta,
  users, inquiries, pages, sections, posts, media as mediaTable, hotels, tours, packages, destinations, categories, settings,
  navItems, siteConfig, footerLinks, socialLinks, faqs, newsletterSubscribers, tourBookings, heroSlides, siwaSection,
  guestExperienceSection, whyChooseSection, whyChooseCards, testimonials, contactCtaSection,
  stayPageHero, stayAccommodationTypes, stayLuxuryFeatures, stayNileSection, stayCta,
  brochureDownloads
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "./db";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;

  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  getInquiry(id: string): Promise<Inquiry | undefined>;
  deleteInquiry(id: string): Promise<boolean>;

  // Page methods
  createPage(page: InsertPage): Promise<Page>;
  getPages(): Promise<Page[]>;
  getPage(id: string): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<boolean>;

  // Section methods
  createSection(section: InsertSection): Promise<Section>;
  getSectionsByPageId(pageId: string): Promise<Section[]>;
  updateSection(id: string, section: Partial<InsertSection>): Promise<Section | undefined>;
  deleteSection(id: string): Promise<boolean>;

  // Post methods
  createPost(post: InsertPost): Promise<Post>;
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;

  // Media methods
  createMedia(media: InsertMedia): Promise<Media>;
  getMedia(): Promise<Media[]>;
  getMediaById(id: string): Promise<Media | undefined>;
  deleteMedia(id: string): Promise<boolean>;

  // Hotel methods
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  getHotels(): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel | undefined>;
  getHotelBySlug(slug: string): Promise<Hotel | undefined>;
  updateHotel(id: string, hotel: Partial<InsertHotel>): Promise<Hotel | undefined>;
  deleteHotel(id: string): Promise<boolean>;

  // Destination methods  
  createDestination(destination: InsertDestination): Promise<Destination>;
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  getDestinationBySlug(slug: string): Promise<Destination | undefined>;
  updateDestination(id: string, destination: Partial<InsertDestination>): Promise<Destination | undefined>;
  deleteDestination(id: string): Promise<boolean>;

  // Tour methods
  createTour(tour: InsertTour): Promise<Tour>;
  getTours(): Promise<Tour[]>;
  getTour(id: string): Promise<Tour | undefined>;
  getTourBySlug(slug: string): Promise<Tour | undefined>;
  updateTour(id: string, tour: Partial<InsertTour>): Promise<Tour | undefined>;
  deleteTour(id: string): Promise<boolean>;

  // Package methods
  createPackage(pkg: InsertPackage): Promise<Package>;
  getPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  getPackageBySlug(slug: string): Promise<Package | undefined>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;

  // Category methods
  createCategory(category: InsertCategory): Promise<Category>;
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Setting methods
  getSetting(key: string): Promise<Setting | undefined>;
  getAllSettings(): Promise<Setting[]>;
  upsertSetting(key: string, value: string, updatedBy: string): Promise<Setting | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>) {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const result = await db.insert(inquiries).values(insertInquiry).returning();
    return result[0];
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
    return result[0] || undefined;
  }

  // Page methods
  async createPage(page: InsertPage): Promise<Page> {
    const result = await db.insert(pages).values(page).returning();
    return result[0];
  }

  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(desc(pages.createdAt));
  }

  async getPage(id: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    return result[0] || undefined;
  }

  async updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined> {
    const result = await db.update(pages).set({ ...page, updatedAt: new Date() }).where(eq(pages.id, id)).returning();
    return result[0] || undefined;
  }

  async deletePage(id: string): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id)).returning();
    return result.length > 0;
  }

  // Section methods
  async createSection(section: InsertSection): Promise<Section> {
    const result = await db.insert(sections).values(section).returning();
    return result[0];
  }

  async getSectionsByPageId(pageId: string): Promise<Section[]> {
    return await db.select().from(sections).where(eq(sections.pageId, pageId)).orderBy(sections.orderIndex);
  }

  async updateSection(id: string, section: Partial<InsertSection>): Promise<Section | undefined> {
    const result = await db.update(sections).set(section).where(eq(sections.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteSection(id: string): Promise<boolean> {
    const result = await db.delete(sections).where(eq(sections.id, id)).returning();
    return result.length > 0;
  }

  // Post methods
  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async getPosts(): Promise<Post[]> {
    const result = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return result || [];
  }

  async getPost(id: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    return result[0] || undefined;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined> {
    const result = await db.update(posts).set({ ...post, updatedAt: new Date() }).where(eq(posts.id, id)).returning();
    return result[0] || undefined;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning();
    return result.length > 0;
  }

  // Media methods
  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const result = await db.insert(mediaTable).values(mediaData).returning();
    return result[0];
  }

  async getMedia(): Promise<Media[]> {
    return await db.select().from(mediaTable).orderBy(desc(mediaTable.createdAt));
  }

  async getMediaById(id: string): Promise<Media | undefined> {
    const result = await db.select().from(mediaTable).where(eq(mediaTable.id, id)).limit(1);
    return result[0] || undefined;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await db.delete(mediaTable).where(eq(mediaTable.id, id)).returning();
    return result.length > 0;
  }

  // Delete inquiry
  async deleteInquiry(id: string): Promise<boolean> {
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

  async getHotel(id: string): Promise<Hotel | undefined> {
    try {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
      return hotel || undefined;
    } catch (error) {
      console.error("Error fetching hotel:", error);
      return undefined;
    }
  }

  async getHotelBySlug(slug: string): Promise<Hotel | undefined> {
    try {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.slug, slug));
      return hotel || undefined;
    } catch (error) {
      console.error("Error fetching hotel by slug:", error);
      return undefined;
    }
  }

  async createHotel(data: InsertHotel) {
    try {
      const [hotel] = await db.insert(hotels).values(data).returning();
      return hotel;
    } catch (error) {
      console.error("Error creating hotel:", error);
      throw error;
    }
  }

  async updateHotel(id: string, data: Partial<InsertHotel>): Promise<Hotel | undefined> {
    try {
      const [hotel] = await db
        .update(hotels)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(hotels.id, id))
        .returning();
      return hotel || undefined;
    } catch (error) {
      console.error("Error updating hotel:", error);
      throw error;
    }
  }

  async deleteHotel(id: string): Promise<boolean> {
    try {
      const result = await db.delete(hotels).where(eq(hotels.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting hotel:", error);
      return false;
    }
  }

  // Destination methods
  async createDestination(data: InsertDestination): Promise<Destination> {
    try {
      const [destination] = await db.insert(destinations).values(data).returning();
      return destination;
    } catch (error) {
      console.error("Error creating destination:", error);
      throw error;
    }
  }

  async getDestinations(): Promise<Destination[]> {
    try {
      return await db.select().from(destinations).orderBy(desc(destinations.createdAt));
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    try {
      const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
      return destination || undefined;
    } catch (error) {
      console.error("Error fetching destination:", error);
      return undefined;
    }
  }

  async getDestinationBySlug(slug: string): Promise<Destination | undefined> {
    try {
      const [destination] = await db.select().from(destinations).where(eq(destinations.slug, slug));
      return destination || undefined;
    } catch (error) {
      console.error("Error fetching destination by slug:", error);
      return undefined;
    }
  }

  async updateDestination(id: string, data: Partial<InsertDestination>): Promise<Destination | undefined> {
    try {
      const [destination] = await db
        .update(destinations)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(destinations.id, id))
        .returning();
      return destination || undefined;
    } catch (error) {
      console.error("Error updating destination:", error);
      throw error;
    }
  }

  async deleteDestination(id: string): Promise<boolean> {
    try {
      const result = await db.delete(destinations).where(eq(destinations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting destination:", error);
      return false;
    }
  }

  // Tour methods
  async createTour(data: InsertTour): Promise<Tour> {
    try {
      const [tour] = await db.insert(tours).values(data).returning();
      return tour;
    } catch (error) {
      console.error("Error creating tour:", error);
      throw error;
    }
  }

  async getTours(): Promise<Tour[]> {
    try {
      return await db.select().from(tours).orderBy(desc(tours.createdAt));
    } catch (error) {
      console.error("Error fetching tours:", error);
      return [];
    }
  }

  async getTour(id: string): Promise<Tour | undefined> {
    try {
      const [tour] = await db.select().from(tours).where(eq(tours.id, id));
      return tour || undefined;
    } catch (error) {
      console.error("Error fetching tour:", error);
      return undefined;
    }
  }

  async getTourBySlug(slug: string): Promise<Tour | undefined> {
    try {
      const [tour] = await db.select().from(tours).where(eq(tours.slug, slug));
      return tour || undefined;
    } catch (error) {
      console.error("Error fetching tour by slug:", error);
      return undefined;
    }
  }

  async updateTour(id: string, data: Partial<InsertTour>): Promise<Tour | undefined> {
    try {
      const [tour] = await db
        .update(tours)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(tours.id, id))
        .returning();
      return tour || undefined;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    }
  }

  async deleteTour(id: string): Promise<boolean> {
    try {
      const result = await db.delete(tours).where(eq(tours.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting tour:", error);
      return false;
    }
  }

  // Package methods
  async createPackage(data: InsertPackage): Promise<Package> {
    try {
      const [pkg] = await db.insert(packages).values(data).returning();
      return pkg;
    } catch (error) {
      console.error("Error creating package:", error);
      throw error;
    }
  }

  async getPackages(): Promise<Package[]> {
    try {
      return await db.select().from(packages).orderBy(desc(packages.createdAt));
    } catch (error) {
      console.error("Error fetching packages:", error);
      return [];
    }
  }

  async getPackage(id: string): Promise<Package | undefined> {
    try {
      const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
      return pkg || undefined;
    } catch (error) {
      console.error("Error fetching package:", error);
      return undefined;
    }
  }

  async getPackageBySlug(slug: string): Promise<Package | undefined> {
    try {
      const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));
      return pkg || undefined;
    } catch (error) {
      console.error("Error fetching package by slug:", error);
      return undefined;
    }
  }

  async updatePackage(id: string, data: Partial<InsertPackage>): Promise<Package | undefined> {
    try {
      const [pkg] = await db
        .update(packages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(packages.id, id))
        .returning();
      return pkg || undefined;
    } catch (error) {
      console.error("Error updating package:", error);
      throw error;
    }
  }

  async deletePackage(id: string): Promise<boolean> {
    try {
      const result = await db.delete(packages).where(eq(packages.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting package:", error);
      return false;
    }
  }

  // Category methods
  async createCategory(data: InsertCategory): Promise<Category> {
    try {
      const [category] = await db.insert(categories).values(data).returning();
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await db.select().from(categories).orderBy(categories.sortOrder, desc(categories.createdAt));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async getCategory(id: string): Promise<Category | undefined> {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.id, id));
      return category || undefined;
    } catch (error) {
      console.error("Error fetching category:", error);
      return undefined;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
      return category || undefined;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      return undefined;
    }
  }

  async updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const [category] = await db
        .update(categories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning();
      return category || undefined;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await db.delete(categories).where(eq(categories.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }

  async getAllSettings() {
    return await db.select().from(settings);
  }

  async upsertSetting(key: string, value: string, updatedBy: string) {
    const existing = await this.getSetting(key);
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value, updatedBy, updatedAt: new Date() })
        .where(eq(settings.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(settings)
        .values({ key, value, updatedBy })
        .returning();
      return created;
    }
  }

  // Navigation Items methods
  async getNavItems(): Promise<NavItem[]> {
    return await db.select().from(navItems).orderBy(navItems.sortOrder);
  }

  async getNavItem(id: string): Promise<NavItem | undefined> {
    const [item] = await db.select().from(navItems).where(eq(navItems.id, id));
    return item;
  }

  async createNavItem(data: InsertNavItem): Promise<NavItem> {
    const [item] = await db.insert(navItems).values(data).returning();
    return item;
  }

  async updateNavItem(id: string, data: Partial<InsertNavItem>): Promise<NavItem | undefined> {
    const [item] = await db
      .update(navItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(navItems.id, id))
      .returning();
    return item;
  }

  async deleteNavItem(id: string): Promise<boolean> {
    const result = await db.delete(navItems).where(eq(navItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Site Config methods
  async getSiteConfig(key: string): Promise<SiteConfig | undefined> {
    const [config] = await db.select().from(siteConfig).where(eq(siteConfig.key, key));
    return config;
  }

  async getAllSiteConfig(): Promise<SiteConfig[]> {
    return await db.select().from(siteConfig);
  }

  async upsertSiteConfig(key: string, value: string, type: string = "text", updatedBy?: string): Promise<SiteConfig> {
    const existing = await this.getSiteConfig(key);
    if (existing) {
      const [updated] = await db
        .update(siteConfig)
        .set({ value, type, updatedBy, updatedAt: new Date() })
        .where(eq(siteConfig.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteConfig)
        .values({ key, value, type, updatedBy })
        .returning();
      return created;
    }
  }

  // Footer Links methods
  async getFooterLinks(): Promise<FooterLink[]> {
    return await db.select().from(footerLinks).orderBy(footerLinks.section, footerLinks.sortOrder);
  }

  async getFooterLink(id: string): Promise<FooterLink | undefined> {
    const [link] = await db.select().from(footerLinks).where(eq(footerLinks.id, id));
    return link;
  }

  async createFooterLink(data: InsertFooterLink): Promise<FooterLink> {
    const [link] = await db.insert(footerLinks).values(data).returning();
    return link;
  }

  async updateFooterLink(id: string, data: Partial<InsertFooterLink>): Promise<FooterLink | undefined> {
    const [link] = await db
      .update(footerLinks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(footerLinks.id, id))
      .returning();
    return link;
  }

  async deleteFooterLink(id: string): Promise<boolean> {
    const result = await db.delete(footerLinks).where(eq(footerLinks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Social Links methods
  async getSocialLinks(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks).orderBy(socialLinks.sortOrder);
  }

  async getSocialLink(id: string): Promise<SocialLink | undefined> {
    const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return link;
  }

  async createSocialLink(data: InsertSocialLink): Promise<SocialLink> {
    const [link] = await db.insert(socialLinks).values(data).returning();
    return link;
  }

  async updateSocialLink(id: string, data: Partial<InsertSocialLink>): Promise<SocialLink | undefined> {
    const [link] = await db
      .update(socialLinks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(socialLinks.id, id))
      .returning();
    return link;
  }

  async deleteSocialLink(id: string): Promise<boolean> {
    const result = await db.delete(socialLinks).where(eq(socialLinks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // FAQ methods
  async getFaqs(): Promise<Faq[]> {
    return await db.select().from(faqs).orderBy(faqs.sortOrder);
  }

  async getVisibleFaqs(): Promise<Faq[]> {
    return await db.select().from(faqs).where(eq(faqs.isVisible, true)).orderBy(faqs.sortOrder);
  }

  async getFaq(id: string): Promise<Faq | undefined> {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq;
  }

  async createFaq(data: InsertFaq): Promise<Faq> {
    const [faq] = await db.insert(faqs).values(data).returning();
    return faq;
  }

  async updateFaq(id: string, data: Partial<InsertFaq>): Promise<Faq | undefined> {
    const [faq] = await db
      .update(faqs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(faqs.id, id))
      .returning();
    return faq;
  }

  async deleteFaq(id: string): Promise<boolean> {
    const result = await db.delete(faqs).where(eq(faqs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Newsletter Subscriber methods
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  }

  async getNewsletterSubscriber(id: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return subscriber;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return subscriber;
  }

  async createNewsletterSubscriber(data: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [subscriber] = await db.insert(newsletterSubscribers).values(data).returning();
    return subscriber;
  }

  async updateNewsletterSubscriber(id: string, data: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db
      .update(newsletterSubscribers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(newsletterSubscribers.id, id))
      .returning();
    return subscriber;
  }

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    const result = await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Tour Booking methods
  async getTourBookings(): Promise<TourBooking[]> {
    return await db.select().from(tourBookings).orderBy(desc(tourBookings.createdAt));
  }

  async getTourBooking(id: string): Promise<TourBooking | undefined> {
    const [booking] = await db.select().from(tourBookings).where(eq(tourBookings.id, id));
    return booking;
  }

  async createTourBooking(data: InsertTourBooking): Promise<TourBooking> {
    const [booking] = await db.insert(tourBookings).values(data).returning();
    return booking;
  }

  async updateTourBooking(id: string, data: Partial<InsertTourBooking>): Promise<TourBooking | undefined> {
    const [booking] = await db
      .update(tourBookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tourBookings.id, id))
      .returning();
    return booking;
  }

  async deleteTourBooking(id: string): Promise<boolean> {
    const result = await db.delete(tourBookings).where(eq(tourBookings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Brochure Download methods
  async getBrochureDownloads(): Promise<any[]> {
    return await db.select().from(brochureDownloads).orderBy(desc(brochureDownloads.downloadedAt));
  }

  async createBrochureDownload(data: { email: string; tourId?: string; tourTitle?: string; tourSlug?: string }): Promise<any> {
    const [download] = await db.insert(brochureDownloads).values(data).returning();
    return download;
  }

  async deleteBrochureDownload(id: string): Promise<boolean> {
    const result = await db.delete(brochureDownloads).where(eq(brochureDownloads.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Hero Slides methods
  async getHeroSlides(): Promise<HeroSlide[]> {
    return await db.select().from(heroSlides).orderBy(heroSlides.sortOrder);
  }

  async getActiveHeroSlides(): Promise<HeroSlide[]> {
    return await db.select().from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(heroSlides.sortOrder);
  }

  async getHeroSlide(id: string): Promise<HeroSlide | undefined> {
    const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
    return slide;
  }

  async createHeroSlide(data: InsertHeroSlide): Promise<HeroSlide> {
    const [slide] = await db.insert(heroSlides).values(data).returning();
    return slide;
  }

  async updateHeroSlide(id: string, data: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined> {
    const [slide] = await db
      .update(heroSlides)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(heroSlides.id, id))
      .returning();
    return slide;
  }

  async deleteHeroSlide(id: string): Promise<boolean> {
    const result = await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Siwa Section methods
  async getSiwaSection(): Promise<SiwaSection | undefined> {
    const [section] = await db.select().from(siwaSection).limit(1);
    return section;
  }

  async upsertSiwaSection(data: InsertSiwaSection): Promise<SiwaSection> {
    const existing = await this.getSiwaSection();
    if (existing) {
      const [updated] = await db
        .update(siwaSection)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(siwaSection.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siwaSection).values(data).returning();
      return created;
    }
  }

  // Guest Experience Section methods
  async getGuestExperienceSection(): Promise<GuestExperienceSection | undefined> {
    const [section] = await db.select().from(guestExperienceSection).limit(1);
    return section;
  }

  async upsertGuestExperienceSection(data: InsertGuestExperienceSection): Promise<GuestExperienceSection> {
    const existing = await this.getGuestExperienceSection();
    if (existing) {
      const [updated] = await db
        .update(guestExperienceSection)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(guestExperienceSection.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(guestExperienceSection).values(data).returning();
      return created;
    }
  }

  // Why Choose Section methods
  async getWhyChooseSection(): Promise<WhyChooseSection | undefined> {
    const [section] = await db.select().from(whyChooseSection).limit(1);
    return section;
  }

  async upsertWhyChooseSection(data: InsertWhyChooseSection): Promise<WhyChooseSection> {
    const existing = await this.getWhyChooseSection();
    if (existing) {
      const [updated] = await db
        .update(whyChooseSection)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(whyChooseSection.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(whyChooseSection).values(data).returning();
      return created;
    }
  }

  // Why Choose Cards methods
  async getWhyChooseCards(): Promise<WhyChooseCard[]> {
    return await db.select().from(whyChooseCards).orderBy(whyChooseCards.sortOrder);
  }

  async getWhyChooseCard(id: string): Promise<WhyChooseCard | undefined> {
    const [card] = await db.select().from(whyChooseCards).where(eq(whyChooseCards.id, id));
    return card;
  }

  async createWhyChooseCard(data: InsertWhyChooseCard): Promise<WhyChooseCard> {
    const [card] = await db.insert(whyChooseCards).values(data).returning();
    return card;
  }

  async updateWhyChooseCard(id: string, data: Partial<InsertWhyChooseCard>): Promise<WhyChooseCard | undefined> {
    const [card] = await db
      .update(whyChooseCards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(whyChooseCards.id, id))
      .returning();
    return card;
  }

  async deleteWhyChooseCard(id: string): Promise<boolean> {
    const result = await db.delete(whyChooseCards).where(eq(whyChooseCards.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Testimonials methods
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.sortOrder);
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(data: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(data).returning();
    return testimonial;
  }

  async updateTestimonial(id: string, data: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contact CTA Section methods
  async getContactCtaSection(): Promise<ContactCtaSection | undefined> {
    const [section] = await db.select().from(contactCtaSection).limit(1);
    return section;
  }

  async upsertContactCtaSection(data: InsertContactCtaSection): Promise<ContactCtaSection> {
    const existing = await this.getContactCtaSection();
    if (existing) {
      const [updated] = await db
        .update(contactCtaSection)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(contactCtaSection.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(contactCtaSection).values(data).returning();
      return created;
    }
  }

  // Stay Page Hero methods
  async getStayPageHero(): Promise<StayPageHero | undefined> {
    const [hero] = await db.select().from(stayPageHero).limit(1);
    return hero;
  }

  async upsertStayPageHero(data: InsertStayPageHero): Promise<StayPageHero> {
    const existing = await this.getStayPageHero();
    if (existing) {
      const [updated] = await db
        .update(stayPageHero)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(stayPageHero.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(stayPageHero).values(data).returning();
      return created;
    }
  }

  // Stay Accommodation Types methods
  async getStayAccommodationTypes(): Promise<StayAccommodationType[]> {
    return await db.select().from(stayAccommodationTypes).orderBy(stayAccommodationTypes.sortOrder);
  }

  async getStayAccommodationType(id: string): Promise<StayAccommodationType | undefined> {
    const [type] = await db.select().from(stayAccommodationTypes).where(eq(stayAccommodationTypes.id, id));
    return type;
  }

  async createStayAccommodationType(data: InsertStayAccommodationType): Promise<StayAccommodationType> {
    const [type] = await db.insert(stayAccommodationTypes).values(data).returning();
    return type;
  }

  async updateStayAccommodationType(id: string, data: Partial<InsertStayAccommodationType>): Promise<StayAccommodationType | undefined> {
    const [type] = await db
      .update(stayAccommodationTypes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stayAccommodationTypes.id, id))
      .returning();
    return type;
  }

  async deleteStayAccommodationType(id: string): Promise<boolean> {
    const result = await db.delete(stayAccommodationTypes).where(eq(stayAccommodationTypes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Stay Luxury Features methods
  async getStayLuxuryFeatures(): Promise<StayLuxuryFeature[]> {
    return await db.select().from(stayLuxuryFeatures).orderBy(stayLuxuryFeatures.sortOrder);
  }

  async getStayLuxuryFeature(id: string): Promise<StayLuxuryFeature | undefined> {
    const [feature] = await db.select().from(stayLuxuryFeatures).where(eq(stayLuxuryFeatures.id, id));
    return feature;
  }

  async createStayLuxuryFeature(data: InsertStayLuxuryFeature): Promise<StayLuxuryFeature> {
    const [feature] = await db.insert(stayLuxuryFeatures).values(data).returning();
    return feature;
  }

  async updateStayLuxuryFeature(id: string, data: Partial<InsertStayLuxuryFeature>): Promise<StayLuxuryFeature | undefined> {
    const [feature] = await db
      .update(stayLuxuryFeatures)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stayLuxuryFeatures.id, id))
      .returning();
    return feature;
  }

  async deleteStayLuxuryFeature(id: string): Promise<boolean> {
    const result = await db.delete(stayLuxuryFeatures).where(eq(stayLuxuryFeatures.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Stay Nile Section methods
  async getStayNileSection(): Promise<StayNileSection | undefined> {
    const [section] = await db.select().from(stayNileSection).limit(1);
    return section;
  }

  async upsertStayNileSection(data: InsertStayNileSection): Promise<StayNileSection> {
    const existing = await this.getStayNileSection();
    if (existing) {
      const [updated] = await db
        .update(stayNileSection)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(stayNileSection.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(stayNileSection).values(data).returning();
      return created;
    }
  }

  // Stay CTA methods
  async getStayCta(): Promise<StayCta | undefined> {
    const [cta] = await db.select().from(stayCta).limit(1);
    return cta;
  }

  async upsertStayCta(data: InsertStayCta): Promise<StayCta> {
    const existing = await this.getStayCta();
    if (existing) {
      const [updated] = await db
        .update(stayCta)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(stayCta.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(stayCta).values(data).returning();
      return created;
    }
  }
};

// Memory Storage Implementation for Development
export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private inquiries = new Map<string, Inquiry>();
  private pages = new Map<string, Page>();
  private sections = new Map<string, Section>();
  private posts = new Map<string, Post>();
  private mediaFiles = new Map<string, Media>();
  private hotels = new Map<string, Hotel>();
  private settings = new Map<string, Setting>();

  constructor() {
    // Pre-populate with default admin user
    this.seedDefaultUser();
    // Pre-populate with sample hotels
    this.seedDefaultHotels();
    // Pre-populate with sample settings
    this.seedDefaultSettings();
  }

  private async seedDefaultUser() {
    const defaultAdmin: User = {
      id: randomUUID(),
      username: "admin",
      email: "admin@luxortravel.com",
      password: "$2b$10$jya3D5zQkarnCNp7ex9E1eQFFdHa5pQgvriM2BK5yiPM/BNO77Hf.", // bcrypt hash of "admin123"
      role: "admin",
      createdAt: new Date()
    };

    this.users.set(defaultAdmin.id, defaultAdmin);
  }

  private async seedDefaultHotels() {
    // Seed with a few sample hotels from the original Stay page
    const sampleHotels: Hotel[] = [
      {
        id: randomUUID(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null
      },
      {
        id: randomUUID(),
        name: "Adrère Amellal",
        location: "Siwa Oasis",
        region: "Siwa",
        type: "Eco-Lodge",
        rating: 4,
        priceTier: "$$$",
        amenities: ["Eco-Friendly", "Desert Views", "Natural Architecture", "Wellness"],
        image: "/api/assets/siwa_1757531163689.jpg",
        description: "Eco-luxury desert lodge built entirely from natural materials. Experience the serene beauty of the Sahara in sustainable comfort.",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null
      },
      {
        id: randomUUID(),
        name: "Old Winter Palace Hotel",
        location: "Aswan",
        region: "Aswan",
        type: "Heritage",
        rating: 5,
        priceTier: "$$$$",
        amenities: ["Nile Views", "Historic Architecture", "Royal Gardens", "Fine Dining"],
        image: "/api/assets/suite-nile_1757457083796.jpg",
        description: "A legendary hotel on the banks of the Nile in Aswan, offering timeless elegance and unparalleled views.",
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null
      }
    ];

    sampleHotels.forEach(hotel => {
      this.hotels.set(hotel.id, hotel);
    });

    // Add some sample inquiries
    const sampleInquiries: Inquiry[] = [
      {
        id: randomUUID(),
        fullName: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1-555-0123",
        destination: "Luxor & Aswan",
        preferredDates: "March 15-25, 2025",
        specialRequests: "Anniversary celebration, prefer Nile view rooms",
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: randomUUID(),
        fullName: "David Chen",
        email: "david.chen@email.com",
        phone: "+1-555-0456",
        destination: "Cairo & Giza",
        preferredDates: "April 10-20, 2025", 
        specialRequests: "Photography tour, need early pyramid access",
        createdAt: new Date(Date.now() - 172800000) // 2 days ago
      },
      {
        id: randomUUID(),
        fullName: "Emma Rodriguez",
        email: "emma.rodriguez@email.com",
        phone: "+1-555-0789",
        destination: "Siwa Oasis",
        preferredDates: "May 5-12, 2025",
        specialRequests: "Wellness retreat focus, dietary restrictions",
        createdAt: new Date(Date.now() - 259200000) // 3 days ago
      }
    ];

    sampleInquiries.forEach(inquiry => {
      this.inquiries.set(inquiry.id, inquiry);
    });
  }

  private async seedDefaultSettings() {
    const sampleSettings: Setting[] = [
      {
        id: randomUUID(),
        key: "contact_email",
        value: "info@luxortravel.com",
        updatedBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        key: "inquiry_notification_email",
        value: "support@luxortravel.com",
        updatedBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        key: "site_name",
        value: "Luxury Egypt Tours",
        updatedBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        key: "site_tagline",
        value: "Experience the magic of Egypt.",
        updatedBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleSettings.forEach(setting => {
      this.settings.set(setting.id, setting);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser: User = {
      ...existingUser,
      ...data,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: randomUUID(),
      role: insertUser.role || "editor",
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const inquiry: Inquiry = {
      id: randomUUID(),
      fullName: insertInquiry.fullName,
      email: insertInquiry.email,
      phone: insertInquiry.phone || null,
      destination: insertInquiry.destination || null,
      preferredDates: insertInquiry.preferredDates || null,
      specialRequests: insertInquiry.specialRequests || null,
      createdAt: new Date()
    };
    this.inquiries.set(inquiry.id, inquiry);
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  // Page methods
  async createPage(insertPage: InsertPage): Promise<Page> {
    const page: Page = {
      id: randomUUID(),
      slug: insertPage.slug,
      titleEn: insertPage.titleEn,
      titleEs: insertPage.titleEs || null,
      titleFr: insertPage.titleFr || null,
      titleJp: insertPage.titleJp || null,
      metaTitle: insertPage.metaTitle || null,
      metaDescription: insertPage.metaDescription || null,
      status: insertPage.status || "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: insertPage.createdBy || null
    };
    this.pages.set(page.id, page);
    return page;
  }

  async getPages(): Promise<Page[]> {
    return Array.from(this.pages.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPage(id: string): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    for (const page of Array.from(this.pages.values())) {
      if (page.slug === slug) {
        return page;
      }
    }
    return undefined;
  }

  async updatePage(id: string, updateData: Partial<InsertPage>): Promise<Page | undefined> {
    const existingPage = this.pages.get(id);
    if (!existingPage) return undefined;

    const updatedPage: Page = {
      ...existingPage,
      ...updateData,
      updatedAt: new Date()
    };
    this.pages.set(id, updatedPage);
    return updatedPage;
  }

  async deletePage(id: string): Promise<boolean> {
    return this.pages.delete(id);
  }

  // Section methods
  async createSection(insertSection: InsertSection): Promise<Section> {
    const section: Section = {
      id: randomUUID(),
      pageId: insertSection.pageId,
      type: insertSection.type,
      orderIndex: insertSection.orderIndex || 0,
      contentJson: insertSection.contentJson,
      createdAt: new Date()
    };
    this.sections.set(section.id, section);
    return section;
  }

  async getSectionsByPageId(pageId: string): Promise<Section[]> {
    return Array.from(this.sections.values())
      .filter(section => section.pageId === pageId)
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }

  async updateSection(id: string, updateData: Partial<InsertSection>): Promise<Section | undefined> {
    const existingSection = this.sections.get(id);
    if (!existingSection) return undefined;

    const updatedSection: Section = {
      ...existingSection,
      ...updateData
    };
    this.sections.set(id, updatedSection);
    return updatedSection;
  }

  async deleteSection(id: string): Promise<boolean> {
    return this.sections.delete(id);
  }

  // Post methods
  async createPost(insertPost: InsertPost): Promise<Post> {
    const post: Post = {
      id: randomUUID(),
      slug: insertPost.slug,
      titleEn: insertPost.titleEn,
      titleEs: insertPost.titleEs || null,
      titleFr: insertPost.titleFr || null,
      titleJp: insertPost.titleJp || null,
      bodyEn: insertPost.bodyEn || null,
      bodyEs: insertPost.bodyEs || null,
      bodyFr: insertPost.bodyFr || null,
      bodyJp: insertPost.bodyJp || null,
      featuredImage: insertPost.featuredImage || null,
      excerpt: insertPost.excerpt || null,
      status: insertPost.status || "draft",
      publishedAt: insertPost.publishedAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: insertPost.createdBy || null
    };
    this.posts.set(post.id, post);
    return post;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    for (const post of Array.from(this.posts.values())) {
      if (post.slug === slug) {
        return post;
      }
    }
    return undefined;
  }

  async updatePost(id: string, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) return undefined;

    const updatedPost: Post = {
      ...existingPost,
      ...updateData,
      updatedAt: new Date()
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Media methods
  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const media: Media = {
      id: randomUUID(),
      filename: insertMedia.filename,
      originalName: insertMedia.originalName,
      mimeType: insertMedia.mimeType,
      size: insertMedia.size,
      url: insertMedia.url,
      altEn: insertMedia.altEn || null,
      altEs: insertMedia.altEs || null,
      altFr: insertMedia.altFr || null,
      altJp: insertMedia.altJp || null,
      caption: insertMedia.caption || null,
      createdAt: new Date(),
      uploadedBy: insertMedia.uploadedBy || null
    };
    this.mediaFiles.set(media.id, media);
    return media;
  }

  async getMedia(): Promise<Media[]> {
    return Array.from(this.mediaFiles.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getMediaById(id: string): Promise<Media | undefined> {
    return this.mediaFiles.get(id);
  }

  async deleteMedia(id: string): Promise<boolean> {
    return this.mediaFiles.delete(id);
  }

  // Hotel methods
  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const hotel: Hotel = {
      id: randomUUID(),
      name: insertHotel.name,
      location: insertHotel.location,
      region: insertHotel.region,
      type: insertHotel.type,
      rating: insertHotel.rating,
      priceTier: insertHotel.priceTier,
      amenities: insertHotel.amenities,
      image: insertHotel.image,
      description: insertHotel.description,
      featured: insertHotel.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: insertHotel.createdBy || null
    };
    this.hotels.set(hotel.id, hotel);
    return hotel;
  }

  async getHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getHotel(id: string): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async getHotelBySlug(slug: string): Promise<Hotel | undefined> {
    return Array.from(this.hotels.values()).find(h => h.slug === slug);
  }

  async updateHotel(id: string, updateData: Partial<InsertHotel>): Promise<Hotel | undefined> {
    const existingHotel = this.hotels.get(id);
    if (!existingHotel) return undefined;

    const updatedHotel: Hotel = {
      ...existingHotel,
      ...updateData,
      updatedAt: new Date()
    };
    this.hotels.set(id, updatedHotel);
    return updatedHotel;
  }

  async deleteHotel(id: string): Promise<boolean> {
    return this.hotels.delete(id);
  }

  // Delete inquiry method
  async deleteInquiry(id: string): Promise<boolean> {
    return this.inquiries.delete(id);
  }

  // Category methods
  async createCategory(data: InsertCategory): Promise<Category> {
    try {
      const [category] = await db.insert(categories).values(data).returning();
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await db.select().from(categories).orderBy(categories.sortOrder, desc(categories.createdAt));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async getCategory(id: string): Promise<Category | undefined> {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.id, id));
      return category || undefined;
    } catch (error) {
      console.error("Error fetching category:", error);
      return undefined;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
      return category || undefined;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      return undefined;
    }
  }

  async updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const [category] = await db
        .update(categories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning();
      return category || undefined;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await db.delete(categories).where(eq(categories.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }

  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }

  async upsertSetting(key: string, value: string, updatedBy: string): Promise<Setting | undefined> {
    const existingSetting = this.settings.get(key);
    const now = new Date();

    const setting: Setting = {
      id: existingSetting ? existingSetting.id : randomUUID(),
      key,
      value,
      updatedBy,
      createdAt: existingSetting ? existingSetting.createdAt : now,
      updatedAt: now,
    };
    this.settings.set(key, setting);
    return setting;
  }
}

// Use database storage with PostgreSQL
export const storage = new DatabaseStorage();

// Seed database with admin user and sample data
export async function seedDatabase() {
  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      // Create admin user with bcrypt-hashed password
      await storage.createUser({
        username: "admin",
        email: "admin@luxuryegypt.com",
        password: "$2b$10$jya3D5zQkarnCNp7ex9E1eQFFdHa5pQgvriM2BK5yiPM/BNO77Hf.", // bcrypt hash of "admin123"
        role: "admin"
      });
      console.log("✓ Admin user seeded");
    }

    // Check if hotels are already seeded
    const existingHotels = await storage.getHotels();
    if (existingHotels.length === 0) {
      // Seed sample hotels
      const sampleHotels = [
        {
          name: "Mena House Hotel",
          location: "Giza",
          region: "Cairo & Giza",
          type: "Palace" as const,
          rating: 5,
          priceTier: "$$$$" as const,
          amenities: ["Pyramid Views", "Historic Heritage", "Luxury Spa", "Fine Dining"],
          image: "/api/assets/the-pyramid-from-mena-house_1757459228638.jpeg",
          description: "Historic palace hotel with direct views of the Great Pyramids. A legendary retreat where royalty and celebrities have stayed for over a century.",
          featured: true
        },
        {
          name: "Sofitel Winter Palace",
          location: "Luxor",
          region: "Luxor",
          type: "Palace" as const,
          rating: 5,
          priceTier: "$$$$" as const,
          amenities: ["Nile Gardens", "Royal Heritage", "Pool Complex", "Historic Charm"],
          image: "/api/assets/luxor_1757531163688.jpg",
          description: "Victorian grandeur on the banks of the Nile. This legendary hotel has hosted dignitaries and explorers since 1886.",
          featured: true
        },
        {
          name: "Four Seasons Hotel Cairo at Nile Plaza",
          location: "Cairo",
          region: "Cairo & Giza",
          type: "Resort" as const,
          rating: 5,
          priceTier: "$$$$" as const,
          amenities: ["Nile Views", "Luxury Spa", "Fine Dining", "Business Center"],
          image: "/api/assets/suite-nile_1757457083796.jpg",
          description: "Modern luxury with panoramic Nile views in the heart of Cairo. Contemporary elegance meets Egyptian hospitality.",
          featured: true
        }
      ];

      for (const hotel of sampleHotels) {
        await storage.createHotel(hotel);
      }
      console.log("✓ Sample hotels seeded");
    }

    // Seed sample inquiries
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
      console.log("✓ Sample inquiries seeded");
    }

    // Seed settings if not already present
    const existingSettings = await storage.getAllSettings();
    if (existingSettings.length === 0) {
      await storage.upsertSetting("contact_email", "info@luxortravel.com", "admin");
      await storage.upsertSetting("inquiry_notification_email", "support@luxortravel.com", "admin");
      await storage.upsertSetting("site_name", "Luxury Egypt Tours", "admin");
      await storage.upsertSetting("site_tagline", "Experience the magic of Egypt.", "admin");
      console.log("✓ Sample settings seeded");
    }

    console.log("✓ Database seeding completed");
  } catch (error) {
    console.error("Database seeding error:", error);
  }
}

// Initialize database seeding
seedDatabase();