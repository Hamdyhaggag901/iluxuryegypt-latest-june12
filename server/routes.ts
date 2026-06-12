import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import {
  insertInquirySchema,
  insertUserSchema,
  insertPageSchema,
  insertPostSchema,
  insertHotelSchema,
  insertTourSchema,
  insertPackageSchema,
  insertDestinationSchema,
  insertCategorySchema,
  insertMediaSchema,
  insertNavItemSchema,
  insertFooterLinkSchema,
  insertSocialLinkSchema,
  insertFaqSchema,
  insertNewsletterSubscriberSchema,
  insertTourBookingSchema,
  insertHeroSlideSchema,
  insertSiwaSectionSchema,
  insertGuestExperienceSectionSchema,
  insertWhyChooseSectionSchema,
  insertWhyChooseCardSchema,
  loginSchema
} from "@shared/schema";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  requireAuth, 
  requireAdmin, 
  requireEditor,
  type AuthenticatedRequest
} from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for I.LuxuryEgypt inquiry form
  
  // Submit inquiry form
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      
      // Log the inquiry for demonstration purposes
      console.log("New luxury travel inquiry received:", {
        name: inquiry.fullName,
        email: inquiry.email,
        destination: inquiry.destination,
        dates: inquiry.preferredDates,
      });
      
      res.status(201).json({
        success: true,
        message: "Thank you for your inquiry! Our luxury travel specialists will contact you within 24 hours to craft your bespoke Egyptian journey.",
        inquiry: {
          id: inquiry.id,
          fullName: inquiry.fullName,
          email: inquiry.email,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Please check your form data",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
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

  // Public tours route (no authentication required)
  app.get("/api/public/tours", async (req, res) => {
    try {
      const { category } = req.query;
      const allTours = await storage.getTours();
      
      // Filter by category if provided
      const tours = category 
        ? allTours.filter(tour => tour.category === category)
        : allTours;
      
      res.json({ success: true, tours });
    } catch (error) {
      console.error('Error fetching tours:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching tours' 
      });
    }
  });

  // Get single tour by slug (public route)
  app.get("/api/public/tours/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tour = await storage.getTourBySlug(slug);
      
      if (!tour) {
        return res.status(404).json({ 
          success: false, 
          message: 'Tour not found' 
        });
      }
      
      res.json({ success: true, tour });
    } catch (error) {
      console.error('Error fetching tour:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching tour' 
      });
    }
  });

  // Authentication Routes
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate token
      const token = generateToken(user);
      
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data' });
      }
      
      // Check if it's a database connection error
      if (error instanceof Error && error.message && error.message.includes('map')) {
        return res.status(503).json({ 
          message: 'Database not initialized. Please contact administrator.',
          hint: 'Try calling /api/init-db first'
        });
      }
      
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Register (admin only)
  app.post("/api/auth/register", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Verify token
  app.get("/api/auth/verify", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    res.json({
      success: true,
      user: {
        id: authReq.user!.id,
        username: authReq.user!.username,
        email: authReq.user!.email,
        role: authReq.user!.role
      }
    });
  });
  
  // Initialize database tables and seed data (DEVELOPMENT ONLY)
  app.post("/api/init-db", async (req, res) => {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Database initialization is only allowed in development mode"
      });
    }
    
    try {
      // First try to seed admin user and hotels via existing endpoint
      const seedResponse = await fetch('http://localhost:5000/api/auth/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const hotelSeedResponse = await fetch('http://localhost:5000/api/hotels/seed', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }
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
      console.error('Database initialization error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error initializing database',
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Seed default admin user (DEVELOPMENT ONLY)
  app.post("/api/auth/seed", async (req, res) => {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Admin seeding is only allowed in development mode"
      });
    }
    
    try {
      // Check if admin already exists
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.json({
          success: true,
          message: "Admin user already exists"
        });
      }
      
      // Create default admin user
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
      console.error('Error seeding admin user:', error);
      res.status(500).json({ message: 'Error creating admin user' });
    }
  });

  // Seed hotels (DEVELOPMENT ONLY)
  app.post("/api/hotels/seed", async (req, res) => {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Hotel seeding is only allowed in development mode"
      });
    }
    
    try {
      // Check if hotels already exist
      const existingHotels = await storage.getHotels();
      if (existingHotels.length > 0) {
        return res.json({
          success: true,
          message: "Hotels already exist in database",
          count: existingHotels.length
        });
      }
      
      // Create default admin user if it doesn't exist
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
      
      // Hotel data to seed
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
      
      // Create hotels
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
      console.error('Error seeding hotels:', error);
      res.status(500).json({ message: 'Error seeding hotels' });
    }
  });

  // Seed tours (DEVELOPMENT ONLY)
  app.post("/api/tours/seed", async (req, res) => {
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
      console.error('Error seeding tours:', error);
      res.status(500).json({ message: 'Error seeding tours' });
    }
  });
  
  // CMS Routes
  
  // Pages
  app.get("/api/cms/pages", requireAuth, requireEditor, async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json({ success: true, pages });
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ message: 'Error fetching pages' });
    }
  });
  
  app.post("/api/cms/pages", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const pageData = insertPageSchema.parse(req.body);
      
      const page = await storage.createPage({
        ...pageData,
        createdBy: authReq.user!.id
      });
      
      res.status(201).json({ success: true, page });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error creating page:', error);
      res.status(500).json({ message: 'Error creating page' });
    }
  });
  
  // Public Blog Routes (no authentication required)
  
  // Get all published blog posts
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const allPosts = await storage.getPosts();
      const publishedPosts = allPosts.filter(post => post.status === "published");
      res.json({ success: true, posts: publishedPosts });
    } catch (error) {
      console.error('Error fetching published posts:', error);
      res.status(500).json({ message: 'Error fetching blog posts' });
    }
  });
  
  // Get a single published blog post by slug
  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      if (post.status !== "published") {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ success: true, post });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Error fetching blog post' });
    }
  });
  
  // Posts (CMS - Authenticated Routes)
  app.get("/api/cms/posts", requireAuth, requireEditor, async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json({ success: true, posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Error fetching posts' });
    }
  });
  
  app.post("/api/cms/posts", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const postData = insertPostSchema.parse(req.body);

      // Sanitize slug - remove leading/trailing spaces, slashes, and special characters
      const sanitizedSlug = postData.slug
        .trim()
        .replace(/^[\s/]+|[\s/]+$/g, '')  // Remove leading/trailing spaces and slashes
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')       // Replace non-alphanumeric with dashes
        .replace(/-+/g, '-')              // Replace multiple dashes with single dash
        .replace(/^-|-$/g, '');           // Remove leading/trailing dashes

      const post = await storage.createPost({
        ...postData,
        slug: sanitizedSlug,
        createdBy: authReq.user!.id
      });

      res.status(201).json({ success: true, post });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Error creating post' });
    }
  });

  // Get specific post by ID
  app.get("/api/cms/posts/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ success: true, post });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Error fetching post' });
    }
  });

  // Update post
  app.put("/api/cms/posts/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const postData = insertPostSchema.partial().parse(req.body);

      // Sanitize slug if provided
      if (postData.slug) {
        postData.slug = postData.slug
          .trim()
          .replace(/^[\s/]+|[\s/]+$/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }

      const post = await storage.updatePost(req.params.id, postData);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json({ success: true, post });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Error updating post' });
    }
  });

  // Delete post
  app.delete("/api/cms/posts/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Error deleting post' });
    }
  });

  // Hotels Management Routes
  
  // Get all hotels (public access)
  app.get("/api/hotels", async (req, res) => {
    try {
      const hotels = await storage.getHotels();
      res.json({ success: true, hotels });
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ message: 'Error fetching hotels' });
    }
  });

  // Get a specific hotel by slug or id (public access)
  app.get("/api/hotels/:idOrSlug", async (req, res) => {
    try {
      const param = req.params.idOrSlug;
      // Try by slug first, then by ID
      let hotel = await storage.getHotelBySlug(param);
      if (!hotel) {
        hotel = await storage.getHotel(param);
      }
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      res.json({ success: true, hotel });
    } catch (error) {
      console.error('Error fetching hotel:', error);
      res.status(500).json({ message: 'Error fetching hotel' });
    }
  });

  // Create hotel (admin/editor access)
  app.post("/api/cms/hotels", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const hotelData = insertHotelSchema.parse(req.body);

      // Auto-generate slug from name if not provided
      let slug = hotelData.slug || hotelData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Check for duplicate slug and make unique if necessary
      let slugCounter = 1;
      let finalSlug = slug;
      while (await storage.getHotelBySlug(finalSlug)) {
        finalSlug = `${slug}-${slugCounter}`;
        slugCounter++;
      }

      const hotel = await storage.createHotel({
        ...hotelData,
        slug: finalSlug,
        createdBy: authReq.user!.id
      });

      res.status(201).json({ success: true, hotel });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error creating hotel:', error);
      res.status(500).json({ message: 'Error creating hotel' });
    }
  });

  // Update hotel (admin/editor access)
  app.put("/api/cms/hotels/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const hotelData = insertHotelSchema.partial().parse(req.body);
      
      const hotel = await storage.updateHotel(req.params.id, hotelData);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      
      res.json({ success: true, hotel });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error updating hotel:', error);
      res.status(500).json({ message: 'Error updating hotel' });
    }
  });

  // Delete hotel (admin/editor access)
  app.delete("/api/cms/hotels/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteHotel(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      
      res.json({ success: true, message: 'Hotel deleted successfully' });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ message: 'Error deleting hotel' });
    }
  });

  // Get hotels for CMS management (admin/editor access)
  app.get("/api/cms/hotels", requireAuth, requireEditor, async (req, res) => {
    try {
      const hotels = await storage.getHotels();
      res.json({ success: true, hotels });
    } catch (error) {
      console.error('Error fetching hotels for CMS:', error);
      res.status(500).json({ message: 'Error fetching hotels' });
    }
  });

  // Tour CMS Routes
  
  // Get tours for CMS management (admin/editor access)
  app.get("/api/cms/tours", requireAuth, requireEditor, async (req, res) => {
    try {
      const tours = await storage.getTours();
      res.json({ success: true, tours });
    } catch (error) {
      console.error('Error fetching tours for CMS:', error);
      res.status(500).json({ message: 'Error fetching tours' });
    }
  });

  // Get single tour for CMS editing (admin/editor access)
  app.get("/api/cms/tours/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const tour = await storage.getTour(req.params.id);
      if (!tour) {
        return res.status(404).json({ message: 'Tour not found' });
      }
      res.json({ success: true, tour });
    } catch (error) {
      console.error('Error fetching tour:', error);
      res.status(500).json({ message: 'Error fetching tour' });
    }
  });

  // Create tour (admin/editor access)
  app.post("/api/cms/tours", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tourData = insertTourSchema.parse(req.body);

      const tour = await storage.createTour({
        ...tourData,
        createdBy: authReq.user!.id
      });

      res.status(201).json({ success: true, tour });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error creating tour:', error);
      res.status(500).json({ message: 'Error creating tour' });
    }
  });

  // Bulk import tours (admin/editor access) - Must be before :id routes
  app.post("/api/cms/tours/bulk-import", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { tours } = req.body;

      if (!Array.isArray(tours) || tours.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No tours provided for import'
        });
      }

      const results = {
        imported: 0,
        failed: 0,
        errors: [] as { row: number; message: string }[]
      };

      // Get existing slugs to check for duplicates
      const existingTours = await storage.getTours();
      const existingSlugs = new Set(existingTours.map(t => t.slug));

      for (let i = 0; i < tours.length; i++) {
        const tour = tours[i];

        try {
          // Check for duplicate slug
          let slug = tour.slug;
          let slugCounter = 1;
          while (existingSlugs.has(slug)) {
            slug = `${tour.slug}-${slugCounter}`;
            slugCounter++;
          }

          // Validate required fields
          if (!tour.title || !tour.description || !tour.heroImage || !tour.duration || !tour.category) {
            throw new Error('Missing required fields');
          }

          // Parse and validate the tour data
          const tourData = insertTourSchema.parse({
            title: tour.title,
            slug: slug,
            description: tour.description,
            shortDescription: tour.shortDescription || '',
            heroImage: tour.heroImage,
            gallery: tour.gallery || [],
            duration: tour.duration,
            groupSize: tour.groupSize || '',
            difficulty: tour.difficulty || 'Easy',
            price: Number(tour.price) || 0,
            currency: tour.currency || 'USD',
            category: tour.category,
            includes: tour.includes || [],
            excludes: tour.excludes || [],
            destinations: tour.destinations || [],
            itinerary: tour.itinerary || [],
            featured: Boolean(tour.featured),
            published: tour.published !== false,
            createdBy: authReq.user!.id
          });

          await storage.createTour(tourData);
          existingSlugs.add(slug);
          results.imported++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            row: i + 2, // +2 because row 1 is header, and array is 0-indexed
            message: error.message || 'Unknown error'
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
      console.error('Error in bulk import:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing bulk import',
        imported: 0,
        failed: 0,
        errors: [{ row: 0, message: 'Server error during import' }]
      });
    }
  });

  // Update tour (admin/editor access)
  app.put("/api/cms/tours/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tourData = insertTourSchema.partial().parse(req.body);
      
      const tour = await storage.updateTour(req.params.id, tourData);
      if (!tour) {
        return res.status(404).json({ message: 'Tour not found' });
      }
      
      res.json({ success: true, tour });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error updating tour:', error);
      res.status(500).json({ message: 'Error updating tour' });
    }
  });

  // Delete tour (admin/editor access)
  app.delete("/api/cms/tours/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteTour(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Tour not found' });
      }

      res.json({ success: true, message: 'Tour deleted successfully' });
    } catch (error) {
      console.error('Error deleting tour:', error);
      res.status(500).json({ message: 'Error deleting tour' });
    }
  });

  // Package CMS Routes
  
  // Get packages for CMS management (admin/editor access)
  app.get("/api/cms/packages", requireAuth, requireEditor, async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json({ success: true, packages });
    } catch (error) {
      console.error('Error fetching packages for CMS:', error);
      res.status(500).json({ message: 'Error fetching packages' });
    }
  });

  // Create package (admin/editor access)
  app.post("/api/cms/packages", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const packageData = insertPackageSchema.parse(req.body);
      
      const pkg = await storage.createPackage({
        ...packageData,
        createdBy: authReq.user!.id
      });
      
      res.status(201).json({ success: true, package: pkg });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error creating package:', error);
      res.status(500).json({ message: 'Error creating package' });
    }
  });

  // Update package (admin/editor access)
  app.put("/api/cms/packages/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const packageData = insertPackageSchema.partial().parse(req.body);
      
      const pkg = await storage.updatePackage(req.params.id, packageData);
      if (!pkg) {
        return res.status(404).json({ message: 'Package not found' });
      }
      
      res.json({ success: true, package: pkg });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error updating package:', error);
      res.status(500).json({ message: 'Error updating package' });
    }
  });

  // Delete package (admin/editor access)
  app.delete("/api/cms/packages/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deletePackage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Package not found' });
      }
      
      res.json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
      console.error('Error deleting package:', error);
      res.status(500).json({ message: 'Error deleting package' });
    }
  });

  // Category CMS Routes
  
  // Get categories for CMS management (admin/editor access)
  app.get("/api/cms/categories", requireAuth, requireEditor, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ success: true, categories });
    } catch (error) {
      console.error('Error fetching categories for CMS:', error);
      res.status(500).json({ message: 'Error fetching categories' });
    }
  });

  // Create category (admin/editor access)
  app.post("/api/cms/categories", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const categoryData = insertCategorySchema.parse(req.body);
      
      const category = await storage.createCategory({
        ...categoryData,
        createdBy: authReq.user!.id
      });
      
      res.status(201).json({ success: true, category });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Error creating category' });
    }
  });

  // Update category (admin/editor access)
  app.put("/api/cms/categories/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      
      const category = await storage.updateCategory(req.params.id, categoryData);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json({ success: true, category });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Error updating category' });
    }
  });

  // Delete category (admin/editor access)
  app.delete("/api/cms/categories/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Error deleting category' });
    }
  });

  // Public Categories Route (no authentication required)
  app.get("/api/public/categories", async (req, res) => {
    try {
      const { type } = req.query;
      const categories = await storage.getCategories();
      const filtered = typeof type === "string"
        ? categories.filter(category => category.categoryType === type)
        : categories;
      res.json({ success: true, categories: filtered });
    } catch (error) {
      console.error('Error fetching public categories:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching categories' 
      });
    }
  });

  // Get single category by slug (public route)
  app.get("/api/public/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const categories = await storage.getCategories();
      const category = categories.find(cat => cat.slug === slug);
      
      if (!category) {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
      }
      
      res.json({ success: true, category });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching category' 
      });
    }
  });

  // Public Destinations Routes (no authentication required)
  app.get("/api/public/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      // Only return published destinations
      const publishedDestinations = destinations.filter(dest => dest.published);
      res.json({ success: true, destinations: publishedDestinations });
    } catch (error) {
      console.error('Error fetching public destinations:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching destinations'
      });
    }
  });

  // Get single destination by slug (public route)
  app.get("/api/public/destinations/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const destinations = await storage.getDestinations();
      const destination = destinations.find(dest => dest.slug === slug && dest.published);

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found'
        });
      }

      res.json({ success: true, destination });
    } catch (error) {
      console.error('Error fetching destination:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching destination'
      });
    }
  });

  // Destination CMS Routes

  // Get destinations for CMS management (admin/editor access)
  app.get("/api/cms/destinations", requireAuth, requireEditor, async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      console.error('Error fetching destinations for CMS:', error);
      res.status(500).json({ message: 'Error fetching destinations' });
    }
  });

  // Create destination (admin/editor access)
  app.post("/api/cms/destinations", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const destinationData = insertDestinationSchema.parse(req.body);

      const destination = await storage.createDestination({
        ...destinationData,
        createdBy: authReq.user!.id
      });

      res.status(201).json({ success: true, destination });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      // Check for unique constraint violation (duplicate slug)
      if (error?.constraint === 'destinations_slug_unique' || error?.code === '23505') {
        return res.status(400).json({
          message: 'A destination with this slug already exists. Please use a different slug.'
        });
      }
      console.error('Error creating destination:', error);
      res.status(500).json({ message: 'Error creating destination' });
    }
  });

  // Get single destination by ID (admin/editor access)
  app.get("/api/cms/destinations/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: 'Destination not found' });
      }
      res.json({ success: true, destination });
    } catch (error) {
      console.error('Error fetching destination:', error);
      res.status(500).json({ message: 'Error fetching destination' });
    }
  });

  // Update destination (admin/editor access)
  app.put("/api/cms/destinations/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const destinationData = insertDestinationSchema.partial().parse(req.body);
      
      const destination = await storage.updateDestination(req.params.id, destinationData);
      if (!destination) {
        return res.status(404).json({ message: 'Destination not found' });
      }
      
      res.json({ success: true, destination });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error updating destination:', error);
      res.status(500).json({ message: 'Error updating destination' });
    }
  });

  // Delete destination (admin/editor access)
  app.delete("/api/cms/destinations/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteDestination(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Destination not found' });
      }
      
      res.json({ success: true, message: 'Destination deleted successfully' });
    } catch (error) {
      console.error('Error deleting destination:', error);
      res.status(500).json({ message: 'Error deleting destination' });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/cms/stats", requireAuth, requireEditor, async (req, res) => {
    try {
      const [hotels, inquiries, pages, posts, packages, tours, destinations] = await Promise.all([
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
          hotels: hotels.length,
          inquiries: inquiries.length,
          pages: pages.length,
          posts: posts.length,
          packages: packages.length,
          tours: tours.length,
          destinations: destinations.length,
          media: 24 // Static for now
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
  });
  
  // Get all inquiries (for admin purposes)
  app.get("/api/inquiries", requireAuth, requireEditor, async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json({
        success: true,
        inquiries
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching inquiries"
      });
    }
  });

  // Get specific inquiry
  app.get("/api/inquiries/:id", async (req, res) => {
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

  // Configure multer for file uploads
  const uploadPath = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads");
  
  // Ensure uploads directory exists
  import('fs').then(fs => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('Created uploads directory:', uploadPath);
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
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
    fileFilter: (req, file, cb) => {
      // Allow images, videos and documents
      const allowedTypes = /jpeg|jpg|png|gif|webp|avif|mp4|mov|webm|avi|pdf|doc|docx/;
      const allowedMimeTypes = /image\/|video\/|application\/pdf|application\/msword|application\/vnd/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedMimeTypes.test(file.mimetype);

      if (mimetype || extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images, videos and documents are allowed!'));
      }
    }
  });

  // Media Management Routes
  
  // Get all media files
  app.get("/api/cms/media", requireAuth, requireEditor, async (req, res) => {
    try {
      const media = await storage.getMedia();
      res.json({ success: true, media });
    } catch (error) {
      console.error('Error fetching media:', error);
      res.status(500).json({ message: 'Error fetching media' });
    }
  });

  // Get specific media file
  app.get("/api/cms/media/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const media = await storage.getMediaById(req.params.id);
      if (!media) {
        return res.status(404).json({ message: 'Media not found' });
      }
      res.json({ success: true, media });
    } catch (error) {
      console.error('Error fetching media:', error);
      res.status(500).json({ message: 'Error fetching media' });
    }
  });

  // Upload media file
  app.post("/api/cms/media", requireAuth, requireEditor, upload.single('file'), async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const mediaData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/api/assets/uploads/${req.file.filename}`,
        uploadedBy: authReq.user!.id
      };

      const media = await storage.createMedia(mediaData);
      res.status(201).json({ success: true, media });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Error uploading media' });
    }
  });

  // Delete media file
  app.delete("/api/cms/media/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const media = await storage.getMediaById(req.params.id);
      if (!media) {
        return res.status(404).json({ message: 'Media not found' });
      }

      const success = await storage.deleteMedia(req.params.id);
      if (success) {
        // Also delete the actual file
        try {
          const filePath = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads", media.filename);
          await import('fs').then(fs => fs.promises.unlink(filePath));
        } catch (fileError) {
          console.warn('Could not delete file from disk:', fileError);
        }
        
        res.json({ success: true, message: 'Media deleted successfully' });
      } else {
        res.status(500).json({ message: 'Error deleting media' });
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      res.status(500).json({ message: 'Error deleting media' });
    }
  });

  // Settings Routes
  
  // Get all settings
  app.get("/api/cms/settings", requireAuth, requireEditor, async (req, res) => {
    try {
      const allSettings = await storage.getAllSettings();
      // Convert to key-value object
      const settingsObj = allSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
      
      res.json({ success: true, settings: settingsObj });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Error fetching settings' });
    }
  });

  // Change username
  app.post("/api/cms/settings/change-username", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { newUsername, currentPassword } = req.body;
      
      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, authReq.user!.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(newUsername);
      if (existingUser && existingUser.id !== authReq.user!.id) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      // Update username
      const updatedUser = await storage.updateUser(authReq.user!.id, { username: newUsername });
      
      res.json({ 
        success: true, 
        message: 'Username updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
    } catch (error) {
      console.error('Error changing username:', error);
      res.status(500).json({ message: 'Error changing username' });
    }
  });

  // Change password
  app.post("/api/cms/settings/change-password", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { currentPassword, newPassword } = req.body;
      
      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, authReq.user!.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password
      await storage.updateUser(authReq.user!.id, { password: hashedPassword });
      
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Error changing password' });
    }
  });

  // Update site info
  app.post("/api/cms/settings/site-info", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { siteName, siteTitle, faviconUrl, contactEmail, contactPhone, contactAddress } = req.body;

      await Promise.all([
        storage.upsertSetting('site_name', siteName, authReq.user!.id),
        storage.upsertSetting('site_title', siteTitle, authReq.user!.id),
        storage.upsertSetting('favicon_url', faviconUrl || '', authReq.user!.id),
        storage.upsertSetting('contact_email', contactEmail, authReq.user!.id),
        storage.upsertSetting('contact_phone', contactPhone, authReq.user!.id),
        storage.upsertSetting('contact_address', contactAddress, authReq.user!.id),
      ]);

      res.json({ success: true, message: 'Site information updated successfully' });
    } catch (error) {
      console.error('Error updating site info:', error);
      res.status(500).json({ message: 'Error updating site information' });
    }
  });

  // Get site metadata (public) - for browser tab title and favicon
  app.get("/api/public/site-metadata", async (req, res) => {
    try {
      const [titleSetting, faviconSetting] = await Promise.all([
        storage.getSetting('site_title'),
        storage.getSetting('favicon_url'),
      ]);
      res.json({
        success: true,
        siteTitle: titleSetting?.value || 'I.LuxuryEgypt - Bespoke Luxury Travel in Egypt',
        faviconUrl: faviconSetting?.value || null
      });
    } catch (error) {
      console.error('Error fetching site metadata:', error);
      res.status(500).json({ message: 'Error fetching site metadata' });
    }
  });

  // Update email settings
  app.post("/api/cms/settings/email", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { inquiryNotificationEmail } = req.body;

      await storage.upsertSetting('inquiry_notification_email', inquiryNotificationEmail, authReq.user!.id);

      res.json({ success: true, message: 'Email settings updated successfully' });
    } catch (error) {
      console.error('Error updating email settings:', error);
      res.status(500).json({ message: 'Error updating email settings' });
    }
  });

  // Update brochure settings
  app.post("/api/cms/settings/brochure", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { brochureUrl } = req.body;

      await storage.upsertSetting('brochure_url', brochureUrl, authReq.user!.id);

      res.json({ success: true, message: 'Brochure URL updated successfully' });
    } catch (error) {
      console.error('Error updating brochure settings:', error);
      res.status(500).json({ message: 'Error updating brochure settings' });
    }
  });

  // Get brochure URL (public)
  app.get("/api/public/brochure", async (req, res) => {
    try {
      const setting = await storage.getSetting('brochure_url');
      res.json({ success: true, brochureUrl: setting?.value || null });
    } catch (error) {
      console.error('Error fetching brochure URL:', error);
      res.status(500).json({ message: 'Error fetching brochure URL' });
    }
  });

  // Update WhatsApp settings
  app.post("/api/cms/settings/whatsapp", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { whatsappNumber, whatsappEnabled } = req.body;

      await storage.upsertSetting('whatsapp_number', whatsappNumber, authReq.user!.id);
      await storage.upsertSetting('whatsapp_enabled', whatsappEnabled ? 'true' : 'false', authReq.user!.id);

      res.json({ success: true, message: 'WhatsApp settings updated successfully' });
    } catch (error) {
      console.error('Error updating WhatsApp settings:', error);
      res.status(500).json({ message: 'Error updating WhatsApp settings' });
    }
  });

  // Get WhatsApp settings (public)
  app.get("/api/public/whatsapp-settings", async (req, res) => {
    try {
      const numberSetting = await storage.getSetting('whatsapp_number');
      const enabledSetting = await storage.getSetting('whatsapp_enabled');
      res.json({
        success: true,
        whatsappNumber: numberSetting?.value || null,
        whatsappEnabled: enabledSetting?.value === 'true'
      });
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      res.status(500).json({ message: 'Error fetching WhatsApp settings' });
    }
  });

  // Get contact page content (CMS)
  app.get("/api/cms/contact-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting('contact_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching contact page content:', error);
      res.status(500).json({ message: 'Error fetching contact page content' });
    }
  });

  // Update contact page content (CMS)
  app.post("/api/cms/contact-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const content = req.body;

      await storage.upsertSetting('contact_page_content', JSON.stringify(content), authReq.user!.id);

      res.json({ success: true, message: 'Contact page updated successfully' });
    } catch (error) {
      console.error('Error updating contact page content:', error);
      res.status(500).json({ message: 'Error updating contact page content' });
    }
  });

  // Get contact page content (public)
  app.get("/api/public/contact-page", async (req, res) => {
    try {
      const setting = await storage.getSetting('contact_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching contact page content:', error);
      res.status(500).json({ message: 'Error fetching contact page content' });
    }
  });

  // Get who we are page content (CMS)
  app.get("/api/cms/who-we-are-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting('who_we_are_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching who we are page content:', error);
      res.status(500).json({ message: 'Error fetching who we are page content' });
    }
  });

  // Update who we are page content (CMS)
  app.post("/api/cms/who-we-are-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const content = req.body;

      await storage.upsertSetting('who_we_are_page_content', JSON.stringify(content), authReq.user!.id);
      res.json({ success: true, message: 'Who we are page content updated' });
    } catch (error) {
      console.error('Error updating who we are page content:', error);
      res.status(500).json({ message: 'Error updating who we are page content' });
    }
  });

  // Get who we are page content (public)
  app.get("/api/public/who-we-are-page", async (req, res) => {
    try {
      const setting = await storage.getSetting('who_we_are_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching who we are page content:', error);
      res.status(500).json({ message: 'Error fetching who we are page content' });
    }
  });

  // Get iLuxury Difference page content (CMS)
  app.get("/api/cms/iluxury-difference-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting('iluxury_difference_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching iLuxury Difference page content:', error);
      res.status(500).json({ message: 'Error fetching iLuxury Difference page content' });
    }
  });

  // Update iLuxury Difference page content (CMS)
  app.post("/api/cms/iluxury-difference-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const content = req.body;

      await storage.upsertSetting('iluxury_difference_page_content', JSON.stringify(content), authReq.user!.id);
      res.json({ success: true, message: 'iLuxury Difference page content updated' });
    } catch (error) {
      console.error('Error updating iLuxury Difference page content:', error);
      res.status(500).json({ message: 'Error updating iLuxury Difference page content' });
    }
  });

  // Get iLuxury Difference page content (public)
  app.get("/api/public/iluxury-difference-page", async (req, res) => {
    try {
      const setting = await storage.getSetting('iluxury_difference_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching iLuxury Difference page content:', error);
      res.status(500).json({ message: 'Error fetching iLuxury Difference page content' });
    }
  });

  // Get Your Experience page content (CMS)
  app.get("/api/cms/your-experience-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting('your_experience_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching Your Experience page content:', error);
      res.status(500).json({ message: 'Error fetching Your Experience page content' });
    }
  });

  // Update Your Experience page content (CMS)
  app.post("/api/cms/your-experience-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const content = req.body;

      await storage.upsertSetting('your_experience_page_content', JSON.stringify(content), authReq.user!.id);
      res.json({ success: true, message: 'Your Experience page content updated' });
    } catch (error) {
      console.error('Error updating Your Experience page content:', error);
      res.status(500).json({ message: 'Error updating Your Experience page content' });
    }
  });

  // Get Your Experience page content (public)
  app.get("/api/public/your-experience-page", async (req, res) => {
    try {
      const setting = await storage.getSetting('your_experience_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching Your Experience page content:', error);
      res.status(500).json({ message: 'Error fetching Your Experience page content' });
    }
  });

  // Get Trusted Worldwide page content (CMS)
  app.get("/api/cms/trusted-worldwide-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const setting = await storage.getSetting('trusted_worldwide_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching Trusted Worldwide page content:', error);
      res.status(500).json({ message: 'Error fetching Trusted Worldwide page content' });
    }
  });

  // Update Trusted Worldwide page content (CMS)
  app.post("/api/cms/trusted-worldwide-page", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const content = req.body;

      await storage.upsertSetting('trusted_worldwide_page_content', JSON.stringify(content), authReq.user!.id);
      res.json({ success: true, message: 'Trusted Worldwide page content updated' });
    } catch (error) {
      console.error('Error updating Trusted Worldwide page content:', error);
      res.status(500).json({ message: 'Error updating Trusted Worldwide page content' });
    }
  });

  // Get Trusted Worldwide page content (public)
  app.get("/api/public/trusted-worldwide-page", async (req, res) => {
    try {
      const setting = await storage.getSetting('trusted_worldwide_page_content');
      const content = setting?.value ? JSON.parse(setting.value) : null;
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error fetching Trusted Worldwide page content:', error);
      res.status(500).json({ message: 'Error fetching Trusted Worldwide page content' });
    }
  });

  // Serve assets from attached_assets folder
  app.use("/api/assets", express.static(path.resolve(import.meta.dirname, "..", "attached_assets")));

  // ============================================
  // Navigation Items Routes (Header Management)
  // ============================================

  // Get all navigation items (public - for frontend)
  app.get("/api/public/nav-items", async (req, res) => {
    try {
      const items = await storage.getNavItems();
      // Only return visible items
      const visibleItems = items.filter(item => item.isVisible);
      res.json({ success: true, navItems: visibleItems });
    } catch (error) {
      console.error('Error fetching nav items:', error);
      res.status(500).json({ message: 'Error fetching navigation items' });
    }
  });

  // Get all navigation items (CMS - includes hidden)
  app.get("/api/cms/nav-items", requireAuth, requireEditor, async (req, res) => {
    try {
      const items = await storage.getNavItems();
      res.json({ success: true, navItems: items });
    } catch (error) {
      console.error('Error fetching nav items:', error);
      res.status(500).json({ message: 'Error fetching navigation items' });
    }
  });

  // Create navigation item
  app.post("/api/cms/nav-items", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertNavItemSchema.parse(req.body);
      const item = await storage.createNavItem(data);
      res.status(201).json({ success: true, navItem: item });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error creating nav item:', error);
      res.status(500).json({ message: 'Error creating navigation item' });
    }
  });

  // Update navigation item
  app.put("/api/cms/nav-items/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertNavItemSchema.partial().parse(req.body);
      const item = await storage.updateNavItem(req.params.id, data);
      if (!item) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }
      res.json({ success: true, navItem: item });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error updating nav item:', error);
      res.status(500).json({ message: 'Error updating navigation item' });
    }
  });

  // Delete navigation item
  app.delete("/api/cms/nav-items/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteNavItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }
      res.json({ success: true, message: 'Navigation item deleted' });
    } catch (error) {
      console.error('Error deleting nav item:', error);
      res.status(500).json({ message: 'Error deleting navigation item' });
    }
  });

  // ============================================
  // Site Config Routes (Logo, etc.)
  // ============================================

  // Get all site config (public)
  app.get("/api/public/site-config", async (req, res) => {
    try {
      const config = await storage.getAllSiteConfig();
      const configObj = config.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      res.json({ success: true, config: configObj });
    } catch (error) {
      console.error('Error fetching site config:', error);
      res.status(500).json({ message: 'Error fetching site configuration' });
    }
  });

  // Get all site config (CMS)
  app.get("/api/cms/site-config", requireAuth, requireEditor, async (req, res) => {
    try {
      const config = await storage.getAllSiteConfig();
      res.json({ success: true, config });
    } catch (error) {
      console.error('Error fetching site config:', error);
      res.status(500).json({ message: 'Error fetching site configuration' });
    }
  });

  // Update site config
  app.post("/api/cms/site-config", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { key, value, type } = req.body;
      const config = await storage.upsertSiteConfig(key, value, type || 'text', authReq.user!.id);
      res.json({ success: true, config });
    } catch (error) {
      console.error('Error updating site config:', error);
      res.status(500).json({ message: 'Error updating site configuration' });
    }
  });

  // Bulk update site config
  app.post("/api/cms/site-config/bulk", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { configs } = req.body; // Array of { key, value, type }

      const results = await Promise.all(
        configs.map((cfg: { key: string; value: string; type?: string }) =>
          storage.upsertSiteConfig(cfg.key, cfg.value, cfg.type || 'text', authReq.user!.id)
        )
      );

      res.json({ success: true, configs: results });
    } catch (error) {
      console.error('Error bulk updating site config:', error);
      res.status(500).json({ message: 'Error updating site configuration' });
    }
  });

  // ============================================
  // Footer Links Routes
  // ============================================

  // Get all footer links (public)
  app.get("/api/public/footer-links", async (req, res) => {
    try {
      const links = await storage.getFooterLinks();
      const visibleLinks = links.filter(link => link.isVisible);
      // Group by section
      const grouped = visibleLinks.reduce((acc, link) => {
        if (!acc[link.section]) acc[link.section] = [];
        acc[link.section].push(link);
        return acc;
      }, {} as Record<string, typeof visibleLinks>);
      res.json({ success: true, footerLinks: grouped });
    } catch (error) {
      console.error('Error fetching footer links:', error);
      res.status(500).json({ message: 'Error fetching footer links' });
    }
  });

  // Get all footer links (CMS)
  app.get("/api/cms/footer-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const links = await storage.getFooterLinks();
      res.json({ success: true, footerLinks: links });
    } catch (error) {
      console.error('Error fetching footer links:', error);
      res.status(500).json({ message: 'Error fetching footer links' });
    }
  });

  // Create footer link
  app.post("/api/cms/footer-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertFooterLinkSchema.parse(req.body);
      const link = await storage.createFooterLink(data);
      res.status(201).json({ success: true, footerLink: link });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error creating footer link:', error);
      res.status(500).json({ message: 'Error creating footer link' });
    }
  });

  // Update footer link
  app.put("/api/cms/footer-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertFooterLinkSchema.partial().parse(req.body);
      const link = await storage.updateFooterLink(req.params.id, data);
      if (!link) {
        return res.status(404).json({ message: 'Footer link not found' });
      }
      res.json({ success: true, footerLink: link });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error updating footer link:', error);
      res.status(500).json({ message: 'Error updating footer link' });
    }
  });

  // Delete footer link
  app.delete("/api/cms/footer-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteFooterLink(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Footer link not found' });
      }
      res.json({ success: true, message: 'Footer link deleted' });
    } catch (error) {
      console.error('Error deleting footer link:', error);
      res.status(500).json({ message: 'Error deleting footer link' });
    }
  });

  // ============================================
  // Social Links Routes
  // ============================================

  // Get all social links (public)
  app.get("/api/public/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      const visibleLinks = links.filter(link => link.isVisible);
      res.json({ success: true, socialLinks: visibleLinks });
    } catch (error) {
      console.error('Error fetching social links:', error);
      res.status(500).json({ message: 'Error fetching social links' });
    }
  });

  // Get all social links (CMS)
  app.get("/api/cms/social-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json({ success: true, socialLinks: links });
    } catch (error) {
      console.error('Error fetching social links:', error);
      res.status(500).json({ message: 'Error fetching social links' });
    }
  });

  // Create social link
  app.post("/api/cms/social-links", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertSocialLinkSchema.parse(req.body);
      const link = await storage.createSocialLink(data);
      res.status(201).json({ success: true, socialLink: link });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error creating social link:', error);
      res.status(500).json({ message: 'Error creating social link' });
    }
  });

  // Update social link
  app.put("/api/cms/social-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertSocialLinkSchema.partial().parse(req.body);
      const link = await storage.updateSocialLink(req.params.id, data);
      if (!link) {
        return res.status(404).json({ message: 'Social link not found' });
      }
      res.json({ success: true, socialLink: link });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error updating social link:', error);
      res.status(500).json({ message: 'Error updating social link' });
    }
  });

  // Delete social link
  app.delete("/api/cms/social-links/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteSocialLink(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Social link not found' });
      }
      res.json({ success: true, message: 'Social link deleted' });
    } catch (error) {
      console.error('Error deleting social link:', error);
      res.status(500).json({ message: 'Error deleting social link' });
    }
  });

  // ============================================
  // FAQ Routes
  // ============================================

  // Get all visible FAQs (public)
  app.get("/api/public/faqs", async (req, res) => {
    try {
      const faqList = await storage.getVisibleFaqs();
      res.json({ success: true, faqs: faqList });
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      res.status(500).json({ message: 'Error fetching FAQs' });
    }
  });

  // Get all FAQs (CMS)
  app.get("/api/cms/faqs", requireAuth, requireEditor, async (req, res) => {
    try {
      const faqList = await storage.getFaqs();
      res.json({ success: true, faqs: faqList });
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      res.status(500).json({ message: 'Error fetching FAQs' });
    }
  });

  // Get single FAQ (CMS)
  app.get("/api/cms/faqs/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const faq = await storage.getFaq(req.params.id);
      if (!faq) {
        return res.status(404).json({ message: 'FAQ not found' });
      }
      res.json({ success: true, faq });
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      res.status(500).json({ message: 'Error fetching FAQ' });
    }
  });

  // Create FAQ
  app.post("/api/cms/faqs", requireAuth, requireEditor, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq({
        ...data,
        createdBy: authReq.user!.id
      });
      res.status(201).json({ success: true, faq });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error creating FAQ:', error);
      res.status(500).json({ message: 'Error creating FAQ' });
    }
  });

  // Update FAQ
  app.put("/api/cms/faqs/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFaq(req.params.id, data);
      if (!faq) {
        return res.status(404).json({ message: 'FAQ not found' });
      }
      res.json({ success: true, faq });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error updating FAQ:', error);
      res.status(500).json({ message: 'Error updating FAQ' });
    }
  });

  // Delete FAQ
  app.delete("/api/cms/faqs/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteFaq(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'FAQ not found' });
      }
      res.json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      res.status(500).json({ message: 'Error deleting FAQ' });
    }
  });

  // ==================== NEWSLETTER ROUTES ====================

  // Public: Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const data = insertNewsletterSubscriberSchema.parse(req.body);

      // Check if email already exists
      const existing = await storage.getNewsletterSubscriberByEmail(data.email);
      if (existing) {
        if (existing.isActive) {
          return res.status(400).json({ message: 'This email is already subscribed to our newsletter.' });
        } else {
          // Reactivate subscription
          const updated = await storage.updateNewsletterSubscriber(existing.id, { isActive: true });
          return res.json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
        }
      }

      const subscriber = await storage.createNewsletterSubscriber(data);
      res.status(201).json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Please enter a valid email address', errors: error.errors });
      }
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ message: 'Error subscribing to newsletter' });
    }
  });

  // CMS: Get all newsletter subscribers
  app.get("/api/cms/newsletter", requireAuth, requireEditor, async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json({ success: true, subscribers });
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      res.status(500).json({ message: 'Error fetching newsletter subscribers' });
    }
  });

  // CMS: Update newsletter subscriber
  app.put("/api/cms/newsletter/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertNewsletterSubscriberSchema.partial().parse(req.body);
      const subscriber = await storage.updateNewsletterSubscriber(req.params.id, data);
      if (!subscriber) {
        return res.status(404).json({ message: 'Subscriber not found' });
      }
      res.json({ success: true, subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error updating subscriber:', error);
      res.status(500).json({ message: 'Error updating subscriber' });
    }
  });

  // CMS: Delete newsletter subscriber
  app.delete("/api/cms/newsletter/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteNewsletterSubscriber(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Subscriber not found' });
      }
      res.json({ success: true, message: 'Subscriber deleted' });
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      res.status(500).json({ message: 'Error deleting subscriber' });
    }
  });

  // ==================== TOUR BOOKING ROUTES ====================

  // Public: Submit tour booking
  app.post("/api/tour-bookings", async (req, res) => {
    try {
      const data = insertTourBookingSchema.parse(req.body);
      const booking = await storage.createTourBooking(data);
      res.status(201).json({ success: true, message: 'Booking submitted successfully! We will contact you soon.', booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error creating tour booking:', error);
      res.status(500).json({ message: 'Error submitting booking' });
    }
  });

  // CMS: Get all tour bookings
  app.get("/api/cms/tour-bookings", requireAuth, requireEditor, async (req, res) => {
    try {
      const bookings = await storage.getTourBookings();
      res.json({ success: true, bookings });
    } catch (error) {
      console.error('Error fetching tour bookings:', error);
      res.status(500).json({ message: 'Error fetching tour bookings' });
    }
  });

  // CMS: Get single tour booking
  app.get("/api/cms/tour-bookings/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const booking = await storage.getTourBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ success: true, booking });
    } catch (error) {
      console.error('Error fetching tour booking:', error);
      res.status(500).json({ message: 'Error fetching tour booking' });
    }
  });

  // CMS: Update tour booking (status, notes)
  app.put("/api/cms/tour-bookings/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertTourBookingSchema.partial().parse(req.body);
      const booking = await storage.updateTourBooking(req.params.id, data);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ success: true, booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error updating tour booking:', error);
      res.status(500).json({ message: 'Error updating tour booking' });
    }
  });

  // CMS: Delete tour booking
  app.delete("/api/cms/tour-bookings/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteTourBooking(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ success: true, message: 'Booking deleted' });
    } catch (error) {
      console.error('Error deleting tour booking:', error);
      res.status(500).json({ message: 'Error deleting tour booking' });
    }
  });

  // ==================== BROCHURE DOWNLOAD ROUTES ====================

  // Public: Submit brochure download (email capture)
  app.post("/api/brochure-downloads", async (req, res) => {
    try {
      const { email, tourId, tourTitle, tourSlug } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      const download = await storage.createBrochureDownload({ email, tourId, tourTitle, tourSlug });
      res.status(201).json({ success: true, message: 'Email submitted successfully', download });
    } catch (error) {
      console.error('Error saving brochure download:', error);
      res.status(500).json({ message: 'Error submitting email' });
    }
  });

  // CMS: Get all brochure downloads
  app.get("/api/cms/brochure-downloads", requireAuth, requireEditor, async (req, res) => {
    try {
      const downloads = await storage.getBrochureDownloads();
      res.json({ success: true, downloads });
    } catch (error) {
      console.error('Error fetching brochure downloads:', error);
      res.status(500).json({ message: 'Error fetching brochure downloads' });
    }
  });

  // CMS: Delete brochure download
  app.delete("/api/cms/brochure-downloads/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteBrochureDownload(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Download record not found' });
      }
      res.json({ success: true, message: 'Download record deleted' });
    } catch (error) {
      console.error('Error deleting brochure download:', error);
      res.status(500).json({ message: 'Error deleting download record' });
    }
  });

  // ==================== HERO SLIDES ROUTES ====================

  // Public: Get active hero slides
  app.get("/api/public/hero-slides", async (req, res) => {
    try {
      const slides = await storage.getActiveHeroSlides();
      res.json({ success: true, slides });
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      res.status(500).json({ message: 'Error fetching hero slides' });
    }
  });

  // CMS: Get all hero slides
  app.get("/api/cms/hero-slides", requireAuth, requireEditor, async (req, res) => {
    try {
      const slides = await storage.getHeroSlides();
      res.json({ success: true, slides });
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      res.status(500).json({ message: 'Error fetching hero slides' });
    }
  });

  // CMS: Get single hero slide
  app.get("/api/cms/hero-slides/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const slide = await storage.getHeroSlide(req.params.id);
      if (!slide) {
        return res.status(404).json({ message: 'Slide not found' });
      }
      res.json({ success: true, slide });
    } catch (error) {
      console.error('Error fetching hero slide:', error);
      res.status(500).json({ message: 'Error fetching hero slide' });
    }
  });

  // CMS: Create hero slide
  app.post("/api/cms/hero-slides", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertHeroSlideSchema.parse(req.body);
      const slide = await storage.createHeroSlide(data);
      res.status(201).json({ success: true, slide });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error creating hero slide:', error);
      res.status(500).json({ message: 'Error creating hero slide' });
    }
  });

  // CMS: Update hero slide
  app.put("/api/cms/hero-slides/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertHeroSlideSchema.partial().parse(req.body);
      const slide = await storage.updateHeroSlide(req.params.id, data);
      if (!slide) {
        return res.status(404).json({ message: 'Slide not found' });
      }
      res.json({ success: true, slide });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error updating hero slide:', error);
      res.status(500).json({ message: 'Error updating hero slide' });
    }
  });

  // CMS: Delete hero slide
  app.delete("/api/cms/hero-slides/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteHeroSlide(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Slide not found' });
      }
      res.json({ success: true, message: 'Slide deleted' });
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      res.status(500).json({ message: 'Error deleting hero slide' });
    }
  });

  // ==================== SIWA SECTION ROUTES ====================

  // Public: Get siwa section
  app.get("/api/public/siwa-section", async (req, res) => {
    try {
      const section = await storage.getSiwaSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error('Error fetching siwa section:', error);
      res.status(500).json({ message: 'Error fetching siwa section' });
    }
  });

  // CMS: Get siwa section
  app.get("/api/cms/siwa-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getSiwaSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error('Error fetching siwa section:', error);
      res.status(500).json({ message: 'Error fetching siwa section' });
    }
  });

  // CMS: Update/Create siwa section
  app.post("/api/cms/siwa-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertSiwaSectionSchema.parse(req.body);
      const section = await storage.upsertSiwaSection(data);
      res.json({ success: true, section });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error updating siwa section:', error);
      res.status(500).json({ message: 'Error updating siwa section' });
    }
  });

  // ==================== GUEST EXPERIENCE SECTION ROUTES ====================

  // Public: Get guest experience section
  app.get("/api/public/guest-experience-section", async (req, res) => {
    try {
      const section = await storage.getGuestExperienceSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error('Error fetching guest experience section:', error);
      res.status(500).json({ message: 'Error fetching guest experience section' });
    }
  });

  // CMS: Get guest experience section
  app.get("/api/cms/guest-experience-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getGuestExperienceSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error('Error fetching guest experience section:', error);
      res.status(500).json({ message: 'Error fetching guest experience section' });
    }
  });

  // CMS: Update/Create guest experience section
  app.post("/api/cms/guest-experience-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertGuestExperienceSectionSchema.parse(req.body);
      const section = await storage.upsertGuestExperienceSection(data);
      res.json({ success: true, section });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error updating guest experience section:', error);
      res.status(500).json({ message: 'Error updating guest experience section' });
    }
  });

  // ==================== WHY CHOOSE SECTION ROUTES ====================

  // Public: Get why choose section and cards
  app.get("/api/public/why-choose-section", async (req, res) => {
    try {
      const section = await storage.getWhyChooseSection();
      const cards = await storage.getWhyChooseCards();
      res.json({ success: true, section, cards });
    } catch (error) {
      console.error('Error fetching why choose section:', error);
      res.status(500).json({ message: 'Error fetching why choose section' });
    }
  });

  // CMS: Get why choose section
  app.get("/api/cms/why-choose-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getWhyChooseSection();
      res.json({ success: true, section });
    } catch (error) {
      console.error('Error fetching why choose section:', error);
      res.status(500).json({ message: 'Error fetching why choose section' });
    }
  });

  // CMS: Update/Create why choose section
  app.post("/api/cms/why-choose-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertWhyChooseSectionSchema.parse(req.body);
      const section = await storage.upsertWhyChooseSection(data);
      res.json({ success: true, section });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error updating why choose section:', error);
      res.status(500).json({ message: 'Error updating why choose section' });
    }
  });

  // ==================== WHY CHOOSE CARDS ROUTES ====================

  // CMS: Get all why choose cards
  app.get("/api/cms/why-choose-cards", requireAuth, requireEditor, async (req, res) => {
    try {
      const cards = await storage.getWhyChooseCards();
      res.json({ success: true, cards });
    } catch (error) {
      console.error('Error fetching why choose cards:', error);
      res.status(500).json({ message: 'Error fetching why choose cards' });
    }
  });

  // CMS: Create why choose card
  app.post("/api/cms/why-choose-cards", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertWhyChooseCardSchema.parse(req.body);
      const card = await storage.createWhyChooseCard(data);
      res.status(201).json({ success: true, card });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error creating why choose card:', error);
      res.status(500).json({ message: 'Error creating why choose card' });
    }
  });

  // CMS: Update why choose card
  app.put("/api/cms/why-choose-cards/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const data = insertWhyChooseCardSchema.partial().parse(req.body);
      const card = await storage.updateWhyChooseCard(req.params.id, data);
      if (!card) {
        return res.status(404).json({ message: 'Card not found' });
      }
      res.json({ success: true, card });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      console.error('Error updating why choose card:', error);
      res.status(500).json({ message: 'Error updating why choose card' });
    }
  });

  // CMS: Delete why choose card
  app.delete("/api/cms/why-choose-cards/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteWhyChooseCard(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Card not found' });
      }
      res.json({ success: true, message: 'Card deleted' });
    } catch (error) {
      console.error('Error deleting why choose card:', error);
      res.status(500).json({ message: 'Error deleting why choose card' });
    }
  });

  // ====================
  // TESTIMONIALS ROUTES
  // ====================

  // Public: Get all active testimonials
  app.get("/api/public/testimonials", async (req, res) => {
    try {
      const allTestimonials = await storage.getTestimonials();
      const activeTestimonials = allTestimonials.filter(t => t.isActive);
      res.json({ testimonials: activeTestimonials });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ message: 'Error fetching testimonials' });
    }
  });

  // CMS: Get all testimonials
  app.get("/api/cms/testimonials", requireAuth, requireEditor, async (req, res) => {
    try {
      const allTestimonials = await storage.getTestimonials();
      res.json({ testimonials: allTestimonials });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ message: 'Error fetching testimonials' });
    }
  });

  // CMS: Create testimonial
  app.post("/api/cms/testimonials", requireAuth, requireEditor, async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.json({ testimonial });
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ message: 'Error creating testimonial' });
    }
  });

  // CMS: Update testimonial
  app.put("/api/cms/testimonials/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      res.json({ testimonial });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ message: 'Error updating testimonial' });
    }
  });

  // CMS: Delete testimonial
  app.delete("/api/cms/testimonials/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteTestimonial(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      res.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ message: 'Error deleting testimonial' });
    }
  });

  // ====================
  // CONTACT CTA SECTION ROUTES
  // ====================

  // Public: Get contact CTA section
  app.get("/api/public/contact-cta-section", async (req, res) => {
    try {
      const section = await storage.getContactCtaSection();
      res.json({ section });
    } catch (error) {
      console.error('Error fetching contact CTA section:', error);
      res.status(500).json({ message: 'Error fetching contact CTA section' });
    }
  });

  // CMS: Get contact CTA section
  app.get("/api/cms/contact-cta-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getContactCtaSection();
      res.json({ section });
    } catch (error) {
      console.error('Error fetching contact CTA section:', error);
      res.status(500).json({ message: 'Error fetching contact CTA section' });
    }
  });

  // CMS: Update contact CTA section
  app.post("/api/cms/contact-cta-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.upsertContactCtaSection(req.body);
      res.json({ section });
    } catch (error) {
      console.error('Error updating contact CTA section:', error);
      res.status(500).json({ message: 'Error updating contact CTA section' });
    }
  });

  // ====================
  // STAY PAGE ROUTES
  // ====================

  // Public: Get all stay page content
  app.get("/api/public/stay-page", async (req, res) => {
    try {
      const hero = await storage.getStayPageHero();
      const accommodationTypes = await storage.getStayAccommodationTypes();
      const luxuryFeatures = await storage.getStayLuxuryFeatures();
      const nileSection = await storage.getStayNileSection();
      const cta = await storage.getStayCta();

      res.json({
        hero,
        accommodationTypes: accommodationTypes.filter(t => t.isActive),
        luxuryFeatures: luxuryFeatures.filter(f => f.isActive),
        nileSection,
        cta
      });
    } catch (error) {
      console.error('Error fetching stay page content:', error);
      res.status(500).json({ message: 'Error fetching stay page content' });
    }
  });

  // CMS: Get stay page hero
  app.get("/api/cms/stay-page/hero", requireAuth, requireEditor, async (req, res) => {
    try {
      const hero = await storage.getStayPageHero();
      res.json({ hero });
    } catch (error) {
      console.error('Error fetching stay page hero:', error);
      res.status(500).json({ message: 'Error fetching stay page hero' });
    }
  });

  // CMS: Update stay page hero
  app.post("/api/cms/stay-page/hero", requireAuth, requireEditor, async (req, res) => {
    try {
      const hero = await storage.upsertStayPageHero(req.body);
      res.json({ hero });
    } catch (error) {
      console.error('Error updating stay page hero:', error);
      res.status(500).json({ message: 'Error updating stay page hero' });
    }
  });

  // CMS: Get all accommodation types
  app.get("/api/cms/stay-page/accommodation-types", requireAuth, requireEditor, async (req, res) => {
    try {
      const types = await storage.getStayAccommodationTypes();
      res.json({ types });
    } catch (error) {
      console.error('Error fetching accommodation types:', error);
      res.status(500).json({ message: 'Error fetching accommodation types' });
    }
  });

  // CMS: Create accommodation type
  app.post("/api/cms/stay-page/accommodation-types", requireAuth, requireEditor, async (req, res) => {
    try {
      const type = await storage.createStayAccommodationType(req.body);
      res.json({ type });
    } catch (error) {
      console.error('Error creating accommodation type:', error);
      res.status(500).json({ message: 'Error creating accommodation type' });
    }
  });

  // CMS: Update accommodation type
  app.put("/api/cms/stay-page/accommodation-types/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const type = await storage.updateStayAccommodationType(req.params.id, req.body);
      if (!type) {
        return res.status(404).json({ message: 'Accommodation type not found' });
      }
      res.json({ type });
    } catch (error) {
      console.error('Error updating accommodation type:', error);
      res.status(500).json({ message: 'Error updating accommodation type' });
    }
  });

  // CMS: Delete accommodation type
  app.delete("/api/cms/stay-page/accommodation-types/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteStayAccommodationType(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Accommodation type not found' });
      }
      res.json({ success: true, message: 'Accommodation type deleted' });
    } catch (error) {
      console.error('Error deleting accommodation type:', error);
      res.status(500).json({ message: 'Error deleting accommodation type' });
    }
  });

  // CMS: Get all luxury features
  app.get("/api/cms/stay-page/luxury-features", requireAuth, requireEditor, async (req, res) => {
    try {
      const features = await storage.getStayLuxuryFeatures();
      res.json({ features });
    } catch (error) {
      console.error('Error fetching luxury features:', error);
      res.status(500).json({ message: 'Error fetching luxury features' });
    }
  });

  // CMS: Create luxury feature
  app.post("/api/cms/stay-page/luxury-features", requireAuth, requireEditor, async (req, res) => {
    try {
      const feature = await storage.createStayLuxuryFeature(req.body);
      res.json({ feature });
    } catch (error) {
      console.error('Error creating luxury feature:', error);
      res.status(500).json({ message: 'Error creating luxury feature' });
    }
  });

  // CMS: Update luxury feature
  app.put("/api/cms/stay-page/luxury-features/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const feature = await storage.updateStayLuxuryFeature(req.params.id, req.body);
      if (!feature) {
        return res.status(404).json({ message: 'Luxury feature not found' });
      }
      res.json({ feature });
    } catch (error) {
      console.error('Error updating luxury feature:', error);
      res.status(500).json({ message: 'Error updating luxury feature' });
    }
  });

  // CMS: Delete luxury feature
  app.delete("/api/cms/stay-page/luxury-features/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteStayLuxuryFeature(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Luxury feature not found' });
      }
      res.json({ success: true, message: 'Luxury feature deleted' });
    } catch (error) {
      console.error('Error deleting luxury feature:', error);
      res.status(500).json({ message: 'Error deleting luxury feature' });
    }
  });

  // CMS: Get nile section
  app.get("/api/cms/stay-page/nile-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.getStayNileSection();
      res.json({ section });
    } catch (error) {
      console.error('Error fetching nile section:', error);
      res.status(500).json({ message: 'Error fetching nile section' });
    }
  });

  // CMS: Update nile section
  app.post("/api/cms/stay-page/nile-section", requireAuth, requireEditor, async (req, res) => {
    try {
      const section = await storage.upsertStayNileSection(req.body);
      res.json({ section });
    } catch (error) {
      console.error('Error updating nile section:', error);
      res.status(500).json({ message: 'Error updating nile section' });
    }
  });

  // CMS: Get CTA section
  app.get("/api/cms/stay-page/cta", requireAuth, requireEditor, async (req, res) => {
    try {
      const cta = await storage.getStayCta();
      res.json({ cta });
    } catch (error) {
      console.error('Error fetching CTA:', error);
      res.status(500).json({ message: 'Error fetching CTA' });
    }
  });

  // CMS: Update CTA section
  app.post("/api/cms/stay-page/cta", requireAuth, requireEditor, async (req, res) => {
    try {
      const cta = await storage.upsertStayCta(req.body);
      res.json({ cta });
    } catch (error) {
      console.error('Error updating CTA:', error);
      res.status(500).json({ message: 'Error updating CTA' });
    }
  });

  // Dynamic sitemap.xml - includes all pages, tours, destinations, blog posts
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const baseUrl = "https://iluxuryegypt.com";
      const now = new Date().toISOString().split("T")[0];

      // Static pages
      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/destinations", priority: "0.9", changefreq: "weekly" },
        { url: "/egypt-tour-packages", priority: "0.9", changefreq: "weekly" },
        { url: "/egypt-day-tours", priority: "0.8", changefreq: "weekly" },
        { url: "/egypt-nile-cruise-tours", priority: "0.8", changefreq: "weekly" },
        { url: "/stay", priority: "0.8", changefreq: "weekly" },
        { url: "/blog", priority: "0.8", changefreq: "daily" },
        { url: "/contact", priority: "0.7", changefreq: "monthly" },
        { url: "/tailor-made", priority: "0.7", changefreq: "monthly" },
        { url: "/faq", priority: "0.5", changefreq: "monthly" },
        { url: "/about/who-we-are", priority: "0.6", changefreq: "monthly" },
        { url: "/about/iluxury-difference", priority: "0.6", changefreq: "monthly" },
        { url: "/about/your-experience", priority: "0.6", changefreq: "monthly" },
        { url: "/about/trusted-worldwide", priority: "0.6", changefreq: "monthly" },
        { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
        { url: "/terms-conditions", priority: "0.3", changefreq: "yearly" },
        { url: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
        { url: "/responsible-travel", priority: "0.3", changefreq: "yearly" },
        { url: "/disclaimer", priority: "0.3", changefreq: "yearly" },
      ];

      // Dynamic content from database
      const [tours, destinations, categories, posts] = await Promise.all([
        storage.getTours().catch(() => []),
        storage.getDestinations().catch(() => []),
        storage.getCategories().catch(() => []),
        storage.getPosts().catch(() => []),
      ]);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

      // Static pages
      for (const page of staticPages) {
        xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }

      // Tours
      for (const tour of tours) {
        if (tour.slug) {
          xml += `  <url>
    <loc>${baseUrl}/${tour.slug}</loc>
    <lastmod>${tour.updatedAt ? new Date(tour.updatedAt).toISOString().split("T")[0] : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }
      }

      // Destinations
      for (const dest of destinations) {
        if (dest.slug) {
          xml += `  <url>
    <loc>${baseUrl}/destinations/${dest.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }
      }

      // Categories
      for (const cat of categories) {
        if (cat.slug) {
          const parentPath = cat.parentSlug || "egypt-tour-packages";
          xml += `  <url>
    <loc>${baseUrl}/${parentPath}/${cat.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        }
      }

      // Blog posts
      for (const post of posts) {
        if (post.slug && post.published) {
          xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        }
      }

      xml += `</urlset>`;

      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
