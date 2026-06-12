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
      
      const post = await storage.createPost({
        ...postData,
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

  // Get a specific hotel (public access)
  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const hotel = await storage.getHotel(req.params.id);
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
      
      const hotel = await storage.createHotel({
        ...hotelData,
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
      const categories = await storage.getCategories();
      res.json({ success: true, categories });
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      console.error('Error creating destination:', error);
      res.status(500).json({ message: 'Error creating destination' });
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      // Allow images and documents
      const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images and documents are allowed!'));
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
      const { siteName, contactEmail, contactPhone, contactAddress } = req.body;
      
      await Promise.all([
        storage.upsertSetting('site_name', siteName, authReq.user!.id),
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

  // Serve assets from attached_assets folder
  app.use("/api/assets", express.static(path.resolve(import.meta.dirname, "..", "attached_assets")));

  const httpServer = createServer(app);

  return httpServer;
}
