import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Ship,
  Calendar,
  MapPin,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Anchor,
  Send,
} from "lucide-react";

export default function ASaraNileCruise() {
  const { toast } = useToast();
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Luxury Nile Cruise: Luxor to Aswan | A Sara Egypt";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tour: "A Sara Nile Cruise",
          type: "nile-cruise",
        }),
      });

      if (response.ok) {
        toast({
          title: "Inquiry Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", phone: "", date: "", guests: "", message: "" });
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      toast({
        title: "Error",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const itinerary = [
    {
      day: 1,
      title: "High Dam, Philae Temple, Unfinished Obelisk",
      sites: [
        {
          name: "High Dam",
          description: "A testament to modern ambition and engineering prowess, the Aswan High Dam commands sweeping vistas across the azure expanse of Lake Nasser. This monumental structure forever altered Egypt's relationship with the Nile, taming its ancient floods while generating power for millions."
        },
        {
          name: "Philae Temple",
          description: "Reached by private motorboat, the Temple of Philae rises from Agilkia Island like a jewel set in sapphire waters. Dedicated to Isis, goddess of magic and devotion, this exquisitely preserved sanctuary was painstakingly relocated during UNESCO's heroic rescue mission."
        },
        {
          name: "Unfinished Obelisk",
          description: "Within Aswan's ancient granite quarries lies archaeology's most revealing monument—an immense obelisk abandoned mid-creation. This colossal stone giant, still tethered to bedrock, offers rare insight into pharaonic craftsmanship and ambition."
        }
      ]
    },
    {
      day: 2,
      title: "Abu Simbel Temples (Optional), Kom Ombo Temple",
      sites: [
        {
          name: "Abu Simbel Temples",
          description: "Carved directly into the Nubian cliff face, the twin temples of Abu Simbel stand as Ramses II's most audacious declaration of divine kingship. Four colossal seated figures of the pharaoh guard the entrance, while the interior chambers reveal scenes of military triumph and celestial worship."
        },
        {
          name: "Kom Ombo Temple",
          description: "Perched dramatically above the Nile, this unique double temple embodies perfect architectural symmetry. One half venerates Sobek, the primordial crocodile deity of fertility and protection; the other honors Horus the Elder, celestial guardian of kingship."
        }
      ]
    },
    {
      day: 3,
      title: "Temple of Horus (Edfu), Karnak Temple Complex, Luxor Temple",
      sites: [
        {
          name: "Temple of Horus at Edfu",
          description: "The most impeccably preserved temple in Egypt, Edfu's sanctuary to Horus stands as the ancient world's architectural masterpiece. Reached by horse-drawn carriage through timeless streets, this Ptolemaic wonder reveals the eternal battle between order and chaos."
        },
        {
          name: "Karnak Temple Complex",
          description: "The world's largest religious complex unfolds across one hundred hectares of sacred ground. The legendary Hypostyle Hall alone overwhelms the senses—134 towering columns rise like a petrified forest, their capitals blooming beneath shafts of divine light."
        },
        {
          name: "Luxor Temple",
          description: "Rising from the modern city's vibrant heart, Luxor Temple glows with particular magic as afternoon light transforms limestone to gold. Built as a shrine for divine rejuvenation, this architectural symphony features colossal statues of Ramses II."
        }
      ]
    },
    {
      day: 4,
      title: "Valley of the Kings, Temple of Queen Hatshepsut, Colossi of Memnon",
      sites: [
        {
          name: "Valley of the Kings",
          description: "Hidden within the arid Theban mountains lies the necropolis of pharaohs, where rulers of the New Kingdom prepared their eternal journey beyond the veil. Descend into subterranean chambers adorned with vibrant paintings of afterlife rituals."
        },
        {
          name: "Temple of Queen Hatshepsut",
          description: "Egypt's most powerful female pharaoh commissioned this architectural triumph, where elegant terraces rise in perfect harmony against towering limestone cliffs. At Deir el-Bahari, Hatshepsut's mortuary temple celebrates her divine birth."
        },
        {
          name: "Colossi of Memnon",
          description: "Two weathered giants stand sentinel across the Theban plain—all that remains visible of Amenhotep III's vast mortuary temple, once Egypt's largest. These sixty-foot quartzite statues bore witness to three millennia of sunrise."
        }
      ]
    }
  ];

  const inclusions = [
    "3 or 4 nights' accommodation aboard the Nile cruise (full board basis)",
    "Meet and assist service upon arrival and departure",
    "Dedicated personnel assistance during your stay and excursions",
    "All transfers by modern air-conditioned deluxe vehicle (private)",
    "All Nile Cruise excursions as mentioned in the itinerary (private)",
    "Entrance fees to all sights between Luxor and Aswan",
    "English-speaking tour guide during excursions (group size 1-8 maximum)",
    "Complimentary bottled water (1 per day per person)",
    "All service charges and taxes"
  ];

  const exclusions = [
    "Extra meals and beverages beyond full board",
    "Personal expenses (laundry, telephone calls, etc.)",
    "Gratuities for guide, driver, and crew",
    "Optional tours and excursions",
    "Travel insurance"
  ];

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2070')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Ship className="h-4 w-4" />
            <span className="text-sm font-medium">Standard Nile Cruise</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            A Sara Nile Cruise
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover ancient Egypt in refined comfort. Exclusive journeys through Luxor, Aswan & timeless temples.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />
              <span>4 / 5 / 8 Days</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-400" />
              <span>Luxor - Edfu - Kom Ombo - Aswan</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-400" />
              <span>Small Group Tour</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-primary text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Saturdays from Luxor | Wednesdays from Aswan</span>
            </div>
            <div className="flex items-center gap-2">
              <Anchor className="h-4 w-4" />
              <span>Full Board Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Itinerary Column */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold text-primary mb-8">
                Your Journey
              </h2>

              <div className="space-y-4">
                {itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="border border-border rounded-xl overflow-hidden bg-white shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">D{day.day}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">Day {day.day}</h3>
                          <p className="text-sm text-muted-foreground">{day.title}</p>
                        </div>
                      </div>
                      {expandedDay === day.day ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>

                    {expandedDay === day.day && (
                      <div className="px-6 pb-6 space-y-6">
                        {day.sites.map((site, idx) => (
                          <div key={idx} className="pl-16">
                            <h4 className="font-semibold text-primary mb-2">{site.name}</h4>
                            <p className="text-muted-foreground leading-relaxed">{site.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Inclusions
                  </h3>
                  <ul className="space-y-3">
                    {inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-green-900">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <X className="h-5 w-5" />
                    Exclusions
                  </h3>
                  <ul className="space-y-3">
                    {exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-red-900">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking Form Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-border p-6">
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                  Book This Cruise
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Fill out the form below and our travel specialists will contact you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="Preferred Date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Number of Guests"
                      min="1"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Special Requests or Questions"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="bg-muted/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  No payment required. Free cancellation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
