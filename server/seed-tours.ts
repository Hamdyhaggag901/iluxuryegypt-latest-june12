import { db } from "./db";
import { tours } from "@shared/schema";

const realExperiences = [
  {
    title: "The Ultimate Egypt Tour",
    slug: "ultimate-egypt-tour",
    description: "Experience the ultimate family adventure across Egypt's most iconic destinations. This comprehensive 10-day luxury journey takes your family from the Great Pyramids of Giza to the magnificent temples of Luxor and Aswan, with a luxurious Nile cruise, hot air balloon rides, and countless unforgettable experiences. Expertly designed for families, this tour combines world-class Egyptology with engaging activities that captivate travelers of all ages. Create memories that will last a lifetime as you explore ancient wonders, sail the legendary Nile, and immerse yourselves in Egypt's rich cultural heritage.",
    shortDescription: "The ultimate 10-day family adventure covering Egypt's greatest wonders from Cairo to Aswan.",
    heroImage: "/api/assets/pyramid-from-lobby_1757459228637.jpeg",
    gallery: [
      "/api/assets/pyramid-from-lobby_1757459228637.jpeg",
      "/api/assets/the-pyramid-from-mena-house_1757459228638.jpeg",
      "/api/assets/luxor_1757531163688.jpg",
      "/api/assets/suite-nile_1757457083796.jpg"
    ],
    duration: "10 Days / 9 Nights",
    groupSize: "4-16 people",
    difficulty: "Easy",
    price: 3850,
    currency: "USD",
    includes: [
      "9 nights luxury accommodation (5-star hotels & Nile cruise)",
      "All meals (breakfast, lunch, dinner)",
      "Private Egyptologist guide throughout",
      "Domestic flights Cairo-Aswan and Luxor-Cairo",
      "Hot air balloon ride over Luxor",
      "3-night luxury Nile cruise from Aswan to Luxor",
      "All entrance fees and permits",
      "Private air-conditioned transportation",
      "Camel ride at the Pyramids",
      "Traditional felucca sailing",
      "Sound and Light show",
      "Airport transfers"
    ],
    excludes: [
      "International flights",
      "Travel insurance",
      "Pyramid interior entry (optional add-on)",
      "Personal expenses",
      "Tips and gratuities",
      "Visa fees"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Cairo - Welcome to Egypt",
        activities: [
          "VIP meet and greet at Cairo International Airport",
          "Private transfer to luxury 5-star hotel with pyramid views",
          "Check-in and welcome refreshments",
          "Evening welcome dinner with tour briefing",
          "Meet your expert Egyptologist guide",
          "Overnight in Cairo"
        ]
      },
      {
        day: 2,
        title: "Pyramids of Giza & Sphinx Adventure",
        activities: [
          "Breakfast at hotel with pyramid views",
          "Visit the Great Pyramid of Khufu (exterior)",
          "Explore Pyramids of Khafre and Menkaure",
          "Stand before the enigmatic Great Sphinx",
          "Family camel ride around Giza Plateau",
          "Visit Solar Boat Museum",
          "Lunch at panoramic pyramid-view restaurant",
          "Photo opportunities with camels and pyramids",
          "Return to hotel for relaxation",
          "Optional: Sound & Light show at pyramids"
        ]
      },
      {
        day: 3,
        title: "Egyptian Museum & Islamic Cairo Discovery",
        activities: [
          "Guided family tour of Egyptian Museum",
          "See Tutankhamun's treasures and golden mask",
          "Visit the Royal Mummy Room",
          "Interactive storytelling for children",
          "Lunch at traditional Egyptian restaurant",
          "Explore vibrant Khan el-Khalili bazaar",
          "Visit Mohamed Ali Mosque at the Citadel",
          "Shopping for souvenirs and Egyptian crafts",
          "Dinner at hotel"
        ]
      },
      {
        day: 4,
        title: "Flight to Aswan & Nile Cruise Embarkation",
        activities: [
          "Morning flight to Aswan",
          "Transfer to luxury Nile cruise ship",
          "Welcome aboard and cabin orientation",
          "Lunch on board with Nile views",
          "Visit magnificent Philae Temple on Agilkia Island",
          "See the modern engineering marvel of Aswan High Dam",
          "Afternoon tea on sun deck",
          "Sunset cocktails as we begin sailing",
          "Dinner on board",
          "Egyptian folkloric show"
        ]
      },
      {
        day: 5,
        title: "Abu Simbel Excursion & Sailing",
        activities: [
          "Early morning optional excursion to Abu Simbel temples",
          "Marvel at Ramesses II's colossal statues",
          "Visit Nefertari's beautiful temple",
          "Return to ship for breakfast",
          "Relax on sun deck as we sail",
          "Lunch on board",
          "Afternoon sailing through stunning Nile scenery",
          "Egyptian cooking demonstration",
          "Captain's welcome dinner",
          "Overnight sailing to Kom Ombo"
        ]
      },
      {
        day: 6,
        title: "Kom Ombo & Edfu Temples",
        activities: [
          "Morning visit to unique double temple of Kom Ombo",
          "Dedicated to crocodile god Sobek and falcon god Horus",
          "See ancient crocodile mummies",
          "Sail to Edfu while enjoying lunch",
          "Afternoon visit to Temple of Horus at Edfu",
          "Best preserved temple in all of Egypt",
          "Horse-drawn carriage ride to temple (family fun!)",
          "Sail towards Luxor through Esna Lock",
          "Galabeya party on board (traditional dress)",
          "Dinner and entertainment"
        ]
      },
      {
        day: 7,
        title: "Luxor West Bank & Valley of the Kings",
        activities: [
          "Optional sunrise hot air balloon over Luxor",
          "Breakfast on board",
          "Cross to Luxor West Bank",
          "Explore Valley of the Kings (visit 3 royal tombs)",
          "Visit Temple of Queen Hatshepsut",
          "Photo stop at Colossi of Memnon",
          "Lunch at local restaurant",
          "Return to ship for relaxation",
          "Afternoon tea and swimming",
          "Farewell dinner on board"
        ]
      },
      {
        day: 8,
        title: "Karnak & Luxor Temples - Disembarkation",
        activities: [
          "Final breakfast on cruise ship",
          "Disembark from Nile cruise",
          "Visit colossal Karnak Temple complex",
          "Walk the Avenue of Sphinxes",
          "Explore the Great Hypostyle Hall with 134 massive columns",
          "Lunch at Nile-view restaurant",
          "Check in to luxury Luxor hotel",
          "Afternoon visit to beautiful Luxor Temple",
          "Evening Sound and Light Show at Karnak",
          "Dinner at hotel"
        ]
      },
      {
        day: 9,
        title: "Traditional Experiences & Optional Activities",
        activities: [
          "Leisurely breakfast",
          "Optional: Visit Dendera and Abydos temples",
          "Optional: Traditional felucca sailing on the Nile",
          "Optional: Visit Luxor Museum",
          "Optional: Explore local markets with guide",
          "Family workshop on hieroglyphics",
          "Lunch at leisure",
          "Afternoon by hotel pool or spa treatments",
          "Farewell dinner with traditional entertainment",
          "Prepare for departure"
        ]
      },
      {
        day: 10,
        title: "Departure - Farewell Egypt",
        activities: [
          "Final breakfast at hotel",
          "Last-minute shopping or relaxation",
          "Check out from hotel",
          "Transfer to Luxor Airport",
          "Flight to Cairo for international connection",
          "Airport assistance for departure",
          "End of unforgettable Ultimate Egypt Tour"
        ]
      }
    ],
    destinations: ["Cairo", "Giza", "Aswan", "Kom Ombo", "Edfu", "Luxor"],
    category: "Family Luxury",
    featured: true,
    published: true
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
    includes: [
      "Private Egyptologist guide",
      "Camel ride for all family members",
      "Egyptian Museum entry with kid-friendly tour",
      "Lunch at pyramid-view restaurant",
      "Hotel pickup and drop-off",
      "Bottled water and snacks"
    ],
    excludes: [
      "Pyramid interior entry (can be added)",
      "Personal expenses",
      "Gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Family Pyramid Adventure",
        activities: [
          "Morning pickup from Cairo hotel",
          "Guided tour of the Great Pyramids with storytelling for children",
          "Camel ride around the Giza Plateau",
          "Visit the Sphinx with photo opportunities",
          "Lunch with pyramid views",
          "Interactive Egyptian Museum tour focusing on Tutankhamun treasures",
          "Return to hotel"
        ]
      }
    ],
    destinations: ["Cairo", "Giza"],
    category: "Family Luxury",
    featured: true,
    published: true
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
    includes: [
      "2 nights at family-friendly beach resort",
      "All meals (breakfast, lunch, dinner)",
      "Private family guide throughout",
      "Round-trip transportation from Cairo",
      "All entrance fees and permits",
      "Beach resort access and activities",
      "Science museum planetarium show",
      "Traditional seafood lunch at harbor",
      "Ice cream stop for children",
      "Beach toys and equipment"
    ],
    excludes: [
      "Water sports activities (optional add-ons)",
      "Personal expenses",
      "Tips and gratuities",
      "Room service at hotel"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cairo to Alexandria - Coastal Arrival",
        activities: [
          "Morning pickup from Cairo hotel (3-hour scenic drive)",
          "Stop at rest area with refreshments",
          "Arrive Alexandria and check-in at beach resort",
          "Welcome lunch with Mediterranean sea views",
          "Afternoon beach time with kids' activities",
          "Visit to Bibliotheca Alexandrina (modern library)",
          "Interactive children's discovery center",
          "Sunset walk along the Corniche",
          "Dinner at resort with family entertainment"
        ]
      },
      {
        day: 2,
        title: "Ancient Alexandria & Marine Adventures",
        activities: [
          "Breakfast at resort",
          "Visit Catacombs of Kom el Shoqafa",
          "Explore Pompey's Pillar with storytelling for kids",
          "Stop at traditional fish market",
          "Fresh seafood lunch at harbor restaurant",
          "Visit Citadel of Qaitbay (built on ancient lighthouse site)",
          "Ice cream break at famous Alexandria parlor",
          "Return to resort for swimming and beach games",
          "Evening BBQ dinner on the beach"
        ]
      },
      {
        day: 3,
        title: "Science & Culture - Return to Cairo",
        activities: [
          "Leisurely breakfast",
          "Morning beach time and resort activities",
          "Visit Alexandria Planetarium Science Museum",
          "Interactive exhibits perfect for children",
          "Lunch at resort",
          "Check out and depart for Cairo",
          "Stop for photos at Montazah Palace gardens",
          "Return to Cairo hotel (arrive evening)",
          "End of Alexandria family adventure"
        ]
      }
    ],
    destinations: ["Alexandria", "Cairo"],
    category: "Family Luxury",
    featured: true,
    published: true
  },
  {
    title: "Luxury Dahabiya Nile Cruise - Aswan to Luxor",
    slug: "luxury-dahabiya-nile-cruise",
    description: "Experience the timeless beauty of the Nile aboard a traditional luxury Dahabiya sailing yacht. This intimate 5-day journey takes you from Aswan to Luxor, stopping at lesser-known temples and authentic Nubian villages inaccessible to larger cruise ships. With a maximum of 12 guests, enjoy personalized service, gourmet Egyptian cuisine, and sunset sails on the legendary river.",
    shortDescription: "Intimate luxury sailing experience on traditional Dahabiya yacht from Aswan to Luxor.",
    heroImage: "/api/assets/suite-nile_1757457083796.jpg",
    gallery: ["/api/assets/suite-nile_1757457083796.jpg", "/api/assets/luxor_1757531163688.jpg"],
    duration: "5 Days / 4 Nights",
    groupSize: "2-12 people",
    difficulty: "Easy",
    price: 2800,
    currency: "USD",
    includes: [
      "4 nights on luxury Dahabiya yacht",
      "All meals with gourmet Egyptian and international cuisine",
      "Private Egyptologist guide",
      "All temple and site entrance fees",
      "Sunset felucca sailing",
      "Traditional afternoon tea service",
      "Airport or station transfers"
    ],
    excludes: [
      "Flights to Aswan",
      "Alcoholic beverages",
      "Hot air balloon ride (optional)",
      "Gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Aswan - Embarkation",
        activities: [
          "Meet and assist at Aswan airport or station",
          "Transfer to Dahabiya",
          "Welcome drink and lunch on board",
          "Visit Philae Temple - UNESCO World Heritage Site",
          "Sunset cocktails on deck",
          "Dinner and overnight sailing"
        ]
      },
      {
        day: 2,
        title: "Kom Ombo & Gebel el Silsila",
        activities: [
          "Sunrise on the Nile",
          "Visit Kom Ombo Temple dedicated to Sobek and Horus",
          "Sail to Gebel el Silsila",
          "Explore ancient stone quarries",
          "Traditional Egyptian cooking demonstration",
          "Dinner under the stars"
        ]
      },
      {
        day: 3,
        title: "Edfu & El Kab",
        activities: [
          "Visit Edfu Temple - best preserved in Egypt",
          "Sail to El Kab",
          "Explore ancient rock tombs",
          "Afternoon tea with Nile views",
          "Evening entertainment with local musicians"
        ]
      },
      {
        day: 4,
        title: "Esna & Luxor Arrival",
        activities: [
          "Morning visit to Esna Temple",
          "Sail through Esna Lock",
          "Arrive Luxor",
          "Visit Luxor Temple at sunset",
          "Farewell dinner on board"
        ]
      },
      {
        day: 5,
        title: "Luxor - Disembarkation",
        activities: [
          "Breakfast on board",
          "Visit Valley of the Kings",
          "Explore Hatshepsut Temple",
          "Visit Karnak Temple",
          "Transfer to airport or station"
        ]
      }
    ],
    destinations: ["Aswan", "Kom Ombo", "Edfu", "Luxor"],
    category: "Nile Cruise",
    featured: true,
    published: true
  },
  {
    title: "Classic Egypt Discovery - Pyramids, Nile & Temples",
    slug: "classic-egypt-discovery",
    description: "The quintessential Egyptian experience combining Cairo's ancient wonders with Luxor's magnificent temples. This comprehensive 7-day journey covers all the must-see highlights including the Pyramids of Giza, Egyptian Museum, Valley of the Kings, Karnak Temple, and more. Perfect for first-time visitors who want to experience the best of Egypt with expert guidance and luxury accommodations.",
    shortDescription: "Complete Egyptian experience from Pyramids to Luxor temples with luxury accommodations.",
    heroImage: "/api/assets/luxor_1757531163688.jpg",
    gallery: ["/api/assets/luxor_1757531163688.jpg", "/api/assets/pyramid-from-lobby_1757459228637.jpeg"],
    duration: "7 Days / 6 Nights",
    groupSize: "2-16 people",
    difficulty: "Easy",
    price: 1850,
    currency: "USD",
    includes: [
      "6 nights accommodation (3 in Cairo, 3 in Luxor)",
      "Daily breakfast and 3 lunches",
      "Private Egyptologist guide",
      "All entrance fees and permits",
      "Internal flight Cairo to Luxor",
      "All transfers in private air-conditioned vehicle",
      "Sound and Light show at Karnak"
    ],
    excludes: [
      "International flights",
      "Dinners not specified",
      "Pyramid interior entry tickets",
      "Personal expenses and gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Cairo",
        activities: [
          "Meet and greet at Cairo International Airport",
          "Transfer to 5-star hotel",
          "Welcome briefing",
          "Overnight in Cairo"
        ]
      },
      {
        day: 2,
        title: "Giza Pyramids & Sphinx",
        activities: [
          "Visit the Great Pyramid of Khufu",
          "Explore the Pyramids of Khafre and Menkaure",
          "Meet the enigmatic Sphinx",
          "Lunch at pyramid-view restaurant",
          "Optional camel ride",
          "Evening at leisure"
        ]
      },
      {
        day: 3,
        title: "Egyptian Museum & Islamic Cairo",
        activities: [
          "Guided tour of Egyptian Museum with Tutankhamun treasures",
          "Visit the Mummy Room (optional)",
          "Explore Khan el-Khalili bazaar",
          "Lunch in historic Cairo",
          "Visit Salah El-Din Citadel and Mohamed Ali Mosque",
          "Evening flight to Luxor"
        ]
      },
      {
        day: 4,
        title: "West Bank - Valley of the Kings",
        activities: [
          "Cross to Luxor West Bank",
          "Explore Valley of the Kings (3 tombs included)",
          "Visit Temple of Hatshepsut",
          "Photo stop at Colossi of Memnon",
          "Lunch at local restaurant",
          "Optional hot air balloon for next morning"
        ]
      },
      {
        day: 5,
        title: "Karnak & Luxor Temples",
        activities: [
          "Visit magnificent Karnak Temple complex",
          "Walk the Avenue of Sphinxes",
          "Explore Luxor Temple",
          "Afternoon at leisure by hotel pool",
          "Evening Sound and Light Show at Karnak"
        ]
      },
      {
        day: 6,
        title: "Free Day or Optional Tours",
        activities: [
          "Optional: Dendara and Abydos temples",
          "Optional: Felucca sailing on the Nile",
          "Optional: Luxor Museum visit",
          "Farewell dinner at Nile-view restaurant"
        ]
      },
      {
        day: 7,
        title: "Departure",
        activities: [
          "Breakfast at hotel",
          "Transfer to Luxor Airport",
          "End of services"
        ]
      }
    ],
    destinations: ["Cairo", "Giza", "Luxor"],
    category: "Classic Egypt",
    featured: true,
    published: true
  },
  {
    title: "Spiritual Journey - Temples & Sacred Sites",
    slug: "spiritual-journey-temples",
    description: "A transformative spiritual journey through Egypt's most sacred temples and ancient wisdom sites. This unique experience combines temple visits with meditation sessions, sacred geometry workshops, and sunrise ceremonies. Led by spiritual guides who understand both Egyptology and ancient metaphysical practices, this journey is designed for those seeking deeper connection with Egypt's spiritual legacy.",
    shortDescription: "Transformative spiritual experience at Egypt's sacred temples with meditation and ceremonies.",
    heroImage: "/api/assets/luxor_1757531163688.jpg",
    gallery: ["/api/assets/luxor_1757531163688.jpg", "/api/assets/pyramid-from-lobby_1757459228637.jpeg"],
    duration: "6 Days / 5 Nights",
    groupSize: "4-10 people",
    difficulty: "Moderate",
    price: 2200,
    currency: "USD",
    includes: [
      "5 nights luxury accommodation",
      "All meals including special vegetarian options",
      "Spiritual guide and Egyptologist",
      "Private temple access for sunrise ceremonies",
      "Sacred geometry workshops",
      "Meditation sessions at temples",
      "Sound healing experience in Great Pyramid",
      "All entrance fees and transfers"
    ],
    excludes: [
      "International flights",
      "Personal spiritual items",
      "Additional healing sessions",
      "Gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Opening Ceremony",
        activities: [
          "Airport welcome and transfer",
          "Group gathering and intention setting",
          "Opening ceremony and blessing",
          "Sacred geometry introduction workshop",
          "Welcome dinner"
        ]
      },
      {
        day: 2,
        title: "Great Pyramid & Sphinx Meditation",
        activities: [
          "Sunrise meditation at the Sphinx",
          "Private time inside Great Pyramid for sound healing",
          "Sacred geometry workshop at pyramid plateau",
          "Lunch with pyramid views",
          "Evening sharing circle"
        ]
      },
      {
        day: 3,
        title: "Dendera Temple of Hathor",
        activities: [
          "Drive to Dendera",
          "Private morning access to Temple of Hathor",
          "Healing ceremony in the sacred crypt",
          "Zodiac ceiling meditation",
          "Temple of Isis ritual",
          "Return to Luxor for overnight"
        ]
      },
      {
        day: 4,
        title: "Abydos - Temple of Osiris",
        activities: [
          "Journey to Abydos",
          "Visit Temple of Seti I",
          "Osiris ceremony at the sacred well",
          "Flower of Life meditation",
          "Personal time for reflection",
          "Evening group discussion"
        ]
      },
      {
        day: 5,
        title: "Karnak & Luxor Spiritual Experience",
        activities: [
          "Sunrise ceremony at Karnak Temple",
          "Walk the Sacred Lake",
          "Afternoon at Luxor Temple",
          "Sunset meditation",
          "Integration workshop"
        ]
      },
      {
        day: 6,
        title: "Closing Ceremony & Departure",
        activities: [
          "Final morning meditation",
          "Closing ceremony and gratitude ritual",
          "Group sharing and integration",
          "Transfer to airport",
          "Farewell"
        ]
      }
    ],
    destinations: ["Cairo", "Giza", "Dendera", "Abydos", "Luxor"],
    category: "Spiritual Journeys",
    featured: true,
    published: true
  },
  {
    title: "White Desert Adventure & Siwa Oasis",
    slug: "white-desert-siwa-adventure",
    description: "Venture beyond the Nile Valley on this thrilling desert adventure combining the otherworldly White Desert with the ancient Siwa Oasis. Experience dramatic limestone formations, sleep under countless stars in luxury desert camps, explore Alexander the Great's oracle temple, and swim in natural hot springs. This journey reveals Egypt's stunning desert landscapes and Berber culture away from typical tourist paths.",
    shortDescription: "Adventure through White Desert's landscapes and ancient Siwa Oasis with luxury camping.",
    heroImage: "/api/assets/siwa_1757531163689.jpg",
    gallery: ["/api/assets/siwa_1757531163689.jpg"],
    duration: "5 Days / 4 Nights",
    groupSize: "4-12 people",
    difficulty: "Moderate",
    price: 1650,
    currency: "USD",
    includes: [
      "4x4 desert safari vehicle",
      "Professional desert guide",
      "2 nights luxury desert camping",
      "2 nights Siwa eco-lodge",
      "All meals during desert camping",
      "Hotel meals in Siwa",
      "Siwa Oasis tours",
      "Hot spring visits",
      "Sandboarding equipment",
      "Stargazing experience"
    ],
    excludes: [
      "Cairo accommodation",
      "Alcoholic beverages",
      "Optional quad biking",
      "Personal expenses"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cairo to Bahariya Oasis",
        activities: [
          "Early morning departure from Cairo",
          "Drive through desert highway (4 hours)",
          "Arrive Bahariya Oasis",
          "Lunch at local restaurant",
          "Visit Black Desert formations",
          "4x4 safari into White Desert",
          "Watch sunset at Crystal Mountain",
          "Set up luxury desert camp",
          "Bedouin dinner under stars",
          "Overnight camping in White Desert"
        ]
      },
      {
        day: 2,
        title: "White Desert Exploration",
        activities: [
          "Sunrise among chalk rock formations",
          "Breakfast in the desert",
          "Explore mushroom and chicken rock formations",
          "Visit ancient springs",
          "Sandboarding on dunes",
          "Afternoon tea in the desert",
          "Sunset photography session",
          "Traditional Bedouin dinner",
          "Stargazing with telescope",
          "Second night desert camping"
        ]
      },
      {
        day: 3,
        title: "Journey to Siwa Oasis",
        activities: [
          "Breakfast and pack camp",
          "Drive to Siwa Oasis (6-7 hours)",
          "Scenic route through desert",
          "Arrive Siwa, check into eco-lodge",
          "Sunset at Fatnas Spring",
          "Dinner at lodge"
        ]
      },
      {
        day: 4,
        title: "Siwa Oasis Discovery",
        activities: [
          "Visit Shali Fortress ruins",
          "Explore Temple of the Oracle (Alexander the Great's visit)",
          "Tour Cleopatra's Spring for swimming",
          "Lunch with Berber family",
          "Visit traditional olive oil press",
          "Explore Mountain of the Dead tombs",
          "Sunset at Great Sand Sea dunes",
          "Traditional Siwan dinner"
        ]
      },
      {
        day: 5,
        title: "Return to Cairo",
        activities: [
          "Morning swim at hot springs",
          "Visit Siwa House Museum",
          "Shopping for local dates and olive oil",
          "Lunch in Siwa",
          "Drive back to Cairo (8-9 hours)",
          "Arrive Cairo evening",
          "End of adventure"
        ]
      }
    ],
    destinations: ["Bahariya Oasis", "White Desert", "Siwa Oasis"],
    category: "Adventure Tours",
    featured: true,
    published: true
  },
  {
    title: "Imperial Cairo - Ultra Luxury Experience",
    slug: "imperial-cairo-ultra-luxury",
    description: "Experience Cairo like royalty with this ultra-exclusive journey featuring private palace access, personal Egyptologists, helicopter tours, and stays at Egypt's most prestigious hotels. Enjoy after-hours private access to the Egyptian Museum, Michelin-level dining experiences, and VIP treatment throughout. This bespoke journey includes privileges typically reserved for diplomats and celebrities.",
    shortDescription: "Ultimate luxury Cairo experience with private access, helicopter tours, and royal treatment.",
    heroImage: "/api/assets/1902-restaurant_1757457083786.jpg",
    gallery: ["/api/assets/1902-restaurant_1757457083786.jpg", "/api/assets/pyramid-from-lobby_1757459228637.jpeg"],
    duration: "4 Days / 3 Nights",
    groupSize: "2-6 people",
    difficulty: "Easy",
    price: 8500,
    currency: "USD",
    includes: [
      "3 nights at Mena House Palace or Four Seasons First Nile",
      "Personal Egyptologist and butler service",
      "All meals at signature restaurants",
      "Private helicopter pyramid tour",
      "After-hours Egyptian Museum private access",
      "VIP entry to all sites (skip all lines)",
      "Private sound and light show",
      "Luxury Mercedes S-Class with driver",
      "Private felucca with gourmet dinner",
      "Spa treatment at hotel",
      "Personal photographer for one day"
    ],
    excludes: [
      "International flights",
      "Premium alcoholic beverages",
      "Additional spa treatments",
      "Shopping and personal expenses"
    ],
    itinerary: [
      {
        day: 1,
        title: "Royal Arrival & Pyramid Private Experience",
        activities: [
          "VIP airport meet and greet with luxury transfer",
          "Check-in at Mena House Palace (pyramid view suite)",
          "Welcome champagne in suite",
          "Private lunch at 1902 Restaurant",
          "Exclusive after-hours access to Great Pyramid interior",
          "Private visit to Solar Boat Museum",
          "Sunset cocktails on your terrace overlooking pyramids",
          "Dinner at Saqqara Palmclub"
        ]
      },
      {
        day: 2,
        title: "Helicopter Tour & Museum Excellence",
        activities: [
          "Breakfast in suite or terrace",
          "Private helicopter tour over Giza Pyramids and Cairo",
          "Land at Saqqara for exclusive tour of Step Pyramid complex",
          "Gourmet lunch at archaeological site tent setup",
          "Return to hotel for spa treatment",
          "After-hours private access to Egyptian Museum",
          "Personal tour of Tutankhamun treasures and Royal Mummy Room",
          "Dinner at Sequoia Mediterranean restaurant with Nile views"
        ]
      },
      {
        day: 3,
        title: "Islamic Cairo & Citadel Exclusive",
        activities: [
          "Private breakfast at hotel's pool terrace",
          "VIP visit to Mohamed Ali Mosque at Citadel (before opening)",
          "Private tour of Sultan Hassan and Al-Rifai Mosques",
          "Exclusive access to historical palace",
          "Gourmet lunch at exclusive members club",
          "Private shopping experience at Khan el-Khalili with personal shopper",
          "Afternoon tea at historic Shepheard's Hotel",
          "Private felucca dinner cruise on the Nile",
          "Personal sound and light show at pyramids"
        ]
      },
      {
        day: 4,
        title: "Farewell & Departure",
        activities: [
          "Leisurely breakfast in suite",
          "Final morning at leisure (spa or pool)",
          "Late checkout guaranteed",
          "Farewell gift presentation",
          "VIP airport transfer with fast-track service",
          "Departure"
        ]
      }
    ],
    destinations: ["Cairo", "Giza", "Saqqara"],
    category: "Ultra Luxury",
    featured: true,
    published: true
  }
];

async function seedTours() {
  try {
    console.log("Starting to seed tours...");
    
    for (const tour of realExperiences) {
      const result = await db.insert(tours).values(tour).returning();
      console.log(`✓ Added: ${result[0].title}`);
    }
    
    console.log("\n✅ Successfully seeded all tours!");
    console.log(`Total tours added: ${realExperiences.length}`);
    
  } catch (error) {
    console.error("Error seeding tours:", error);
    throw error;
  }
}

seedTours()
  .then(() => {
    console.log("Seed process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed process failed:", error);
    process.exit(1);
  });
