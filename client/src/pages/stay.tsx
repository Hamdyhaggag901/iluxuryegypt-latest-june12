import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wifi, Car, Utensils, Waves, Sparkles, Shield, Search, Filter, X } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import type { Hotel } from "@shared/schema";

// Import luxury Egyptian images
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";
import poolRiverImage from "@assets/pool-and-rivet_1757457083793.jpg";
import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";
import pyramidLobbyImage from "@assets/pyramid-from-lobby_1757459228637.jpeg";
import menahousePyramidImage from "@assets/the-pyramid-from-mena-house_1757459228638.jpeg";
import khanKhaliliImage from "@assets/khan-khalili-restaurant_1757459228636.jpeg";
import columnHallImage from "@assets/inside-the-column-hall_1757699232094.jpg";
import islamicDistrictImage from "@assets/islamic-district-at-dawn_1757699232100.jpg";
import poolsideDrinkImage from "@assets/pool-side-drink_1757699232100.jpg";
import siwaPalmTreesImage from "@assets/siwa-palm-trees_1757699232101.jpg";
import luxorImage from "@assets/luxor_1757531163688.jpg";
import siwaImage from "@assets/siwa_1757531163689.jpg";
import redSeaImage from "@assets/red-sea_1757531163688.jpg";

export default function Stay() {
  useSEO({
    title: "Luxury Hotels & Stays in Egypt",
    description: "Discover Egypt's finest luxury hotels and boutique accommodations. Handpicked stays from Nile-side palaces to Red Sea resorts.",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showAllHotels, setShowAllHotels] = useState(false);

  // Fetch hotels from API
  const { data: hotelsResponse, isLoading: hotelsLoading, error: hotelsError } = useQuery({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const response = await fetch("/api/hotels");
      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }
      return response.json();
    },
  });

  // Fetch stay page content from API
  const { data: stayPageData } = useQuery({
    queryKey: ["/api/public/stay-page"],
    queryFn: async () => {
      const response = await fetch("/api/public/stay-page");
      if (!response.ok) {
        throw new Error("Failed to fetch stay page content");
      }
      return response.json();
    },
  });

  const allHotels = hotelsResponse?.hotels || [];

  // All available amenities for filtering
  const allAmenities = useMemo(() => {
    const amenitiesSet = new Set<string>();
    allHotels.forEach(hotel => hotel.amenities.forEach(amenity => amenitiesSet.add(amenity)));
    return Array.from(amenitiesSet).sort();
  }, [allHotels]);

  // Icon mapping helper
  const getIconComponent = (iconName: string, size: "small" | "large" = "large") => {
    const sizeClass = size === "large" ? "h-8 w-8 text-accent" : "h-6 w-6 text-accent";
    const icons: Record<string, JSX.Element> = {
      star: <Star className={sizeClass} />,
      waves: <Waves className={sizeClass} />,
      sparkles: <Sparkles className={sizeClass} />,
      shield: <Shield className={sizeClass} />,
      utensils: <Utensils className={sizeClass} />,
      car: <Car className={sizeClass} />,
      wifi: <Wifi className={sizeClass} />,
    };
    return icons[iconName] || <Star className={sizeClass} />;
  };

  // Default accommodation types (fallback)
  const defaultAccommodationTypes = [
    { icon: "star", title: "Luxury Hotels", description: "Five-star properties with world-class service and amenities.", count: "15+ Partners" },
    { icon: "waves", title: "Nile River Cruises", description: "Floating palaces offering all-inclusive luxury along the Nile.", count: "8+ Vessels" },
    { icon: "sparkles", title: "Desert Resorts", description: "Exclusive retreats in Egypt's most stunning desert locations.", count: "6+ Locations" },
    { icon: "shield", title: "Historic Palaces", description: "Restored heritage properties with centuries of Egyptian history.", count: "4+ Palaces" },
  ];

  // Use database values or fallbacks
  const accommodationTypes = stayPageData?.accommodationTypes?.length > 0
    ? stayPageData.accommodationTypes
    : defaultAccommodationTypes;

  // Filter and sort logic
  const filteredAndSortedHotels = useMemo(() => {
    let filtered = allHotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === "all" || hotel.region === selectedRegion;
      const matchesType = selectedType === "all" || hotel.type === selectedType;
      const matchesRating = selectedRating === "all" || hotel.rating >= parseInt(selectedRating);
      const matchesAmenities = selectedAmenities.length === 0 || 
                              selectedAmenities.some(amenity => hotel.amenities.includes(amenity));

      return matchesSearch && matchesRegion && matchesType && matchesRating && matchesAmenities;
    });

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "location":
          return a.location.localeCompare(b.location);
        default: // "recommended"
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [allHotels, searchTerm, selectedRegion, selectedType, selectedRating, selectedAmenities, sortBy]);

  const featuredHotels = allHotels.filter(hotel => hotel.featured);
  const displayedHotels = showAllHotels ? filteredAndSortedHotels : filteredAndSortedHotels.slice(0, 12);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedRegion("all");
    setSelectedType("all");
    setSelectedRating("all");
    setSelectedAmenities([]);
    setSortBy("recommended");
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const hasActiveFilters = searchTerm || selectedRegion !== "all" || selectedType !== "all" || selectedRating !== "all" || selectedAmenities.length > 0 || sortBy !== "recommended";

  // Default luxury features (fallback)
  const defaultLuxuryFeatures = [
    { icon: "utensils", title: "Gourmet Dining", description: "World-class restaurants featuring both international cuisine and authentic Egyptian flavors" },
    { icon: "sparkles", title: "Wellness & Spa", description: "Rejuvenating spa treatments inspired by ancient Egyptian wellness traditions" },
    { icon: "car", title: "VIP Transportation", description: "Private transfers in luxury vehicles with professional Egyptian drivers" },
    { icon: "shield", title: "Concierge Service", description: "24/7 dedicated concierge to arrange tours, dining, and special experiences" },
    { icon: "wifi", title: "Modern Amenities", description: "High-speed internet, business centers, and all contemporary comforts" },
    { icon: "star", title: "Exclusive Access", description: "Private entrances to attractions and VIP experiences unavailable to regular guests" },
  ];

  // Use database values or fallbacks
  const luxuryFeatures = stayPageData?.luxuryFeatures?.length > 0
    ? stayPageData.luxuryFeatures
    : defaultLuxuryFeatures;

  // Hero section data
  const heroData = stayPageData?.hero || {
    title: "Luxury Accommodations",
    subtitle: "From historic palaces to modern resorts, discover Egypt's finest luxury accommodations curated for the discerning traveler.",
    backgroundImage: luxuryHallImage,
    primaryButtonText: "Book Your Stay",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Explore Destinations",
    secondaryButtonLink: "/destinations",
  };

  // Nile section data
  const nileData = stayPageData?.nileSection || {
    title: "Nile-View Suites",
    paragraphs: [
      "Wake up to panoramic views of the legendary Nile River from your private suite. Our riverfront accommodations offer the ultimate Egyptian experience with floor-to-ceiling windows framing the timeless beauty of the world's longest river.",
      "Each suite features luxurious Egyptian cotton linens, marble bathrooms with soaking tubs, and private balconies perfect for watching feluccas sail by at sunset.",
      "Experience the magic of the Nile from the comfort of your own luxury sanctuary, where modern amenities meet ancient wonder."
    ],
    buttonText: "Reserve Nile Suite",
    buttonLink: "/contact",
    images: [suiteNileImage, poolsideDrinkImage, poolRiverImage, redSeaImage],
  };

  // CTA section data
  const ctaData = stayPageData?.cta || {
    title: "Book Your Perfect Stay",
    subtitle: "Our luxury travel specialists will secure the perfect accommodation for your Egyptian journey. From presidential suites to private villas, we ensure every stay exceeds your expectations.",
    primaryButtonText: "Contact Our Specialists",
    primaryButtonLink: "/contact",
    secondaryButtonText: "View All Destinations",
    secondaryButtonLink: "/destinations",
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
      />
    ));
  };

  // Compact Hotel Card Component
  const HotelCard = ({ hotel, isSpotlight = false }: { hotel: Hotel; isSpotlight?: boolean }) => {
    const cardClasses = isSpotlight
      ? "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
      : "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/30";

    const imageHeight = isSpotlight ? "h-80" : "h-48";
    const contentPadding = isSpotlight ? "p-6" : "p-4";

    return (
      <Card className={cardClasses} data-testid={`hotel-card-${hotel.id}`}>
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <img
            src={hotel.image}
            alt={`${hotel.name} luxury hotel in ${hotel.location}, Egypt`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            style={{ aspectRatio: '3/2' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Rating overlay */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="flex items-center space-x-1">
              {renderStars(hotel.rating)}
              <span className="ml-1 text-primary font-semibold text-xs">{hotel.rating}</span>
            </div>
          </div>

          {/* Featured badge */}
          {hotel.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-accent text-accent-foreground text-xs font-medium">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className={contentPadding}>
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-serif font-bold text-primary leading-tight ${isSpotlight ? 'text-xl' : 'text-lg'}`}>
              {hotel.name}
            </h3>
            <div className="text-right ml-2">
              <div className="text-accent font-bold text-sm">{hotel.priceTier}</div>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1 text-accent" />
            <span className="text-sm font-medium">{hotel.location}</span>
            <span className="mx-2 text-xs">•</span>
            <span className="text-xs">{hotel.type}</span>
          </div>

          {isSpotlight && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
              {hotel.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-4">
            {hotel.amenities.slice(0, isSpotlight ? 4 : 3).map((amenity, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs bg-accent/10 text-accent hover:bg-accent/20 border-0"
              >
                {amenity}
              </Badge>
            ))}
          </div>

          <Link href={`/hotel/${hotel.slug}`}>
            <Button
              className="w-full"
              size={isSpotlight ? "default" : "sm"}
              data-testid={`button-read-more-${hotel.slug}`}
            >
              Read More
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroData.backgroundImage || luxuryHallImage})`
          }}
        />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 md:mb-6 animate-fade-in">
            {heroData.title}
          </h1>
          <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed px-2">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            {heroData.primaryButtonText && (
              <Link href={heroData.primaryButtonLink || "/contact"}>
                <Button
                  size="lg"
                  className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg w-full sm:w-auto"
                  data-testid="button-book-stay"
                >
                  {heroData.primaryButtonText}
                </Button>
              </Link>
            )}
            {heroData.secondaryButtonText && (
              <Link href={heroData.secondaryButtonLink || "/destinations"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
                  data-testid="button-explore-destinations"
                >
                  {heroData.secondaryButtonText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <main>
        {/* Accommodation Types Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 md:mb-6">
                Accommodation Types
              </h2>
              <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Choose from our carefully selected portfolio of Egypt's most exclusive accommodations.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {accommodationTypes.map((type, index) => (
                <Card key={type.id || index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex justify-center mb-2 md:mb-4">
                      <div className="w-10 h-10 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-8 md:[&_svg]:w-8">
                        {getIconComponent(type.icon, "large")}
                      </div>
                    </div>
                    <h3 className="text-sm md:text-xl font-semibold text-primary mb-1 md:mb-3">{type.title}</h3>
                    <p className="text-xs md:text-base text-muted-foreground mb-2 md:mb-4 hidden sm:block">{type.description}</p>
                    <div className="text-accent font-medium text-xs md:text-sm">{type.count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Spotlight Featured Hotels Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="tracking-[0.2em] uppercase text-accent text-sm font-medium mb-4">
                Spotlight Properties
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Featured Luxury Hotels
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience Egypt's most legendary hotels, each offering a unique blend of luxury, history, and authentic Egyptian hospitality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} isSpotlight={true} />
              ))}
            </div>
          </div>
        </section>

        {/* Hotels Filter and Grid Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                All Luxury Accommodations
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our complete collection of handpicked luxury hotels across Egypt.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-accent/10 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search hotels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="hotel-search-input"
                    />
                  </div>
                </div>

                {/* Region Filter */}
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger data-testid="region-filter">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Cairo & Giza">Cairo & Giza</SelectItem>
                    <SelectItem value="Luxor">Luxor</SelectItem>
                    <SelectItem value="Aswan">Aswan</SelectItem>
                    <SelectItem value="Red Sea">Red Sea</SelectItem>
                    <SelectItem value="Alexandria">Alexandria</SelectItem>
                    <SelectItem value="Siwa">Siwa</SelectItem>
                  </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger data-testid="type-filter">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Palace">Palace</SelectItem>
                    <SelectItem value="Resort">Resort</SelectItem>
                    <SelectItem value="Cruise">Nile Cruise</SelectItem>
                    <SelectItem value="Historic">Historic</SelectItem>
                    <SelectItem value="Eco-Lodge">Eco-Lodge</SelectItem>
                  </SelectContent>
                </Select>

                {/* Rating Filter */}
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger data-testid="rating-filter">
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>

                {/* Amenities Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="justify-between"
                      data-testid="amenities-filter"
                      aria-label="Filter by amenities"
                    >
                      <span>
                        {selectedAmenities.length > 0 
                          ? `${selectedAmenities.length} Amenities`
                          : "Amenities"
                        }
                      </span>
                      <Filter className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="start">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Filter by Amenities</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                        {allAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              id={`amenity-${amenity}`}
                              checked={selectedAmenities.includes(amenity)}
                              onCheckedChange={() => toggleAmenity(amenity)}
                              data-testid={`amenity-checkbox-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <label
                              htmlFor={`amenity-${amenity}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedAmenities.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAmenities([])}
                          className="w-full mt-2"
                          data-testid="clear-amenities-button"
                        >
                          Clear Amenities
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="sort-filter">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Summary and Clear */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-accent/10">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {searchTerm && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                      {selectedRegion !== "all" && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          Region: {selectedRegion}
                        </Badge>
                      )}
                      {selectedType !== "all" && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          Type: {selectedType}
                        </Badge>
                      )}
                      {selectedRating !== "all" && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {selectedRating}+ Stars
                        </Badge>
                      )}
                      {selectedAmenities.length > 0 && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {selectedAmenities.length} Amenities
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Showing {filteredAndSortedHotels.length} of {allHotels.length} hotels
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-muted-foreground hover:text-primary"
                        data-testid="clear-all-filters-button"
                        aria-label="Clear all active filters"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} isSpotlight={false} />
              ))}
            </div>

            {/* Show More Button */}
            {!showAllHotels && filteredAndSortedHotels.length > 12 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAllHotels(true)}
                  className="px-8 py-4"
                  data-testid="show-more-hotels-button"
                  aria-label={`Show all ${filteredAndSortedHotels.length} hotels`}
                >
                  Show All {filteredAndSortedHotels.length} Hotels
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredAndSortedHotels.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                  <p>Try adjusting your search criteria or clearing the filters.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="mt-4"
                  data-testid="no-results-clear-filters-button"
                  aria-label="Clear all filters to show all hotels"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Luxury Features Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Luxury Features & Services
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every accommodation in our portfolio offers world-class amenities and personalized service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {luxuryFeatures.map((feature, index) => (
                <div key={feature.id || index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      {getIconComponent(feature.icon, "small")}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nile Suite Showcase */}
        <section className="py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-8">
                  {nileData.title}
                </h2>
                <div className="space-y-6 text-lg text-primary-foreground/90 leading-relaxed">
                  {nileData.paragraphs?.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                {nileData.buttonText && (
                  <div className="mt-8">
                    <Link href={nileData.buttonLink || "/contact"}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        data-testid="button-nile-suite"
                      >
                        {nileData.buttonText}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src={nileData.images?.[0] || suiteNileImage}
                    alt="Luxury Nile suite interior"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                  <img
                    src={nileData.images?.[1] || poolsideDrinkImage}
                    alt="Poolside luxury service"
                    className="w-full h-32 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img
                    src={nileData.images?.[2] || poolRiverImage}
                    alt="Pool with Nile views"
                    className="w-full h-32 object-cover rounded-lg shadow-lg"
                  />
                  <img
                    src={nileData.images?.[3] || redSeaImage}
                    alt="Red Sea resort views"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-accent/20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {ctaData.title}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                {ctaData.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {ctaData.primaryButtonText && (
                  <Link href={ctaData.primaryButtonLink || "/contact"}>
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg min-w-[200px]"
                      data-testid="button-contact-specialists"
                    >
                      {ctaData.primaryButtonText}
                    </Button>
                  </Link>
                )}
                {ctaData.secondaryButtonText && (
                  <Link href={ctaData.secondaryButtonLink || "/destinations"}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 text-lg min-w-[200px]"
                      data-testid="button-view-destinations"
                    >
                      {ctaData.secondaryButtonText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}