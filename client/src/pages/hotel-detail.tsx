
import { useRoute } from "wouter";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Sparkles, Users, Bed } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Hotel, Room } from "@shared/schema";

export default function HotelDetail() {
  const [match, params] = useRoute("/hotel/:id");

  if (!match || !params?.id) {
    return <div>Hotel not found</div>;
  }

  // Fetch specific hotel data from API
  const { data: hotelResponse, isLoading, error } = useQuery({
    queryKey: ["/api/hotels", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/hotels/${params.id}`);
      if (!response.ok) {
        throw new Error("Hotel not found");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading hotel details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !hotelResponse?.success) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Hotel Not Found</h1>
            <p className="text-muted-foreground mb-8">The hotel you're looking for doesn't exist.</p>
            <Link href="/stay">
              <Button>Return to Hotels</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hotel = hotelResponse.hotel;
  const rooms = (hotel.rooms || []) as Room[];
  const highlights = (hotel.highlights || []) as string[];
  const gallery = (hotel.gallery || []) as string[];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${hotel.image})`
          }}
        />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center mb-2 md:mb-4 [&_svg]:w-3 [&_svg]:h-3 md:[&_svg]:w-5 md:[&_svg]:h-5">
            {renderStars(hotel.rating)}
            <span className="ml-2 text-sm md:text-xl font-medium">{hotel.rating} Star</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-serif font-bold mb-3 md:mb-6 animate-fade-in px-2">
            {hotel.name}
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center mb-4 md:mb-6 text-sm md:text-xl gap-1 sm:gap-0">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 text-accent" />
              <span>{hotel.location}, {hotel.region}</span>
            </div>
            <span className="hidden sm:inline mx-4">•</span>
            <span>{hotel.type}</span>
          </div>
          <p className="text-sm md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto px-2 line-clamp-3 md:line-clamp-none">
            {hotel.description}
          </p>
          {rooms.length > 0 && (
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="outline"
                className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-view-rooms"
              >
                View Rooms & Suites
              </Button>
            </div>
          )}
        </div>
      </section>

      <main>
        {/* Hotel Overview */}
        <section className="py-10 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-3 md:mb-6">About {hotel.name}</h2>
              <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
              <div className="lg:col-span-2 space-y-8 md:space-y-12">
                {/* Full Description */}
                {hotel.fullDescription && (
                  <div>
                    <p className="text-sm md:text-lg text-muted-foreground leading-relaxed text-center lg:text-left max-w-4xl">
                      {hotel.fullDescription}
                    </p>
                  </div>
                )}

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-4 md:mb-8 text-center lg:text-left">Hotel Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start space-x-3 md:space-x-4 group">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                          </div>
                          <span className="text-sm md:text-base text-muted-foreground leading-relaxed pt-1 md:pt-2">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="space-y-6">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4 md:p-8">
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-4 md:mb-6">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-accent/10 text-accent hover:bg-accent/20 border-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        {gallery.length > 0 && (
          <section className="py-10 md:py-20 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-3 md:mb-6">Hotel Gallery</h2>
                <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {gallery.map((image, index) => (
                  <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={image}
                      alt={`${hotel.name} gallery image ${index + 1}`}
                      className="w-full h-32 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Room Types Section */}
        {rooms.length > 0 && (
          <section id="rooms" className="py-10 md:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-16">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-3 md:mb-6">Rooms & Suites</h2>
                <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
                <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                  Choose from our selection of elegantly appointed rooms and suites, each designed to provide the ultimate in comfort and luxury.
                </p>
              </div>

              <div className="space-y-12">
                {rooms.map((room, index) => (
                  <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                      {/* Room Images */}
                      <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                        <div className={`grid ${room.images && room.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 h-full min-h-[300px]`}>
                          {room.images && room.images.length > 0 ? (
                            room.images.map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={image}
                                alt={`${room.name} image ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ))
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground">No image</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Room Details */}
                      <CardContent className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-serif font-bold text-primary mb-3">{room.name}</h3>
                            <p className="text-muted-foreground leading-relaxed">{room.description}</p>
                          </div>

                          {/* Room Specs */}
                          <div className="grid grid-cols-2 gap-4 py-4 border-y border-accent/20">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                                <Bed className="w-4 h-4 text-accent" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-primary">Size</div>
                                <div className="text-xs text-muted-foreground">{room.size}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-accent" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-primary">Occupancy</div>
                                <div className="text-xs text-muted-foreground">{room.occupancy} guests</div>
                              </div>
                            </div>
                          </div>

                          {/* Room Amenities */}
                          {room.amenities && room.amenities.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-primary mb-3">Room Amenities</h4>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, amenityIndex) => (
                                  <Badge
                                    key={amenityIndex}
                                    variant="secondary"
                                    className="bg-accent/10 text-accent hover:bg-accent/20 border-0 text-xs"
                                  >
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-12 md:py-20 bg-primary">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-4 md:mb-6">
              Discover More Luxury Accommodations
            </h2>
            <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
            <p className="text-sm md:text-xl text-primary-foreground/90 mb-6 md:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
              Explore our curated selection of Egypt's finest hotels and resorts.
              Each property offers unique experiences designed for discerning travelers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Link href="/stay">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
                  data-testid="button-view-all-hotels"
                >
                  View All Hotels
                </Button>
              </Link>
              <Link href="/destinations">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
                  data-testid="button-explore-destinations"
                >
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
