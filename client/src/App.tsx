import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, lazy, Suspense } from "react";
import WhatsAppButton from "@/components/whatsapp-button";
import SiteMetadata from "@/components/site-metadata";

// Eagerly loaded (critical path)
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazy loaded - Public pages
const Contact = lazy(() => import("@/pages/contact"));
const Destinations = lazy(() => import("@/pages/destinations"));
const DestinationDetail = lazy(() => import("@/pages/destination-detail"));
const NileCruises = lazy(() => import("@/pages/nile-cruises"));
const ASaraNileCruise = lazy(() => import("@/pages/tours/a-sara-nile-cruise"));
const Experiences = lazy(() => import("@/pages/experiences"));
const Stay = lazy(() => import("@/pages/stay"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const HotelDetail = lazy(() => import("@/pages/hotel-detail"));
const TourDetail = lazy(() => import("@/pages/tour-detail"));
const CategoryDetail = lazy(() => import("@/pages/category-detail"));
const FAQPage = lazy(() => import("@/pages/faq"));
const TailorMade = lazy(() => import("@/pages/tailor-made"));

// Lazy loaded - About pages
const WhoWeAre = lazy(() => import("@/pages/about/who-we-are"));
const ILuxuryDifference = lazy(() => import("@/pages/about/iluxury-difference"));
const YourExperience = lazy(() => import("@/pages/about/your-experience"));
const TrustedWorldwide = lazy(() => import("@/pages/about/trusted-worldwide"));

// Lazy loaded - Experience packages
const ClassicEgypt = lazy(() => import("@/pages/classic-egypt"));
const UltraLuxury = lazy(() => import("@/pages/ultra-luxury"));
const FamilyLuxury = lazy(() => import("@/pages/family-luxury"));
const SpiritualJourneys = lazy(() => import("@/pages/spiritual-journeys"));
const AdventureTours = lazy(() => import("@/pages/adventure-tours"));

// Lazy loaded - Legal pages
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsConditions = lazy(() => import("@/pages/terms-conditions"));
const CookiePolicy = lazy(() => import("@/pages/cookie-policy"));
const ResponsibleTravel = lazy(() => import("@/pages/responsible-travel"));
const Disclaimer = lazy(() => import("@/pages/disclaimer"));

// Lazy loaded - Admin pages
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AdminInquiries = lazy(() => import("@/pages/admin-inquiries"));
const AdminTours = lazy(() => import("@/pages/admin-tours"));
const AdminToursNew = lazy(() => import("@/pages/admin-tours-new"));
const AdminToursEdit = lazy(() => import("@/pages/admin-tours-edit"));
const AdminToursBulk = lazy(() => import("@/pages/admin-tours-bulk"));
const AdminHotels = lazy(() => import("@/pages/admin-hotels"));
const AdminHotelsNew = lazy(() => import("@/pages/admin-hotels-new"));
const AdminHotelsEdit = lazy(() => import("@/pages/admin-hotels-edit"));
const AdminDestinations = lazy(() => import("@/pages/admin-destinations"));
const AdminDestinationsNew = lazy(() => import("@/pages/admin-destinations-new"));
const AdminDestinationsEdit = lazy(() => import("@/pages/admin-destinations-edit"));
const AdminPackages = lazy(() => import("@/pages/admin-packages"));
const AdminPackageForm = lazy(() => import("@/pages/admin-package-form"));
const AdminCategories = lazy(() => import("@/pages/admin-categories"));
const AdminPosts = lazy(() => import("@/pages/admin-posts"));
const AdminPages = lazy(() => import("@/pages/admin-pages"));
const AdminMedia = lazy(() => import("@/pages/admin-media"));
const AdminSettings = lazy(() => import("@/pages/admin-settings"));
const AdminHeader = lazy(() => import("@/pages/admin-header"));
const AdminFooter = lazy(() => import("@/pages/admin-footer"));
const AdminFAQ = lazy(() => import("@/pages/admin-faq"));
const AdminNewsletter = lazy(() => import("@/pages/admin-newsletter"));
const AdminTourBookings = lazy(() => import("@/pages/admin-tour-bookings"));
const AdminBrochureDownloads = lazy(() => import("@/pages/admin-brochure-downloads"));
const AdminPageEdits = lazy(() => import("@/pages/admin-page-edits"));
const AdminStayPage = lazy(() => import("@/pages/admin-stay-page"));

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  return null;
}

// Page transition wrapper
function PageWrapper({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen" />}>
        <PageWrapper>
          <Switch>
            {/* Main pages */}
            <Route path="/" component={Home} />
            <Route path="/contact" component={Contact} />

            {/* About pages */}
            <Route path="/about/who-we-are" component={WhoWeAre} />
            <Route path="/about/iluxury-difference" component={ILuxuryDifference} />
            <Route path="/about/your-experience" component={YourExperience} />
            <Route path="/about/trusted-worldwide" component={TrustedWorldwide} />

            {/* Destinations */}
            <Route path="/destinations" component={Destinations} />
            <Route path="/destinations/:slug" component={DestinationDetail} />

            {/* Experiences */}
            <Route path="/egypt-tour-packages" component={Experiences} />
            <Route path="/egypt-tour-packages/classic-egypt" component={ClassicEgypt} />
            <Route path="/egypt-tour-packages/ultra-luxury" component={UltraLuxury} />
            <Route path="/egypt-tour-packages/family-luxury" component={FamilyLuxury} />
            <Route path="/egypt-tour-packages/spiritual-journeys" component={SpiritualJourneys} />
            <Route path="/egypt-tour-packages/:slug" component={CategoryDetail} />
            <Route path="/egypt-day-tours" component={AdventureTours} />
            <Route path="/egypt-day-tours/:slug" component={CategoryDetail} />
            <Route path="/egypt-nile-cruise-tours" component={NileCruises} />
            <Route path="/egypt-nile-cruise-tours/:slug" component={CategoryDetail} />

            {/* Nile Cruises (legacy) */}
            <Route path="/nile-cruises" component={NileCruises} />
            <Route path="/nile-cruises/:slug" component={ASaraNileCruise} />

            {/* Stays */}
            <Route path="/stay" component={Stay} />
            <Route path="/hotel/:slug" component={HotelDetail} />

            {/* Blog */}
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />

            {/* Categories */}
            <Route path="/categories/:slug" component={CategoryDetail} />

            {/* FAQ */}
            <Route path="/faq" component={FAQPage} />

            {/* Tailor Made */}
            <Route path="/tailor-made" component={TailorMade} />

            {/* Legal pages */}
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-conditions" component={TermsConditions} />
            <Route path="/cookie-policy" component={CookiePolicy} />
            <Route path="/responsible-travel" component={ResponsibleTravel} />
            <Route path="/disclaimer" component={Disclaimer} />

            {/* Admin pages */}
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/inquiries" component={AdminInquiries} />
            <Route path="/admin/tours" component={AdminTours} />
            <Route path="/admin/tours/new" component={AdminToursNew} />
            <Route path="/admin/tours/edit/:id" component={AdminToursEdit} />
            <Route path="/admin/tours/bulk" component={AdminToursBulk} />
            <Route path="/admin/hotels" component={AdminHotels} />
            <Route path="/admin/hotels/new" component={AdminHotelsNew} />
            <Route path="/admin/hotels/edit/:id" component={AdminHotelsEdit} />
            <Route path="/admin/destinations" component={AdminDestinations} />
            <Route path="/admin/destinations/new" component={AdminDestinationsNew} />
            <Route path="/admin/destinations/edit/:id" component={AdminDestinationsEdit} />
            <Route path="/admin/packages" component={AdminPackages} />
            <Route path="/admin/packages/new" component={AdminPackageForm} />
            <Route path="/admin/packages/edit/:id" component={AdminPackageForm} />
            <Route path="/admin/categories" component={AdminCategories} />
            <Route path="/admin/posts" component={AdminPosts} />
            <Route path="/admin/pages" component={AdminPages} />
            <Route path="/admin/media" component={AdminMedia} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route path="/admin/header" component={AdminHeader} />
            <Route path="/admin/footer" component={AdminFooter} />
            <Route path="/admin/faq" component={AdminFAQ} />
            <Route path="/admin/newsletter" component={AdminNewsletter} />
            <Route path="/admin/tour-bookings" component={AdminTourBookings} />
            <Route path="/admin/brochure-downloads" component={AdminBrochureDownloads} />
            <Route path="/admin/page-edits" component={AdminPageEdits} />
            <Route path="/admin/stay-page" component={AdminStayPage} />

            {/* Tour detail - catch-all for tour slugs (must be before 404) */}
            <Route path="/:slug" component={TourDetail} />

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </PageWrapper>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteMetadata />
        <Toaster />
        <Router />
        <WhatsAppButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
