import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical, Video, Image as ImageIcon, Loader2, ArrowLeft, Home, ChevronRight, Star, Phone, Mail, MessageSquare, Info, Users, Award, BookOpen, MapPin, Globe, Shield, Building2, Plane, Quote } from "lucide-react";

interface HeroSlide {
  id: string;
  sortOrder: number;
  mediaType: "video" | "image";
  mediaUrl: string;
  posterUrl?: string;
  subtitle?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
}

interface SiwaSection {
  id: string;
  mediaType: "video" | "image";
  mediaUrl: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
}

interface GuestExperienceSection {
  id: string;
  title: string;
  description?: string;
  tagline?: string;
  isActive: boolean;
}

interface WhyChooseSection {
  id: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
}

interface WhyChooseCard {
  id: string;
  sortOrder: number;
  title: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
}

interface Testimonial {
  id: string;
  sortOrder: number;
  quote: string;
  author: string;
  location?: string;
  rating: number;
  isActive: boolean;
}

interface ContactCtaSection {
  id: string;
  phone: string;
  email: string;
}

interface ContactPageContent {
  heroTitle: string;
  heroSubtitle: string;
  getInTouchTitle: string;
  getInTouchSubtitle: string;
  locationTitle: string;
  locationDetails: string[];
  emailTitle: string;
  emailDetails: string[];
  phoneTitle: string;
  phoneDetails: string[];
  hoursTitle: string;
  hoursDetails: string[];
  whyChooseTitle: string;
  whyChooseItems: {
    title: string;
    description: string;
  }[];
}

interface WhoWeArePageContent {
  // Hero
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroVideoUrl: string;
  // Our Story
  storySubtitle: string;
  storyTitle: string;
  storyIntro: string;
  storyBlock1Tag: string;
  storyBlock1Title: string;
  storyBlock1Text: string;
  storyBlock1Text2: string;
  storyBlock1Image: string;
  storyBlock2Tag: string;
  storyBlock2Title: string;
  storyBlock2Text: string;
  storyBlock2Text2: string;
  storyImages: string[];
  // Stats
  statsTitle: string;
  statsSubtitle: string;
  stats: { number: string; label: string }[];
  // Team
  teamSubtitle: string;
  teamTitle: string;
  teamIntro: string;
  teamMembers: { name: string; role: string; description: string; image: string }[];
  // Philosophy
  philosophySubtitle: string;
  philosophyTitle: string;
  philosophyQuote: string;
  philosophyValues: { title: string; description: string }[];
  // Promise
  promiseSubtitle: string;
  promiseTitle: string;
  promiseText: string;
  promiseCards: { title: string; description: string }[];
}

interface ILuxuryDifferencePageContent {
  // Hero
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  // Introduction
  introTitle: string;
  introText: string;
  // Differences (4 items)
  differences: {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    image: string;
  }[];
  // Why It Matters
  whyItMattersTitle: string;
  whyItMattersText: string;
}

interface YourExperiencePageContent {
  // Hero
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  // Introduction
  introTitle: string;
  introText: string;
  // Experiences (7 items)
  experiences: {
    icon: string;
    title: string;
    description: string;
    highlights: string[];
    image: string;
  }[];
  // Summary Section
  summaryTitle: string;
  summaryDescription: string;
  summaryCards: {
    title: string;
    description: string;
  }[];
  ctaButtonText: string;
}

interface TrustedWorldwidePageContent {
  // Hero
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  // Stats
  stats: {
    value: string;
    label: string;
  }[];
  // Partners Section
  partnersSubtitle: string;
  partnersTitle: string;
  partnersDescription: string;
  partnerCategories: {
    category: string;
    icon: string;
    items: {
      name: string;
      description: string;
    }[];
  }[];
  // Testimonials Section
  testimonialsSubtitle: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  testimonials: {
    text: string;
    author: string;
    location: string;
    trip: string;
    rating: number;
  }[];
  // Trust & Safety Section
  trustTitle: string;
  trustDescription: string;
  trustFeatures: string[];
  trustImage: string;
  // CTA Section
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

type PageView = "list" | "home" | "contact" | "who-we-are" | "iluxury-difference" | "your-experience" | "trusted-worldwide";

export default function AdminPageEdits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState<PageView>("list");

  // Hero Slide state
  const [slideDialogOpen, setSlideDialogOpen] = useState(false);
  const [deleteSlideDialogOpen, setDeleteSlideDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState({
    mediaType: "video" as "video" | "image",
    mediaUrl: "",
    posterUrl: "",
    subtitle: "",
    title: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    isActive: true,
    sortOrder: 0,
  });

  // Siwa Section state
  const [siwaForm, setSiwaForm] = useState({
    mediaType: "video" as "video" | "image",
    mediaUrl: "",
    title: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    isActive: true,
  });

  // Guest Experience state
  const [guestExpForm, setGuestExpForm] = useState({
    title: "",
    description: "",
    tagline: "",
    isActive: true,
  });

  // Why Choose Section state
  const [whyChooseForm, setWhyChooseForm] = useState({
    title: "",
    subtitle: "",
    isActive: true,
  });

  // Why Choose Card state
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [deleteCardDialogOpen, setDeleteCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<WhyChooseCard | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState({
    sortOrder: 0,
    title: "",
    content: "",
    imageUrl: "",
    isActive: true,
  });

  // Testimonial state
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [deleteTestimonialDialogOpen, setDeleteTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    sortOrder: 0,
    quote: "",
    author: "",
    location: "",
    rating: 5,
    isActive: true,
  });

  // Contact CTA state
  const [contactCtaForm, setContactCtaForm] = useState({
    phone: "",
    email: "",
  });

  // Contact Page state
  const [contactPageForm, setContactPageForm] = useState<ContactPageContent>({
    heroTitle: "Contact Us",
    heroSubtitle: "Ready to embark on your luxury Egyptian adventure? Our specialists are here to craft your perfect journey.",
    getInTouchTitle: "Get In Touch",
    getInTouchSubtitle: "Whether you're planning your dream vacation or have questions about our services, we're here to help.",
    locationTitle: "Our Location",
    locationDetails: ["Cairo, Egypt", "Serving all of Egypt"],
    emailTitle: "Email Us",
    emailDetails: ["concierge@i.luxuryegypt.com", "info@i.luxuryegypt.com"],
    phoneTitle: "Call Us",
    phoneDetails: ["+20 xxx xxx xxxx", "+20 xxx xxx xxxx"],
    hoursTitle: "Business Hours",
    hoursDetails: ["24/7 Concierge Service", "Sunday - Thursday: 9AM - 6PM"],
    whyChooseTitle: "Why Choose I.LuxuryEgypt?",
    whyChooseItems: [
      { title: "Bespoke Experiences", description: "Every journey is uniquely crafted to your personal preferences and interests." },
      { title: "24/7 Concierge", description: "Round-the-clock support from our dedicated luxury travel specialists." },
      { title: "Expert Knowledge", description: "Deep local expertise and exclusive access to Egypt's hidden treasures." },
    ],
  });

  // Who We Are Page state
  const [whoWeArePageForm, setWhoWeArePageForm] = useState<WhoWeArePageContent>({
    heroSubtitle: "About I.LuxuryEgypt",
    heroTitle: "Who We Are",
    heroDescription: "Passionate curators of extraordinary Egyptian journeys, committed to redefining luxury travel in the land of the Pharaohs.",
    heroImage: "",
    heroVideoUrl: "/attached_assets/Salt Lake Float Therapy_1757459954474.mp4",
    storySubtitle: "Heritage & Excellence",
    storyTitle: "Our Story",
    storyIntro: "A journey that began with passion for Egypt's timeless beauty and evolved into the finest luxury travel experience in the land of the Pharaohs.",
    storyBlock1Tag: "Our Beginning",
    storyBlock1Title: "Born from Passion",
    storyBlock1Text: "Born from a passion for Egypt's timeless beauty and a commitment to unparalleled luxury, I.LuxuryEgypt was founded to offer discerning travelers an extraordinary way to experience the land of the Pharaohs.",
    storyBlock1Text2: "Our founder, Ahmed Hassan, spent decades immersed in Egypt's hospitality industry, witnessing firsthand how standard tourism often fails to capture the true magic of this ancient land. He envisioned something different—a travel experience that honors Egypt's 5,000-year heritage while delivering the highest standards of modern luxury.",
    storyBlock1Image: "",
    storyBlock2Tag: "Our Evolution",
    storyBlock2Title: "Growing with Purpose",
    storyBlock2Text: "What started as a small team of passionate travel experts has grown into Egypt's premier luxury travel company. We've carefully expanded our offerings while maintaining the intimate, personalized approach that defines us.",
    storyBlock2Text2: "Today, I.LuxuryEgypt partners with the finest hotels, employs expert Egyptologists, and curates exclusive experiences that remain inaccessible to ordinary tourists. Yet we've never lost sight of our founding mission: to create transformative journeys that connect travelers deeply with Egypt's soul.",
    storyImages: [],
    statsTitle: "Excellence in Numbers",
    statsSubtitle: "Our commitment to luxury travel excellence, measured by the experiences we've crafted.",
    stats: [
      { number: "500+", label: "Luxury Travelers" },
      { number: "15+", label: "Years Experience" },
      { number: "50+", label: "Luxury Partners" },
      { number: "25+", label: "Unique Destinations" },
    ],
    teamSubtitle: "Our Experts",
    teamTitle: "Our Team",
    teamIntro: "The passionate curators behind every extraordinary Egyptian journey, bringing decades of expertise and an intimate knowledge of Egypt's hidden treasures.",
    teamMembers: [
      { name: "Ahmed Hassan", role: "Founder & Chief Experience Officer", description: "With over 15 years in luxury hospitality, Ahmed founded I.LuxuryEgypt to share Egypt's wonders with discerning travelers. His vision combines authentic Egyptian heritage with world-class service standards.", image: "" },
      { name: "Yasmin Farouk", role: "Luxury Travel Curator", description: "Our expert curator designs exclusive experiences that blend ancient history with modern luxury. Yasmin's deep knowledge of Egypt's hidden treasures ensures every journey is unique.", image: "" },
      { name: "Omar Mansour", role: "Guest Experience Director", description: "Ensuring every moment of your journey exceeds expectations with 24/7 concierge service. Omar's attention to detail and dedication to guest satisfaction is unmatched.", image: "" },
    ],
    philosophySubtitle: "Our Beliefs",
    philosophyTitle: "Our Philosophy",
    philosophyQuote: "We believe that luxury travel is not just about where you go, but how deeply you connect with a destination. Our team doesn't just plan trips—we craft transformative journeys that honor Egypt's timeless heritage while exceeding your every expectation.",
    philosophyValues: [
      { title: "Authenticity", description: "Every experience reflects the true spirit of Egypt" },
      { title: "Excellence", description: "Uncompromising standards in every detail" },
      { title: "Connection", description: "Creating meaningful bonds with Egypt's heritage" },
    ],
    promiseSubtitle: "Our Commitment",
    promiseTitle: "Our Promise",
    promiseText: "We promise to transform your Egyptian journey into something extraordinary. From the moment you reach out to us until long after you've returned home, we commit to exceeding your expectations at every turn. Your adventure will be seamlessly orchestrated, deeply personal, and utterly unforgettable.",
    promiseCards: [
      { title: "Personalized Excellence", description: "Every journey tailored to your unique preferences" },
      { title: "24/7 Support", description: "We're always here, whenever you need us" },
      { title: "Exclusive Access", description: "Experiences unavailable to ordinary travelers" },
      { title: "Lasting Memories", description: "Moments that stay with you forever" },
    ],
  });

  // iLuxury Difference Page state
  const [iluxuryDifferencePageForm, setIluxuryDifferencePageForm] = useState<ILuxuryDifferencePageContent>({
    heroSubtitle: "What Sets Us Apart",
    heroTitle: "The iLuxury Difference",
    heroDescription: "Discover why discerning travelers choose I.LuxuryEgypt for their most important journeys.",
    heroImage: "",
    introTitle: "Beyond Ordinary Travel",
    introText: "In a world of standardized tours and cookie-cutter itineraries, I.LuxuryEgypt stands apart. We've built our reputation on four foundational pillars that guide every decision we make and every experience we create. These aren't just promises—they're the essence of who we are.",
    differences: [
      {
        title: "Tailored Journeys",
        subtitle: "Your Vision, Our Expertise",
        description: "No two travelers are alike, and neither should their journeys be. We begin every relationship by deeply understanding your travel style, interests, and dreams. From there, we craft an itinerary that feels less like a tour and more like a personal odyssey.",
        features: [
          "In-depth consultation to understand your preferences",
          "Flexible itineraries that adapt to your pace",
          "Personalized recommendations for dining, activities, and hidden gems",
          "Special occasion arrangements and surprise elements"
        ],
        image: ""
      },
      {
        title: "Egyptian Soul, Global Standards",
        subtitle: "Authentic Heritage, World-Class Service",
        description: "We are proudly Egyptian, and that heritage infuses every experience we create. Yet we hold ourselves to the highest international standards of luxury hospitality. This unique combination means you'll enjoy authentic cultural immersion delivered with impeccable professionalism.",
        features: [
          "Local expertise from native Egyptians who know every nuance",
          "International service standards and protocols",
          "Seamless communication in multiple languages",
          "Cultural sensitivity combined with modern convenience"
        ],
        image: ""
      },
      {
        title: "Luxury in Every Detail",
        subtitle: "Where Excellence Is Standard",
        description: "True luxury lies in the details—the thread count of your sheets, the vintage of your wine, the expertise of your guide. We obsess over these details so you don't have to. Every element of your journey is carefully curated to meet the highest standards of excellence.",
        features: [
          "Hand-selected accommodations at Egypt's finest properties",
          "Private vehicles with professional chauffeurs",
          "Gourmet dining experiences at exclusive venues",
          "Premium amenities and thoughtful touches throughout"
        ],
        image: ""
      },
      {
        title: "Peace of Mind, Redefined",
        subtitle: "Travel Without Worry",
        description: "When you travel with I.LuxuryEgypt, you're never alone. Our dedicated team monitors every aspect of your journey, anticipating needs before they arise and resolving any issues instantly. This invisible support system allows you to be fully present in every moment.",
        features: [
          "24/7 dedicated concierge support",
          "Real-time trip monitoring and proactive assistance",
          "Comprehensive travel insurance options",
          "Emergency response protocols and local contacts"
        ],
        image: ""
      }
    ],
    whyItMattersTitle: "Why It Matters",
    whyItMattersText: "Egypt is more than a destination—it's a profound experience that has captivated travelers for millennia. The difference between an ordinary trip and an extraordinary journey lies in the details, the access, and the expertise that guide you. We exist to ensure that your encounter with Egypt is as magnificent as this ancient land deserves.",
  });

  // Your Experience Page state
  const [yourExperiencePageForm, setYourExperiencePageForm] = useState<YourExperiencePageContent>({
    heroSubtitle: "Every Element Crafted",
    heroTitle: "Your Experience Includes",
    heroDescription: "Every journey with I.LuxuryEgypt encompasses these exceptional elements, ensuring an experience that exceeds imagination.",
    heroImage: "",
    introTitle: "A Complete Luxury Experience",
    introText: "When you travel with I.LuxuryEgypt, you're not just booking a trip—you're investing in a comprehensive experience designed to inspire, delight, and transform. Here's what awaits you on every journey we create.",
    experiences: [
      {
        icon: "Crown",
        title: "Private & VIP Experiences",
        description: "Step beyond the velvet rope into a world of exclusive access. Imagine the Great Pyramid to yourself at dawn, a private viewing at the Egyptian Museum, or a sunset dinner atop a Luxor temple. These aren't just tours—they're once-in-a-lifetime privileges.",
        highlights: [
          "Private access to monuments before or after public hours",
          "VIP museum experiences with behind-the-scenes access",
          "Exclusive dining in historic venues",
          "Private yacht and felucca experiences on the Nile"
        ],
        image: ""
      },
      {
        icon: "Users",
        title: "Boutique Group Journeys",
        description: "For those who enjoy the camaraderie of like-minded travelers, our boutique group journeys offer intimacy and exclusivity. Limited to small groups, these curated experiences combine the benefits of shared adventure with the standards of private travel.",
        highlights: [
          "Maximum 12 guests per journey",
          "Like-minded travelers with similar interests",
          "Expertly curated social experiences",
          "Exclusive group rates at premium properties"
        ],
        image: ""
      },
      {
        icon: "BookOpen",
        title: "Expert Storytellers",
        description: "Our guides aren't just knowledgeable—they're master storytellers who bring Egypt's 5,000-year history to vivid life. Each is a certified Egyptologist with deep expertise and the rare ability to make ancient history feel immediate and personal.",
        highlights: [
          "Certified Egyptologists with advanced degrees",
          "Fluent in multiple languages",
          "Passionate storytellers, not script readers",
          "Available for private, in-depth discussions"
        ],
        image: ""
      },
      {
        icon: "Hotel",
        title: "Curated Stays",
        description: "We've personally inspected and selected each property in our portfolio. From legendary grande dames like the Old Cataract to intimate desert camps under the stars, every accommodation is chosen for its exceptional character, service, and ability to enhance your journey.",
        highlights: [
          "Egypt's most prestigious hotels and resorts",
          "Unique boutique properties with character",
          "Luxury Nile cruise experiences",
          "Private desert camps and oasis retreats"
        ],
        image: ""
      },
      {
        icon: "UtensilsCrossed",
        title: "The Art of Dining",
        description: "Egyptian cuisine is a revelation, and we ensure you experience its full depth and variety. From street food tours with expert guides to private dinners at exclusive venues, every meal is an opportunity to discover Egypt's culinary heritage.",
        highlights: [
          "Private dining in historic locations",
          "Cooking classes with renowned chefs",
          "Curated food tours through local markets",
          "Fine dining at Egypt's best restaurants"
        ],
        image: ""
      },
      {
        icon: "Landmark",
        title: "Cultural & Historical Immersion",
        description: "Go beyond surface-level sightseeing to truly understand Egypt. Participate in archaeological discussions, attend exclusive lectures, visit active excavation sites, and engage with local artisans keeping ancient crafts alive.",
        highlights: [
          "Access to active archaeological sites",
          "Meetings with renowned Egyptologists",
          "Traditional craft workshops and demonstrations",
          "Cultural performances and artistic experiences"
        ],
        image: ""
      },
      {
        icon: "Heart",
        title: "Tailored for Every Traveler",
        description: "Whether you're a solo adventurer, a romantic couple, a multi-generational family, or a group of friends, we adapt every element to suit your needs. Special dietary requirements, accessibility needs, specific interests—everything is anticipated and accommodated.",
        highlights: [
          "Family-friendly itineraries with engaging activities for all ages",
          "Romantic experiences for couples",
          "Accessibility accommodations throughout",
          "Special interest journeys (photography, archaeology, wellness)"
        ],
        image: ""
      }
    ],
    summaryTitle: "All This and More",
    summaryDescription: "Beyond these core elements, every I.LuxuryEgypt journey includes thoughtful touches that elevate your experience from excellent to extraordinary.",
    summaryCards: [
      { title: "Seamless Logistics", description: "Airport meet-and-greet, all internal transfers, luggage handling, and documentation assistance." },
      { title: "Premium Inclusions", description: "Entry fees, gratuities, mineral water throughout, and quality refreshments during excursions." },
      { title: "Thoughtful Details", description: "Welcome amenities, personalized travel documents, and surprise touches throughout your journey." }
    ],
    ctaButtonText: "Create Your Experience"
  });

  // Trusted Worldwide Page state
  const [trustedWorldwidePageForm, setTrustedWorldwidePageForm] = useState<TrustedWorldwidePageContent>({
    heroSubtitle: "Our Reputation",
    heroTitle: "Trusted Worldwide",
    heroDescription: "Partnered with Egypt's finest, endorsed by travelers across the globe.",
    heroImage: "",
    stats: [
      { value: "500+", label: "Happy Travelers" },
      { value: "50+", label: "Premium Partners" },
      { value: "15+", label: "Years of Excellence" },
      { value: "4.9", label: "Average Rating" }
    ],
    partnersSubtitle: "Excellence Network",
    partnersTitle: "Our Partners",
    partnersDescription: "We've cultivated relationships with Egypt's most prestigious hotels, services, and organizations to ensure every aspect of your journey meets the highest standards.",
    partnerCategories: [
      {
        category: "Luxury Hotels",
        icon: "Building2",
        items: [
          { name: "Four Seasons Hotels Egypt", description: "Cairo & Alexandria properties" },
          { name: "Sofitel Legend Old Cataract", description: "Aswan's iconic heritage hotel" },
          { name: "Marriott Mena House", description: "Pyramid views since 1886" },
          { name: "The St. Regis Cairo", description: "Modern luxury on the Nile" },
          { name: "Oberoi Hotels Egypt", description: "Sahl Hasheesh & Philae" },
          { name: "Kempinski Hotels", description: "Red Sea & Nile properties" }
        ]
      },
      {
        category: "Premium Services",
        icon: "Plane",
        items: [
          { name: "EgyptAir Business Class", description: "Official airline partner" },
          { name: "Sanctuary Sun Boat", description: "Luxury Nile cruising" },
          { name: "Oberoi Zahra", description: "Premium cruise experiences" },
          { name: "Private Aviation", description: "Charter flight arrangements" },
          { name: "Luxury Ground Transport", description: "Mercedes & BMW fleet" },
          { name: "Desert Camps", description: "Exclusive Siwa & White Desert" }
        ]
      },
      {
        category: "Certifications & Memberships",
        icon: "Award",
        items: [
          { name: "Egyptian Tourism Authority", description: "Licensed tour operator" },
          { name: "ASTA Member", description: "American Society of Travel Advisors" },
          { name: "Virtuoso", description: "Luxury travel network" },
          { name: "Traveller Made", description: "Bespoke travel consortium" },
          { name: "IATA Accredited", description: "International airline ticketing" },
          { name: "Safe Travels Certified", description: "WTTC health & safety protocols" }
        ]
      }
    ],
    testimonialsSubtitle: "Guest Stories",
    testimonialsTitle: "Testimonials",
    testimonialsDescription: "Don't just take our word for it. Here's what travelers from around the world have said about their I.LuxuryEgypt experiences.",
    testimonials: [
      {
        text: "I've traveled extensively, but nothing has compared to my journey with I.LuxuryEgypt. The private sunrise at the Pyramids brought me to tears. Every detail was perfect, every guide exceptional.",
        author: "Sarah Mitchell",
        location: "New York, USA",
        trip: "Classic Egypt Journey",
        rating: 5
      },
      {
        text: "As a family with three generations traveling together, I was worried about keeping everyone happy. I.LuxuryEgypt made it effortless. My 8-year-old was as engaged as my 80-year-old mother.",
        author: "James & Elizabeth Chen",
        location: "San Francisco, USA",
        trip: "Multi-Generational Family Journey",
        rating: 5
      },
      {
        text: "The level of access we received was unbelievable. Private museum viewings, dinner inside a temple, conversations with real archaeologists—I still can't believe these experiences were possible.",
        author: "Dr. Michael Roberts",
        location: "London, UK",
        trip: "Archaeological Deep Dive",
        rating: 5
      }
    ],
    trustTitle: "Your Trust, Our Priority",
    trustDescription: "When you book with I.LuxuryEgypt, you're protected by comprehensive safeguards. We're fully licensed, insured, and bonded. Your payments are secure, your data is protected, and your journey is backed by our reputation and guarantees.",
    trustFeatures: [
      "Fully licensed Egyptian tour operator",
      "Comprehensive liability insurance",
      "Secure payment processing",
      "GDPR-compliant data protection"
    ],
    trustImage: "",
    ctaTitle: "Ready to Experience the Difference?",
    ctaDescription: "Join hundreds of discerning travelers who have entrusted their Egyptian dreams to us. Let us show you why we're the most trusted name in luxury Egypt travel.",
    ctaPrimaryText: "Start Planning Your Journey",
    ctaSecondaryText: "Explore Experiences"
  });

  const token = localStorage.getItem("adminToken");

  // Fetch hero slides
  const { data: slidesData, isLoading: slidesLoading } = useQuery({
    queryKey: ["heroSlides"],
    queryFn: async () => {
      const response = await fetch("/api/cms/hero-slides", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch hero slides");
      return response.json();
    },
    enabled: currentView === "home",
  });

  // Fetch siwa section
  const { data: siwaData, isLoading: siwaLoading } = useQuery({
    queryKey: ["siwaSection"],
    queryFn: async () => {
      const response = await fetch("/api/cms/siwa-section", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch siwa section");
      const data = await response.json();
      if (data.section) {
        setSiwaForm({
          mediaType: data.section.mediaType || "video",
          mediaUrl: data.section.mediaUrl || "",
          title: data.section.title || "",
          description: data.section.description || "",
          ctaText: data.section.ctaText || "",
          ctaLink: data.section.ctaLink || "",
          isActive: data.section.isActive ?? true,
        });
      }
      return data;
    },
    enabled: currentView === "home",
  });

  // Fetch guest experience section
  const { data: guestExpData, isLoading: guestExpLoading } = useQuery({
    queryKey: ["guestExperienceSection"],
    queryFn: async () => {
      const response = await fetch("/api/cms/guest-experience-section", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch guest experience section");
      const data = await response.json();
      if (data.section) {
        setGuestExpForm({
          title: data.section.title || "",
          description: data.section.description || "",
          tagline: data.section.tagline || "",
          isActive: data.section.isActive ?? true,
        });
      }
      return data;
    },
    enabled: currentView === "home",
  });

  // Fetch why choose section
  const { data: whyChooseData, isLoading: whyChooseLoading } = useQuery({
    queryKey: ["whyChooseSection"],
    queryFn: async () => {
      const response = await fetch("/api/cms/why-choose-section", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch why choose section");
      const data = await response.json();
      if (data.section) {
        setWhyChooseForm({
          title: data.section.title || "",
          subtitle: data.section.subtitle || "",
          isActive: data.section.isActive ?? true,
        });
      }
      return data;
    },
    enabled: currentView === "home",
  });

  // Fetch why choose cards
  const { data: cardsData, isLoading: cardsLoading } = useQuery({
    queryKey: ["whyChooseCards"],
    queryFn: async () => {
      const response = await fetch("/api/cms/why-choose-cards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch why choose cards");
      return response.json();
    },
    enabled: currentView === "home",
  });

  // Fetch testimonials
  const { data: testimonialsData, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/cms/testimonials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json();
    },
    enabled: currentView === "home",
  });

  // Fetch contact CTA section
  const { data: contactCtaData, isLoading: contactCtaLoading } = useQuery({
    queryKey: ["contactCtaSection"],
    queryFn: async () => {
      const response = await fetch("/api/cms/contact-cta-section", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch contact CTA section");
      const data = await response.json();
      if (data.section) {
        setContactCtaForm({
          phone: data.section.phone || "",
          email: data.section.email || "",
        });
      }
      return data;
    },
    enabled: currentView === "home",
  });

  // Fetch contact page content
  const { data: contactPageData, isLoading: contactPageLoading } = useQuery({
    queryKey: ["contactPageContent"],
    queryFn: async () => {
      const response = await fetch("/api/cms/contact-page", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch contact page content");
      const data = await response.json();
      if (data.content) {
        setContactPageForm(data.content);
      }
      return data;
    },
    enabled: currentView === "contact",
  });

  // Fetch about page content
  const { data: aboutPageData, isLoading: whoWeArePageLoading } = useQuery({
    queryKey: ["aboutPageContent"],
    queryFn: async () => {
      const response = await fetch("/api/cms/who-we-are-page", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch about page content");
      const data = await response.json();
      if (data.content) {
        setWhoWeArePageForm(data.content);
      }
      return data;
    },
    enabled: currentView === "who-we-are",
  });

  // Fetch iLuxury Difference page content
  const { data: iluxuryDifferencePageData, isLoading: iluxuryDifferencePageLoading } = useQuery({
    queryKey: ["iluxuryDifferencePageContent"],
    queryFn: async () => {
      const response = await fetch("/api/cms/iluxury-difference-page", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch iLuxury Difference page content");
      const data = await response.json();
      if (data.content) {
        setIluxuryDifferencePageForm(data.content);
      }
      return data;
    },
    enabled: currentView === "iluxury-difference",
  });

  // Fetch Your Experience page content
  const { data: yourExperiencePageData, isLoading: yourExperiencePageLoading } = useQuery({
    queryKey: ["yourExperiencePageContent"],
    queryFn: async () => {
      const response = await fetch("/api/cms/your-experience-page", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch Your Experience page content");
      const data = await response.json();
      if (data.content) {
        setYourExperiencePageForm(data.content);
      }
      return data;
    },
    enabled: currentView === "your-experience",
  });

  // Fetch Trusted Worldwide page content
  const { data: trustedWorldwidePageData, isLoading: trustedWorldwidePageLoading } = useQuery({
    queryKey: ["trustedWorldwidePageContent"],
    queryFn: async () => {
      const response = await fetch("/api/cms/trusted-worldwide-page", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch Trusted Worldwide page content");
      const data = await response.json();
      if (data.content) {
        setTrustedWorldwidePageForm(data.content);
      }
      return data;
    },
    enabled: currentView === "trusted-worldwide",
  });

  // Hero slide mutations
  const createSlideMutation = useMutation({
    mutationFn: async (data: typeof slideForm) => {
      const response = await fetch("/api/cms/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create slide");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroSlides"] });
      setSlideDialogOpen(false);
      resetSlideForm();
      toast({ title: "Success", description: "Hero slide created" });
    },
    onError: () => toast({ title: "Error", description: "Failed to create hero slide", variant: "destructive" }),
  });

  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof slideForm }) => {
      const response = await fetch(`/api/cms/hero-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update slide");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroSlides"] });
      setSlideDialogOpen(false);
      setEditingSlide(null);
      resetSlideForm();
      toast({ title: "Success", description: "Hero slide updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update hero slide", variant: "destructive" }),
  });

  const deleteSlideMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cms/hero-slides/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete slide");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroSlides"] });
      setDeleteSlideDialogOpen(false);
      setSlideToDelete(null);
      toast({ title: "Success", description: "Hero slide deleted" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete hero slide", variant: "destructive" }),
  });

  // Siwa section mutation
  const updateSiwaMutation = useMutation({
    mutationFn: async (data: typeof siwaForm) => {
      const response = await fetch("/api/cms/siwa-section", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update siwa section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siwaSection"] });
      toast({ title: "Success", description: "Siwa section updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update siwa section", variant: "destructive" }),
  });

  // Guest experience mutation
  const updateGuestExpMutation = useMutation({
    mutationFn: async (data: typeof guestExpForm) => {
      const response = await fetch("/api/cms/guest-experience-section", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update guest experience section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestExperienceSection"] });
      toast({ title: "Success", description: "Guest Experience section updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update guest experience section", variant: "destructive" }),
  });

  // Why choose section mutation
  const updateWhyChooseMutation = useMutation({
    mutationFn: async (data: typeof whyChooseForm) => {
      const response = await fetch("/api/cms/why-choose-section", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update why choose section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whyChooseSection"] });
      toast({ title: "Success", description: "Why Choose section updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update why choose section", variant: "destructive" }),
  });

  // Why choose card mutations
  const createCardMutation = useMutation({
    mutationFn: async (data: typeof cardForm) => {
      const response = await fetch("/api/cms/why-choose-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create card");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whyChooseCards"] });
      setCardDialogOpen(false);
      resetCardForm();
      toast({ title: "Success", description: "Card created" });
    },
    onError: () => toast({ title: "Error", description: "Failed to create card", variant: "destructive" }),
  });

  const updateCardMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof cardForm }) => {
      const response = await fetch(`/api/cms/why-choose-cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update card");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whyChooseCards"] });
      setCardDialogOpen(false);
      setEditingCard(null);
      resetCardForm();
      toast({ title: "Success", description: "Card updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update card", variant: "destructive" }),
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cms/why-choose-cards/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete card");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whyChooseCards"] });
      setDeleteCardDialogOpen(false);
      setCardToDelete(null);
      toast({ title: "Success", description: "Card deleted" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete card", variant: "destructive" }),
  });

  // Testimonial mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: typeof testimonialForm) => {
      const response = await fetch("/api/cms/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setTestimonialDialogOpen(false);
      resetTestimonialForm();
      toast({ title: "Success", description: "Testimonial created" });
    },
    onError: () => toast({ title: "Error", description: "Failed to create testimonial", variant: "destructive" }),
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof testimonialForm }) => {
      const response = await fetch(`/api/cms/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setTestimonialDialogOpen(false);
      setEditingTestimonial(null);
      resetTestimonialForm();
      toast({ title: "Success", description: "Testimonial updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update testimonial", variant: "destructive" }),
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cms/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setDeleteTestimonialDialogOpen(false);
      setTestimonialToDelete(null);
      toast({ title: "Success", description: "Testimonial deleted" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete testimonial", variant: "destructive" }),
  });

  // Contact CTA mutation
  const updateContactCtaMutation = useMutation({
    mutationFn: async (data: typeof contactCtaForm) => {
      const response = await fetch("/api/cms/contact-cta-section", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update contact CTA section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactCtaSection"] });
      toast({ title: "Success", description: "Contact info updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update contact info", variant: "destructive" }),
  });

  // Contact page mutation
  const updateContactPageMutation = useMutation({
    mutationFn: async (data: ContactPageContent) => {
      const response = await fetch("/api/cms/contact-page", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update contact page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactPageContent"] });
      toast({ title: "Success", description: "Contact page updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update contact page", variant: "destructive" }),
  });

  // Who We Are page mutation
  const updateWhoWeArePageMutation = useMutation({
    mutationFn: async (data: WhoWeArePageContent) => {
      const response = await fetch("/api/cms/who-we-are-page", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update Who We Are page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutPageContent"] });
      toast({ title: "Success", description: "Who We Are page updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update Who We Are page", variant: "destructive" }),
  });

  // iLuxury Difference page mutation
  const updateIluxuryDifferencePageMutation = useMutation({
    mutationFn: async (data: ILuxuryDifferencePageContent) => {
      const response = await fetch("/api/cms/iluxury-difference-page", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update iLuxury Difference page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iluxuryDifferencePageContent"] });
      toast({ title: "Success", description: "iLuxury Difference page updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update iLuxury Difference page", variant: "destructive" }),
  });

  // Your Experience page mutation
  const updateYourExperiencePageMutation = useMutation({
    mutationFn: async (data: YourExperiencePageContent) => {
      const response = await fetch("/api/cms/your-experience-page", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update Your Experience page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yourExperiencePageContent"] });
      toast({ title: "Success", description: "Your Experience page updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update Your Experience page", variant: "destructive" }),
  });

  // Trusted Worldwide page mutation
  const updateTrustedWorldwidePageMutation = useMutation({
    mutationFn: async (data: TrustedWorldwidePageContent) => {
      const response = await fetch("/api/cms/trusted-worldwide-page", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update Trusted Worldwide page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trustedWorldwidePageContent"] });
      toast({ title: "Success", description: "Trusted Worldwide page updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update Trusted Worldwide page", variant: "destructive" }),
  });

  const resetSlideForm = () => {
    setSlideForm({
      mediaType: "video",
      mediaUrl: "",
      posterUrl: "",
      subtitle: "",
      title: "",
      description: "",
      ctaText: "",
      ctaLink: "",
      isActive: true,
      sortOrder: (slidesData?.slides?.length || 0),
    });
  };

  const resetCardForm = () => {
    setCardForm({
      sortOrder: (cardsData?.cards?.length || 0),
      title: "",
      content: "",
      imageUrl: "",
      isActive: true,
    });
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      sortOrder: (testimonialsData?.testimonials?.length || 0),
      quote: "",
      author: "",
      location: "",
      rating: 5,
      isActive: true,
    });
  };

  const openEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      sortOrder: testimonial.sortOrder,
      quote: testimonial.quote,
      author: testimonial.author,
      location: testimonial.location || "",
      rating: testimonial.rating,
      isActive: testimonial.isActive,
    });
    setTestimonialDialogOpen(true);
  };

  const openNewTestimonial = () => {
    setEditingTestimonial(null);
    resetTestimonialForm();
    setTestimonialDialogOpen(true);
  };

  const openEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideForm({
      mediaType: slide.mediaType,
      mediaUrl: slide.mediaUrl,
      posterUrl: slide.posterUrl || "",
      subtitle: slide.subtitle || "",
      title: slide.title,
      description: slide.description || "",
      ctaText: slide.ctaText || "",
      ctaLink: slide.ctaLink || "",
      isActive: slide.isActive,
      sortOrder: slide.sortOrder,
    });
    setSlideDialogOpen(true);
  };

  const openNewSlide = () => {
    setEditingSlide(null);
    resetSlideForm();
    setSlideDialogOpen(true);
  };

  const openEditCard = (card: WhyChooseCard) => {
    setEditingCard(card);
    setCardForm({
      sortOrder: card.sortOrder,
      title: card.title,
      content: card.content,
      imageUrl: card.imageUrl,
      isActive: card.isActive,
    });
    setCardDialogOpen(true);
  };

  const openNewCard = () => {
    setEditingCard(null);
    resetCardForm();
    setCardDialogOpen(true);
  };

  const slides: HeroSlide[] = slidesData?.slides || [];
  const cards: WhyChooseCard[] = cardsData?.cards || [];
  const testimonials: Testimonial[] = testimonialsData?.testimonials || [];

  // Pages List View
  if (currentView === "list") {
    return (
      <AdminLayout title="Page Edits" description="Select a page to edit its content">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setCurrentView("home")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Home Page</CardTitle>
                  <CardDescription>Hero, Siwa, Guest Experience, Why Choose, Reviews, Contact</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>6 editable sections</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setCurrentView("contact")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Contact Us Page</CardTitle>
                  <CardDescription>Hero, Contact Info, Why Choose</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>3 editable sections</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setCurrentView("who-we-are")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Who We Are Page</CardTitle>
                  <CardDescription>Hero, Story, Stats, Team, Philosophy, Promise</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>6 editable sections</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setCurrentView("iluxury-difference")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">iLuxury Difference Page</CardTitle>
                  <CardDescription>Hero, Introduction, Differences, Why It Matters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>4 editable sections</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setCurrentView("your-experience")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Your Experience Page</CardTitle>
                  <CardDescription>Hero, Introduction, 7 Experiences, Summary</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>4 editable sections</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setCurrentView("trusted-worldwide")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Trusted Worldwide Page</CardTitle>
                  <CardDescription>Hero, Stats, Partners, Testimonials, Trust & Safety, CTA</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>6 editable sections</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  // Contact Page Edit View
  if (currentView === "contact") {
    return (
      <AdminLayout title="Edit Contact Page" description="Manage the content of the contact page">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentView("list")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Edit the hero title and subtitle</CardDescription>
            </CardHeader>
            <CardContent>
              {contactPageLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input value={contactPageForm.heroTitle} onChange={(e) => setContactPageForm({ ...contactPageForm, heroTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Subtitle</Label>
                    <Textarea value={contactPageForm.heroSubtitle} onChange={(e) => setContactPageForm({ ...contactPageForm, heroSubtitle: e.target.value })} rows={2} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Get In Touch Section */}
          <Card>
            <CardHeader>
              <CardTitle>Get In Touch Section</CardTitle>
              <CardDescription>Edit the section title and subtitle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={contactPageForm.getInTouchTitle} onChange={(e) => setContactPageForm({ ...contactPageForm, getInTouchTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Textarea value={contactPageForm.getInTouchSubtitle} onChange={(e) => setContactPageForm({ ...contactPageForm, getInTouchSubtitle: e.target.value })} rows={2} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information Cards</CardTitle>
              <CardDescription>Edit the 4 contact info cards (Location, Email, Phone, Hours)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Location Card Title</Label>
                    <Input value={contactPageForm.locationTitle} onChange={(e) => setContactPageForm({ ...contactPageForm, locationTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location Details (one per line)</Label>
                    <Textarea
                      value={contactPageForm.locationDetails.join("\n")}
                      onChange={(e) => setContactPageForm({ ...contactPageForm, locationDetails: e.target.value.split("\n") })}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Email Card Title</Label>
                    <Input value={contactPageForm.emailTitle} onChange={(e) => setContactPageForm({ ...contactPageForm, emailTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Addresses (one per line)</Label>
                    <Textarea
                      value={contactPageForm.emailDetails.join("\n")}
                      onChange={(e) => setContactPageForm({ ...contactPageForm, emailDetails: e.target.value.split("\n") })}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Phone Card Title</Label>
                    <Input value={contactPageForm.phoneTitle} onChange={(e) => setContactPageForm({ ...contactPageForm, phoneTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Numbers (one per line)</Label>
                    <Textarea
                      value={contactPageForm.phoneDetails.join("\n")}
                      onChange={(e) => setContactPageForm({ ...contactPageForm, phoneDetails: e.target.value.split("\n") })}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Hours */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Hours Card Title</Label>
                    <Input value={contactPageForm.hoursTitle} onChange={(e) => setContactPageForm({ ...contactPageForm, hoursTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Hours (one per line)</Label>
                    <Textarea
                      value={contactPageForm.hoursDetails.join("\n")}
                      onChange={(e) => setContactPageForm({ ...contactPageForm, hoursDetails: e.target.value.split("\n") })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose Section */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose I.LuxuryEgypt Section</CardTitle>
              <CardDescription>Edit the section title and the 3 feature items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={contactPageForm.whyChooseTitle} onChange={(e) => setContactPageForm({ ...contactPageForm, whyChooseTitle: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contactPageForm.whyChooseItems.map((item, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Item {index + 1} Title</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...contactPageForm.whyChooseItems];
                            newItems[index] = { ...newItems[index], title: e.target.value };
                            setContactPageForm({ ...contactPageForm, whyChooseItems: newItems });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Item {index + 1} Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...contactPageForm.whyChooseItems];
                            newItems[index] = { ...newItems[index], description: e.target.value };
                            setContactPageForm({ ...contactPageForm, whyChooseItems: newItems });
                          }}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={() => updateContactPageMutation.mutate(contactPageForm)} disabled={updateContactPageMutation.isPending}>
              {updateContactPageMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Who We Are Page Edit View
  if (currentView === "who-we-are") {
    return (
      <AdminLayout title="Edit Who We Are Page" description="Manage the content of the Who We Are page">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentView("list")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Hero Section</CardTitle>
              <CardDescription>Edit the hero title, subtitle, background image and video</CardDescription>
            </CardHeader>
            <CardContent>
              {whoWeArePageLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hero Subtitle (small text above title)</Label>
                    <Input value={whoWeArePageForm.heroSubtitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, heroSubtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input value={whoWeArePageForm.heroTitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, heroTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Description</Label>
                    <Textarea value={whoWeArePageForm.heroDescription} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, heroDescription: e.target.value })} rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hero Background Image URL</Label>
                      <Input value={whoWeArePageForm.heroImage} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, heroImage: e.target.value })} placeholder="/api/assets/image.jpg" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hero Video URL</Label>
                      <Input value={whoWeArePageForm.heroVideoUrl} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, heroVideoUrl: e.target.value })} placeholder="/attached_assets/video.mp4" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Our Story Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Our Story Section</CardTitle>
              <CardDescription>Edit the story section with its blocks, philosophy and images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Section Header */}
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <h4 className="font-medium">Section Header</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subtitle (above title)</Label>
                      <Input value={whoWeArePageForm.storySubtitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storySubtitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={whoWeArePageForm.storyTitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyTitle: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Introduction Text</Label>
                    <Textarea value={whoWeArePageForm.storyIntro} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyIntro: e.target.value })} rows={2} />
                  </div>
                </div>

                {/* Story Block 1 */}
                <div className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium">Story Block 1 - "Born from Passion"</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tag</Label>
                      <Input value={whoWeArePageForm.storyBlock1Tag} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock1Tag: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={whoWeArePageForm.storyBlock1Title} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock1Title: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Paragraph 1</Label>
                    <Textarea value={whoWeArePageForm.storyBlock1Text} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock1Text: e.target.value })} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Paragraph 2</Label>
                    <Textarea value={whoWeArePageForm.storyBlock1Text2} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock1Text2: e.target.value })} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input value={whoWeArePageForm.storyBlock1Image} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock1Image: e.target.value })} placeholder="/api/assets/image.jpg" />
                  </div>
                </div>

                {/* Story Block 2 */}
                <div className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium">Story Block 2 - "Growing with Purpose"</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tag</Label>
                      <Input value={whoWeArePageForm.storyBlock2Tag} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock2Tag: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={whoWeArePageForm.storyBlock2Title} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock2Title: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Paragraph 1</Label>
                    <Textarea value={whoWeArePageForm.storyBlock2Text} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock2Text: e.target.value })} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Paragraph 2</Label>
                    <Textarea value={whoWeArePageForm.storyBlock2Text2} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyBlock2Text2: e.target.value })} rows={3} />
                  </div>
                </div>

                {/* Story Images */}
                <div className="space-y-2">
                  <Label>Story Gallery Images (one URL per line)</Label>
                  <Textarea
                    value={whoWeArePageForm.storyImages.join("\n")}
                    onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, storyImages: e.target.value.split("\n").filter(s => s.trim()) })}
                    rows={4}
                    placeholder="/api/assets/image1.jpg&#10;/api/assets/image2.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Stats Section</CardTitle>
              <CardDescription>Edit the "Excellence in Numbers" statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input value={whoWeArePageForm.statsTitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, statsTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Subtitle</Label>
                    <Input value={whoWeArePageForm.statsSubtitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, statsSubtitle: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {whoWeArePageForm.stats.map((stat, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <h5 className="font-medium text-sm">Stat {index + 1}</h5>
                      <div className="space-y-2">
                        <Label>Number</Label>
                        <Input
                          value={stat.number}
                          onChange={(e) => {
                            const newStats = [...whoWeArePageForm.stats];
                            newStats[index] = { ...newStats[index], number: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, stats: newStats });
                          }}
                          placeholder="500+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...whoWeArePageForm.stats];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, stats: newStats });
                          }}
                          placeholder="Luxury Travelers"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Philosophy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Philosophy Section</CardTitle>
              <CardDescription>Edit the "Our Philosophy" section with quote and values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <h4 className="font-medium">Section Header</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input value={whoWeArePageForm.philosophySubtitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, philosophySubtitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={whoWeArePageForm.philosophyTitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, philosophyTitle: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Philosophy Quote</Label>
                    <Textarea value={whoWeArePageForm.philosophyQuote} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, philosophyQuote: e.target.value })} rows={3} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {whoWeArePageForm.philosophyValues.map((value, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <h5 className="font-medium">Value {index + 1}</h5>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => {
                            const newValues = [...whoWeArePageForm.philosophyValues];
                            newValues[index] = { ...newValues[index], title: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, philosophyValues: newValues });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={value.description}
                          onChange={(e) => {
                            const newValues = [...whoWeArePageForm.philosophyValues];
                            newValues[index] = { ...newValues[index], description: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, philosophyValues: newValues });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Team Section</CardTitle>
              <CardDescription>Edit the "Meet Our Team" section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <h4 className="font-medium">Section Header</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input value={whoWeArePageForm.teamSubtitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, teamSubtitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={whoWeArePageForm.teamTitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, teamTitle: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Introduction</Label>
                    <Textarea value={whoWeArePageForm.teamIntro} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, teamIntro: e.target.value })} rows={2} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {whoWeArePageForm.teamMembers.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <h5 className="font-medium">Team Member {index + 1}</h5>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => {
                            const newMembers = [...whoWeArePageForm.teamMembers];
                            newMembers[index] = { ...newMembers[index], name: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, teamMembers: newMembers });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={member.role}
                          onChange={(e) => {
                            const newMembers = [...whoWeArePageForm.teamMembers];
                            newMembers[index] = { ...newMembers[index], role: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, teamMembers: newMembers });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={member.description}
                          onChange={(e) => {
                            const newMembers = [...whoWeArePageForm.teamMembers];
                            newMembers[index] = { ...newMembers[index], description: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, teamMembers: newMembers });
                          }}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={member.image}
                          onChange={(e) => {
                            const newMembers = [...whoWeArePageForm.teamMembers];
                            newMembers[index] = { ...newMembers[index], image: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, teamMembers: newMembers });
                          }}
                          placeholder="/api/assets/image.jpg"
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Promise Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Promise Section</CardTitle>
              <CardDescription>Edit "Our Promise" section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <h4 className="font-medium">Section Header</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input value={whoWeArePageForm.promiseSubtitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, promiseSubtitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={whoWeArePageForm.promiseTitle} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, promiseTitle: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Promise Text</Label>
                    <Textarea value={whoWeArePageForm.promiseText} onChange={(e) => setWhoWeArePageForm({ ...whoWeArePageForm, promiseText: e.target.value })} rows={3} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {whoWeArePageForm.promiseCards.map((card, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <h5 className="font-medium">Card {index + 1}</h5>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={card.title}
                          onChange={(e) => {
                            const newCards = [...whoWeArePageForm.promiseCards];
                            newCards[index] = { ...newCards[index], title: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, promiseCards: newCards });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={card.description}
                          onChange={(e) => {
                            const newCards = [...whoWeArePageForm.promiseCards];
                            newCards[index] = { ...newCards[index], description: e.target.value };
                            setWhoWeArePageForm({ ...whoWeArePageForm, promiseCards: newCards });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={() => updateWhoWeArePageMutation.mutate(whoWeArePageForm)} disabled={updateWhoWeArePageMutation.isPending}>
              {updateWhoWeArePageMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // iLuxury Difference Page Edit View
  if (currentView === "iluxury-difference") {
    return (
      <AdminLayout title="Edit iLuxury Difference Page" description="Manage the content of the iLuxury Difference page">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentView("list")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Hero Section</CardTitle>
              <CardDescription>Edit the hero title, subtitle, and background image</CardDescription>
            </CardHeader>
            <CardContent>
              {iluxuryDifferencePageLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hero Subtitle (small text above title)</Label>
                    <Input value={iluxuryDifferencePageForm.heroSubtitle} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, heroSubtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input value={iluxuryDifferencePageForm.heroTitle} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, heroTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Description</Label>
                    <Textarea value={iluxuryDifferencePageForm.heroDescription} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, heroDescription: e.target.value })} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Background Image URL</Label>
                    <Input value={iluxuryDifferencePageForm.heroImage} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, heroImage: e.target.value })} placeholder="/api/assets/image.jpg" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Introduction Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Introduction Section</CardTitle>
              <CardDescription>Edit the "Beyond Ordinary Travel" introduction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Introduction Title</Label>
                  <Input value={iluxuryDifferencePageForm.introTitle} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, introTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Introduction Text</Label>
                  <Textarea value={iluxuryDifferencePageForm.introText} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, introText: e.target.value })} rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Differences Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> The Four Pillars</CardTitle>
              <CardDescription>Edit the 4 main difference sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {iluxuryDifferencePageForm.differences.map((diff, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium text-lg">Pillar {index + 1}: {diff.title}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={diff.title}
                          onChange={(e) => {
                            const newDiffs = [...iluxuryDifferencePageForm.differences];
                            newDiffs[index] = { ...newDiffs[index], title: e.target.value };
                            setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, differences: newDiffs });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          value={diff.subtitle}
                          onChange={(e) => {
                            const newDiffs = [...iluxuryDifferencePageForm.differences];
                            newDiffs[index] = { ...newDiffs[index], subtitle: e.target.value };
                            setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, differences: newDiffs });
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={diff.description}
                        onChange={(e) => {
                          const newDiffs = [...iluxuryDifferencePageForm.differences];
                          newDiffs[index] = { ...newDiffs[index], description: e.target.value };
                          setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, differences: newDiffs });
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Features (one per line)</Label>
                      <Textarea
                        value={diff.features.join("\n")}
                        onChange={(e) => {
                          const newDiffs = [...iluxuryDifferencePageForm.differences];
                          newDiffs[index] = { ...newDiffs[index], features: e.target.value.split("\n").filter(s => s.trim()) };
                          setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, differences: newDiffs });
                        }}
                        rows={4}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3&#10;Feature 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={diff.image}
                        onChange={(e) => {
                          const newDiffs = [...iluxuryDifferencePageForm.differences];
                          newDiffs[index] = { ...newDiffs[index], image: e.target.value };
                          setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, differences: newDiffs });
                        }}
                        placeholder="/api/assets/image.jpg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Why It Matters Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Why It Matters Section</CardTitle>
              <CardDescription>Edit the closing section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={iluxuryDifferencePageForm.whyItMattersTitle} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, whyItMattersTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section Text</Label>
                  <Textarea value={iluxuryDifferencePageForm.whyItMattersText} onChange={(e) => setIluxuryDifferencePageForm({ ...iluxuryDifferencePageForm, whyItMattersText: e.target.value })} rows={4} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={() => updateIluxuryDifferencePageMutation.mutate(iluxuryDifferencePageForm)} disabled={updateIluxuryDifferencePageMutation.isPending}>
              {updateIluxuryDifferencePageMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Your Experience Page Edit View
  if (currentView === "your-experience") {
    return (
      <AdminLayout title="Edit Your Experience Page" description="Manage the content of the Your Experience Includes page">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentView("list")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Hero Section</CardTitle>
              <CardDescription>Edit the hero title, subtitle, and background image</CardDescription>
            </CardHeader>
            <CardContent>
              {yourExperiencePageLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hero Subtitle (small text above title)</Label>
                    <Input value={yourExperiencePageForm.heroSubtitle} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, heroSubtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input value={yourExperiencePageForm.heroTitle} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, heroTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Description</Label>
                    <Textarea value={yourExperiencePageForm.heroDescription} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, heroDescription: e.target.value })} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Background Image URL</Label>
                    <Input value={yourExperiencePageForm.heroImage} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, heroImage: e.target.value })} placeholder="/api/assets/uploads/image.jpg" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Introduction Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Introduction Section</CardTitle>
              <CardDescription>Edit the "A Complete Luxury Experience" introduction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Introduction Title</Label>
                  <Input value={yourExperiencePageForm.introTitle} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, introTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Introduction Text</Label>
                  <Textarea value={yourExperiencePageForm.introText} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, introText: e.target.value })} rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiences Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Experience Cards</CardTitle>
              <CardDescription>Edit the 7 experience cards with icons, descriptions, and highlights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {yourExperiencePageForm.experiences.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium text-lg">Experience {index + 1}: {exp.title}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => {
                            const newExps = [...yourExperiencePageForm.experiences];
                            newExps[index] = { ...newExps[index], title: e.target.value };
                            setYourExperiencePageForm({ ...yourExperiencePageForm, experiences: newExps });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon Name (Lucide)</Label>
                        <Select
                          value={exp.icon}
                          onValueChange={(v) => {
                            const newExps = [...yourExperiencePageForm.experiences];
                            newExps[index] = { ...newExps[index], icon: v };
                            setYourExperiencePageForm({ ...yourExperiencePageForm, experiences: newExps });
                          }}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Crown">Crown</SelectItem>
                            <SelectItem value="Users">Users</SelectItem>
                            <SelectItem value="BookOpen">BookOpen</SelectItem>
                            <SelectItem value="Hotel">Hotel</SelectItem>
                            <SelectItem value="UtensilsCrossed">UtensilsCrossed</SelectItem>
                            <SelectItem value="Landmark">Landmark</SelectItem>
                            <SelectItem value="Heart">Heart</SelectItem>
                            <SelectItem value="Star">Star</SelectItem>
                            <SelectItem value="Plane">Plane</SelectItem>
                            <SelectItem value="Map">Map</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExps = [...yourExperiencePageForm.experiences];
                          newExps[index] = { ...newExps[index], description: e.target.value };
                          setYourExperiencePageForm({ ...yourExperiencePageForm, experiences: newExps });
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Highlights (one per line, 4 recommended)</Label>
                      <Textarea
                        value={exp.highlights.join("\n")}
                        onChange={(e) => {
                          const newExps = [...yourExperiencePageForm.experiences];
                          newExps[index] = { ...newExps[index], highlights: e.target.value.split("\n") };
                          setYourExperiencePageForm({ ...yourExperiencePageForm, experiences: newExps });
                        }}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={exp.image}
                        onChange={(e) => {
                          const newExps = [...yourExperiencePageForm.experiences];
                          newExps[index] = { ...newExps[index], image: e.target.value };
                          setYourExperiencePageForm({ ...yourExperiencePageForm, experiences: newExps });
                        }}
                        placeholder="/api/assets/uploads/image.jpg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Summary Section</CardTitle>
              <CardDescription>Edit the "All This and More" summary section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Summary Title</Label>
                  <Input value={yourExperiencePageForm.summaryTitle} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, summaryTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Summary Description</Label>
                  <Textarea value={yourExperiencePageForm.summaryDescription} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, summaryDescription: e.target.value })} rows={2} />
                </div>

                <div className="space-y-4 mt-4">
                  <Label className="text-base font-semibold">Summary Cards (3 cards)</Label>
                  {yourExperiencePageForm.summaryCards.map((card, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="space-y-2">
                        <Label>Card {index + 1} Title</Label>
                        <Input
                          value={card.title}
                          onChange={(e) => {
                            const newCards = [...yourExperiencePageForm.summaryCards];
                            newCards[index] = { ...newCards[index], title: e.target.value };
                            setYourExperiencePageForm({ ...yourExperiencePageForm, summaryCards: newCards });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Card {index + 1} Description</Label>
                        <Textarea
                          value={card.description}
                          onChange={(e) => {
                            const newCards = [...yourExperiencePageForm.summaryCards];
                            newCards[index] = { ...newCards[index], description: e.target.value };
                            setYourExperiencePageForm({ ...yourExperiencePageForm, summaryCards: newCards });
                          }}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input value={yourExperiencePageForm.ctaButtonText} onChange={(e) => setYourExperiencePageForm({ ...yourExperiencePageForm, ctaButtonText: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={() => updateYourExperiencePageMutation.mutate(yourExperiencePageForm)} disabled={updateYourExperiencePageMutation.isPending}>
              {updateYourExperiencePageMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Trusted Worldwide Page Edit View
  if (currentView === "trusted-worldwide") {
    return (
      <AdminLayout title="Edit Trusted Worldwide Page" description="Manage the content of the Trusted Worldwide page">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentView("list")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Hero Section</CardTitle>
              <CardDescription>Edit the hero title, subtitle, and background image</CardDescription>
            </CardHeader>
            <CardContent>
              {trustedWorldwidePageLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hero Subtitle (small text above title)</Label>
                    <Input value={trustedWorldwidePageForm.heroSubtitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, heroSubtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input value={trustedWorldwidePageForm.heroTitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, heroTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Description</Label>
                    <Textarea value={trustedWorldwidePageForm.heroDescription} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, heroDescription: e.target.value })} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Background Image URL</Label>
                    <Input value={trustedWorldwidePageForm.heroImage} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, heroImage: e.target.value })} placeholder="/api/assets/uploads/image.jpg" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Trust Indicators (Stats)</CardTitle>
              <CardDescription>Edit the 4 stats displayed below the hero</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trustedWorldwidePageForm.stats.map((stat, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>Stat {index + 1} Value</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...trustedWorldwidePageForm.stats];
                          newStats[index] = { ...newStats[index], value: e.target.value };
                          setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, stats: newStats });
                        }}
                        placeholder="500+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stat {index + 1} Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...trustedWorldwidePageForm.stats];
                          newStats[index] = { ...newStats[index], label: e.target.value };
                          setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, stats: newStats });
                        }}
                        placeholder="Happy Travelers"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partners Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Partners Section</CardTitle>
              <CardDescription>Edit the partners section header and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input value={trustedWorldwidePageForm.partnersSubtitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, partnersSubtitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={trustedWorldwidePageForm.partnersTitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, partnersTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section Description</Label>
                  <Textarea value={trustedWorldwidePageForm.partnersDescription} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, partnersDescription: e.target.value })} rows={2} />
                </div>

                <div className="space-y-6 mt-6">
                  <Label className="text-base font-semibold">Partner Categories</Label>
                  {trustedWorldwidePageForm.partnerCategories.map((category, catIndex) => (
                    <div key={catIndex} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category Name</Label>
                          <Input
                            value={category.category}
                            onChange={(e) => {
                              const newCats = [...trustedWorldwidePageForm.partnerCategories];
                              newCats[catIndex] = { ...newCats[catIndex], category: e.target.value };
                              setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, partnerCategories: newCats });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={category.icon}
                            onValueChange={(v) => {
                              const newCats = [...trustedWorldwidePageForm.partnerCategories];
                              newCats[catIndex] = { ...newCats[catIndex], icon: v };
                              setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, partnerCategories: newCats });
                            }}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Building2">Building (Hotels)</SelectItem>
                              <SelectItem value="Plane">Plane (Services)</SelectItem>
                              <SelectItem value="Award">Award (Certifications)</SelectItem>
                              <SelectItem value="Globe">Globe</SelectItem>
                              <SelectItem value="Star">Star</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Partners (one per line: Name | Description)</Label>
                        <Textarea
                          value={category.items.map(item => `${item.name} | ${item.description}`).join("\n")}
                          onChange={(e) => {
                            const newCats = [...trustedWorldwidePageForm.partnerCategories];
                            newCats[catIndex] = {
                              ...newCats[catIndex],
                              items: e.target.value.split("\n").map(line => {
                                const [name, description] = line.split("|").map(s => s.trim());
                                return { name: name || "", description: description || "" };
                              })
                            };
                            setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, partnerCategories: newCats });
                          }}
                          rows={6}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Quote className="h-5 w-5" /> Testimonials Section</CardTitle>
              <CardDescription>Edit the testimonials section header and reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input value={trustedWorldwidePageForm.testimonialsSubtitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonialsSubtitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={trustedWorldwidePageForm.testimonialsTitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonialsTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section Description</Label>
                  <Textarea value={trustedWorldwidePageForm.testimonialsDescription} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonialsDescription: e.target.value })} rows={2} />
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Testimonials</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTrustedWorldwidePageForm({
                          ...trustedWorldwidePageForm,
                          testimonials: [...trustedWorldwidePageForm.testimonials, { text: "", author: "", location: "", trip: "", rating: 5 }]
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Testimonial
                    </Button>
                  </div>
                  {trustedWorldwidePageForm.testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Testimonial {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const newTestimonials = trustedWorldwidePageForm.testimonials.filter((_, i) => i !== index);
                            setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonials: newTestimonials });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Quote Text</Label>
                        <Textarea
                          value={testimonial.text}
                          onChange={(e) => {
                            const newTestimonials = [...trustedWorldwidePageForm.testimonials];
                            newTestimonials[index] = { ...newTestimonials[index], text: e.target.value };
                            setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonials: newTestimonials });
                          }}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Author Name</Label>
                          <Input
                            value={testimonial.author}
                            onChange={(e) => {
                              const newTestimonials = [...trustedWorldwidePageForm.testimonials];
                              newTestimonials[index] = { ...newTestimonials[index], author: e.target.value };
                              setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonials: newTestimonials });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={testimonial.location}
                            onChange={(e) => {
                              const newTestimonials = [...trustedWorldwidePageForm.testimonials];
                              newTestimonials[index] = { ...newTestimonials[index], location: e.target.value };
                              setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonials: newTestimonials });
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Trip Name</Label>
                          <Input
                            value={testimonial.trip}
                            onChange={(e) => {
                              const newTestimonials = [...trustedWorldwidePageForm.testimonials];
                              newTestimonials[index] = { ...newTestimonials[index], trip: e.target.value };
                              setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonials: newTestimonials });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating (1-5)</Label>
                          <Select
                            value={testimonial.rating.toString()}
                            onValueChange={(v) => {
                              const newTestimonials = [...trustedWorldwidePageForm.testimonials];
                              newTestimonials[index] = { ...newTestimonials[index], rating: parseInt(v) };
                              setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, testimonials: newTestimonials });
                            }}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 Stars</SelectItem>
                              <SelectItem value="4">4 Stars</SelectItem>
                              <SelectItem value="3">3 Stars</SelectItem>
                              <SelectItem value="2">2 Stars</SelectItem>
                              <SelectItem value="1">1 Star</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust & Safety Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Trust & Safety Section</CardTitle>
              <CardDescription>Edit the trust & safety section content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={trustedWorldwidePageForm.trustTitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, trustTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section Description</Label>
                  <Textarea value={trustedWorldwidePageForm.trustDescription} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, trustDescription: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Trust Features (one per line)</Label>
                  <Textarea
                    value={trustedWorldwidePageForm.trustFeatures.join("\n")}
                    onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, trustFeatures: e.target.value.split("\n") })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Image URL</Label>
                  <Input value={trustedWorldwidePageForm.trustImage} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, trustImage: e.target.value })} placeholder="/api/assets/uploads/image.jpg" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> CTA Section</CardTitle>
              <CardDescription>Edit the call-to-action section at the bottom</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>CTA Title</Label>
                  <Input value={trustedWorldwidePageForm.ctaTitle} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, ctaTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Description</Label>
                  <Textarea value={trustedWorldwidePageForm.ctaDescription} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, ctaDescription: e.target.value })} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Button Text</Label>
                    <Input value={trustedWorldwidePageForm.ctaPrimaryText} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, ctaPrimaryText: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Button Text</Label>
                    <Input value={trustedWorldwidePageForm.ctaSecondaryText} onChange={(e) => setTrustedWorldwidePageForm({ ...trustedWorldwidePageForm, ctaSecondaryText: e.target.value })} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={() => updateTrustedWorldwidePageMutation.mutate(trustedWorldwidePageForm)} disabled={updateTrustedWorldwidePageMutation.isPending}>
              {updateTrustedWorldwidePageMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Home Page Edit View
  return (
    <AdminLayout title="Edit Home Page" description="Manage the content sections of the home page">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setCurrentView("list")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Pages
        </Button>
      </div>

      <div className="space-y-8">
        {/* Hero Slides Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hero Slider</CardTitle>
                <CardDescription>Manage the hero slider videos/images and CTAs</CardDescription>
              </div>
              <Button onClick={openNewSlide}>
                <Plus className="h-4 w-4 mr-2" />
                Add Slide
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {slidesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : slides.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No slides yet. Add your first slide.</p>
            ) : (
              <div className="space-y-3">
                {slides.map((slide) => (
                  <div key={slide.id} className={`flex items-center gap-4 p-4 border rounded-lg ${!slide.isActive ? "opacity-50" : ""}`}>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      {slide.mediaType === "video" ? <Video className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{slide.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{slide.ctaText || "No CTA"}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${slide.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => openEditSlide(slide)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { setSlideToDelete(slide.id); setDeleteSlideDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Siwa Section */}
        <Card>
          <CardHeader>
            <CardTitle>Discover Siwa Oasis Section</CardTitle>
            <CardDescription>Edit the video/image and content for the Siwa section</CardDescription>
          </CardHeader>
          <CardContent>
            {siwaLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); updateSiwaMutation.mutate(siwaForm); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Media Type</Label>
                    <Select value={siwaForm.mediaType} onValueChange={(v: "video" | "image") => setSiwaForm({ ...siwaForm, mediaType: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Media URL</Label>
                    <Input value={siwaForm.mediaUrl} onChange={(e) => setSiwaForm({ ...siwaForm, mediaUrl: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={siwaForm.title} onChange={(e) => setSiwaForm({ ...siwaForm, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={siwaForm.description} onChange={(e) => setSiwaForm({ ...siwaForm, description: e.target.value })} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CTA Text (max 150)</Label>
                    <Input value={siwaForm.ctaText} onChange={(e) => setSiwaForm({ ...siwaForm, ctaText: e.target.value.slice(0, 150) })} maxLength={150} />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Link</Label>
                    <Input value={siwaForm.ctaLink} onChange={(e) => setSiwaForm({ ...siwaForm, ctaLink: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch checked={siwaForm.isActive} onCheckedChange={(c) => setSiwaForm({ ...siwaForm, isActive: c })} />
                    <Label>Section visible</Label>
                  </div>
                  <Button type="submit" disabled={updateSiwaMutation.isPending}>
                    {updateSiwaMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Guest Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle>I.LUXURYEGYPT Guest Experiences Section</CardTitle>
            <CardDescription>Edit the title, description and tagline</CardDescription>
          </CardHeader>
          <CardContent>
            {guestExpLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); updateGuestExpMutation.mutate(guestExpForm); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={guestExpForm.title} onChange={(e) => setGuestExpForm({ ...guestExpForm, title: e.target.value })} placeholder="I.LUXURYEGYPT Guest Experiences" required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={guestExpForm.description} onChange={(e) => setGuestExpForm({ ...guestExpForm, description: e.target.value })} rows={3} placeholder="Step into a world where heritage and luxury intertwine..." />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={guestExpForm.tagline} onChange={(e) => setGuestExpForm({ ...guestExpForm, tagline: e.target.value })} placeholder="Your journey, our promise." />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch checked={guestExpForm.isActive} onCheckedChange={(c) => setGuestExpForm({ ...guestExpForm, isActive: c })} />
                    <Label>Section visible</Label>
                  </div>
                  <Button type="submit" disabled={updateGuestExpMutation.isPending}>
                    {updateGuestExpMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Why Choose Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose I.LUXURYEGYPT Section</CardTitle>
            <CardDescription>Edit the section title and subtitle</CardDescription>
          </CardHeader>
          <CardContent>
            {whyChooseLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); updateWhyChooseMutation.mutate(whyChooseForm); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={whyChooseForm.title} onChange={(e) => setWhyChooseForm({ ...whyChooseForm, title: e.target.value })} placeholder="Why Choose I.LUXURYEGYPT?" required />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea value={whyChooseForm.subtitle} onChange={(e) => setWhyChooseForm({ ...whyChooseForm, subtitle: e.target.value })} rows={2} placeholder="Discover what sets us apart..." />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch checked={whyChooseForm.isActive} onCheckedChange={(c) => setWhyChooseForm({ ...whyChooseForm, isActive: c })} />
                    <Label>Section visible</Label>
                  </div>
                  <Button type="submit" disabled={updateWhyChooseMutation.isPending}>
                    {updateWhyChooseMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Why Choose Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Why Choose Cards (4 Cards)</CardTitle>
                <CardDescription>Manage the 4 feature cards with images and content</CardDescription>
              </div>
              <Button onClick={openNewCard} disabled={cards.length >= 4}>
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {cardsLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : cards.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No cards yet. Add your first card.</p>
            ) : (
              <div className="space-y-3">
                {cards.map((card) => (
                  <div key={card.id} className={`flex items-center gap-4 p-4 border rounded-lg ${!card.isActive ? "opacity-50" : ""}`}>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt={card.title} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center"><ImageIcon className="h-5 w-5" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{card.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{card.content.slice(0, 50)}...</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${card.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {card.isActive ? "Active" : "Inactive"}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => openEditCard(card)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { setCardToDelete(card.id); setDeleteCardDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>What Our Guests Say (Reviews)</CardTitle>
                <CardDescription>Manage guest testimonials and reviews</CardDescription>
              </div>
              <Button onClick={openNewTestimonial}>
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {testimonialsLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : testimonials.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No reviews yet. Add your first review.</p>
            ) : (
              <div className="space-y-3">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className={`flex items-center gap-4 p-4 border rounded-lg ${!testimonial.isActive ? "opacity-50" : ""}`}>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="flex items-center gap-1 text-accent">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">"{testimonial.quote.slice(0, 60)}..."</p>
                      <p className="text-sm text-muted-foreground">{testimonial.author} {testimonial.location && `- ${testimonial.location}`}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${testimonial.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {testimonial.isActive ? "Active" : "Inactive"}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => openEditTestimonial(testimonial)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { setTestimonialToDelete(testimonial.id); setDeleteTestimonialDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Info (CTA Section)</CardTitle>
            <CardDescription>Edit the phone number and email displayed above the newsletter</CardDescription>
          </CardHeader>
          <CardContent>
            {contactCtaLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); updateContactCtaMutation.mutate(contactCtaForm); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</Label>
                    <Input value={contactCtaForm.phone} onChange={(e) => setContactCtaForm({ ...contactCtaForm, phone: e.target.value })} placeholder="+20 (0) 123 456 789" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email Address</Label>
                    <Input type="email" value={contactCtaForm.email} onChange={(e) => setContactCtaForm({ ...contactCtaForm, email: e.target.value })} placeholder="concierge@iluxuryegypt.com" required />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateContactCtaMutation.isPending}>
                    {updateContactCtaMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hero Slide Dialog */}
      <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Edit Hero Slide" : "Add Hero Slide"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); editingSlide ? updateSlideMutation.mutate({ id: editingSlide.id, data: slideForm }) : createSlideMutation.mutate(slideForm); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Media Type</Label>
                <Select value={slideForm.mediaType} onValueChange={(v: "video" | "image") => setSlideForm({ ...slideForm, mediaType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={slideForm.sortOrder} onChange={(e) => setSlideForm({ ...slideForm, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Media URL *</Label>
              <Input value={slideForm.mediaUrl} onChange={(e) => setSlideForm({ ...slideForm, mediaUrl: e.target.value })} required />
            </div>
            {slideForm.mediaType === "video" && (
              <div className="space-y-2">
                <Label>Poster Image URL</Label>
                <Input value={slideForm.posterUrl} onChange={(e) => setSlideForm({ ...slideForm, posterUrl: e.target.value })} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={slideForm.subtitle} onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={slideForm.title} onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={slideForm.description} onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text (max 150)</Label>
                <Input value={slideForm.ctaText} onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value.slice(0, 150) })} maxLength={150} />
              </div>
              <div className="space-y-2">
                <Label>CTA Link</Label>
                <Input value={slideForm.ctaLink} onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={slideForm.isActive} onCheckedChange={(c) => setSlideForm({ ...slideForm, isActive: c })} />
              <Label>Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSlideDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createSlideMutation.isPending || updateSlideMutation.isPending}>
                {(createSlideMutation.isPending || updateSlideMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingSlide ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Why Choose Card Dialog */}
      <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? "Edit Card" : "Add Card"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); editingCard ? updateCardMutation.mutate({ id: editingCard.id, data: cardForm }) : createCardMutation.mutate(cardForm); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={cardForm.sortOrder} onChange={(e) => setCardForm({ ...cardForm, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={cardForm.title} onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL *</Label>
              <Input value={cardForm.imageUrl} onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea value={cardForm.content} onChange={(e) => setCardForm({ ...cardForm, content: e.target.value })} rows={4} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={cardForm.isActive} onCheckedChange={(c) => setCardForm({ ...cardForm, isActive: c })} />
              <Label>Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCardDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createCardMutation.isPending || updateCardMutation.isPending}>
                {(createCardMutation.isPending || updateCardMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingCard ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Slide Dialog */}
      <Dialog open={deleteSlideDialogOpen} onOpenChange={setDeleteSlideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Hero Slide</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSlideDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => slideToDelete && deleteSlideMutation.mutate(slideToDelete)} disabled={deleteSlideMutation.isPending}>
              {deleteSlideMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Card Dialog */}
      <Dialog open={deleteCardDialogOpen} onOpenChange={setDeleteCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCardDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => cardToDelete && deleteCardMutation.mutate(cardToDelete)} disabled={deleteCardMutation.isPending}>
              {deleteCardMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Review" : "Add Review"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); editingTestimonial ? updateTestimonialMutation.mutate({ id: editingTestimonial.id, data: testimonialForm }) : createTestimonialMutation.mutate(testimonialForm); }} className="space-y-4">
            <div className="space-y-2">
              <Label>Quote / Review *</Label>
              <Textarea value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} rows={4} required placeholder="From the moment we arrived, every detail exceeded our expectations..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author Name *</Label>
                <Input value={testimonialForm.author} onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })} required placeholder="Sarah & Michael" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={testimonialForm.location} onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })} placeholder="UK" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Select value={testimonialForm.rating.toString()} onValueChange={(v) => setTestimonialForm({ ...testimonialForm, rating: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={testimonialForm.sortOrder} onChange={(e) => setTestimonialForm({ ...testimonialForm, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={testimonialForm.isActive} onCheckedChange={(c) => setTestimonialForm({ ...testimonialForm, isActive: c })} />
              <Label>Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}>
                {(createTestimonialMutation.isPending || updateTestimonialMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingTestimonial ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Testimonial Dialog */}
      <Dialog open={deleteTestimonialDialogOpen} onOpenChange={setDeleteTestimonialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTestimonialDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => testimonialToDelete && deleteTestimonialMutation.mutate(testimonialToDelete)} disabled={deleteTestimonialMutation.isPending}>
              {deleteTestimonialMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
