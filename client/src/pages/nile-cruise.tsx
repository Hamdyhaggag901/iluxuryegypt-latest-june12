import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Clock, Users, MapPin, Star, Calendar, ArrowLeft, Heart, Ship, Crown, Anchor } from "lucide-react";
import { Link } from "wouter";

// All Nile Cruise tours organized by category
const nileCruiseTours = [
  // Luxury Nile Cruises
  {
    id: 'oberoi-philae',
    name: 'Oberoi Philae',
    category: 'Luxury',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-22 Guests',
    price: 'From $3,500',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Butler Service', 'Spa & Wellness', 'Private Dining', 'Egyptologist Guide'],
    description: 'The pinnacle of Nile luxury. Experience unparalleled elegance aboard this intimate vessel with personalized butler service and world-class amenities.',
    itinerary: 'Day 1: Embark in Aswan, welcome dinner. Day 2: Philae Temple, sail to Kom Ombo. Day 3: Kom Ombo & Edfu Temples. Day 4: Luxor West Bank, Valley of Kings. Day 5: Karnak & Luxor Temples. Days 6-7: Optional extensions available.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'oberoi-zahra',
    name: 'Oberoi Zahra',
    category: 'Luxury',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-25 Guests',
    price: 'From $3,200',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Infinity Pool', 'Cigar Lounge', 'Fine Dining', 'Private Balconies'],
    description: 'Modern luxury meets ancient wonders. Featuring spacious suites with private balconies and an infinity pool overlooking the Nile.',
    itinerary: 'Day 1: Board in Luxor, sunset cocktails. Day 2: Valley of Kings, Hatshepsut Temple. Day 3: Edfu Temple, sail to Kom Ombo. Day 4: Kom Ombo Temple, Aswan. Day 5: Philae Temple, felucca ride. Days 6-7: Abu Simbel extension available.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'sanctuary-sun-boat-iv',
    name: 'Sanctuary Sun Boat IV',
    category: 'Luxury',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-36 Guests',
    price: 'From $2,800',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Award-Winning', 'Rooftop Terrace', 'Gourmet Cuisine', 'Expert Guides'],
    description: 'Award-winning luxury vessel offering intimate Nile experiences with exceptional cuisine and personalized service.',
    itinerary: 'Day 1: Welcome aboard in Aswan. Day 2: High Dam, Philae Temple. Day 3: Kom Ombo, Edfu by horse carriage. Day 4: West Bank exploration. Day 5: Karnak at sunrise, Luxor Temple. Days 6-7: Optional extensions.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'sonesta-star-goddess',
    name: 'Sonesta Star Goddess',
    category: 'Luxury',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-33 Guests',
    price: 'From $2,500',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['All-Suite', 'Panoramic Views', 'Spa Services', 'Live Entertainment'],
    description: 'All-suite luxury with panoramic Nile views. Intimate atmosphere with exceptional dining and entertainment.',
    itinerary: 'Day 1: Luxor embarkation, welcome reception. Day 2: Valley of Kings, Colossi of Memnon. Day 3: Edfu Temple exploration. Day 4: Kom Ombo, sailing to Aswan. Day 5: Philae Temple, Nubian village. Days 6-7: Abu Simbel option.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'historia-cruise',
    name: 'Historia',
    category: 'Luxury',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-30 Guests',
    price: 'From $2,400',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Historic Elegance', 'Library', 'Sun Deck', 'Cultural Programs'],
    description: 'Classic elegance with modern comforts. Experience the golden age of Nile cruising with refined service.',
    itinerary: 'Day 1: Aswan boarding, afternoon tea. Day 2: Philae, High Dam visit. Day 3: Double Temple of Kom Ombo. Day 4: Edfu, sailing through locks. Day 5: Luxor temples and tombs. Days 6-7: Extended options available.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'movenpick-sun-ray',
    name: 'Movenpick MS Sun Ray',
    category: 'Luxury',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-56 Guests',
    price: 'From $2,200',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Swiss Hospitality', 'Pool & Spa', 'Multiple Restaurants', 'Evening Shows'],
    description: 'Swiss hospitality on the Nile. Spacious accommodations with multiple dining venues and wellness facilities.',
    itinerary: 'Day 1: Luxor welcome, orientation cruise. Day 2: West Bank full day. Day 3: Esna Lock, Edfu Temple. Day 4: Kom Ombo sunset visit. Day 5: Aswan exploration, felucca. Days 6-7: Abu Simbel excursion available.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'sun-goddess',
    name: 'Sun Goddess',
    category: 'Luxury',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-40 Guests',
    price: 'From $2,100',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Elegant Suites', 'Observation Lounge', 'Wellness Center', 'Private Tours'],
    description: 'Elegant and intimate cruising experience with attentive service and beautifully appointed suites.',
    itinerary: 'Day 1: Aswan embarkation. Day 2: Philae Temple morning visit. Day 3: Kom Ombo crocodile museum. Day 4: Edfu Temple by carriage. Day 5: Valley of Kings, Queens. Days 6-7: Luxor extensions.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'jaz-viceroy',
    name: 'Jaz Viceroy',
    category: 'Luxury',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-48 Guests',
    price: 'From $2,000',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Rooftop Pool', 'Fitness Center', 'Kids Club', 'Nightly Entertainment'],
    description: 'Contemporary luxury perfect for families and couples alike with excellent facilities and service.',
    itinerary: 'Day 1: Luxor boarding, welcome dinner. Day 2: Karnak, Luxor Temple. Day 3: West Bank treasures. Day 4: Edfu exploration. Day 5: Kom Ombo, Aswan arrival. Days 6-7: Optional excursions.',
    vesselType: 'Luxury Cruise'
  },
  {
    id: 'soleil-cruise',
    name: 'Soleil',
    category: 'Luxury',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-44 Guests',
    price: 'From $1,900',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['French Cuisine', 'Wine Selection', 'Sundeck Jacuzzi', 'Cultural Lectures'],
    description: 'French-inspired luxury with exceptional cuisine and wine. Intimate vessel with sophisticated ambiance.',
    itinerary: 'Day 1: Aswan welcome aboard. Day 2: Temple of Isis at Philae. Day 3: Crocodile Temple visit. Day 4: Horus Temple at Edfu. Day 5: Luxor monuments. Days 6-7: Extended stays available.',
    vesselType: 'Luxury Cruise'
  },
  // Deluxe Nile Cruises
  {
    id: 'golden-nile',
    name: 'Golden Nile',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-60 Guests',
    price: 'From $1,400',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Spacious Cabins', 'Pool Deck', 'Egyptian Cuisine', 'Guided Tours'],
    description: 'Premium comfort with excellent value. Spacious cabins and comprehensive tour programs.',
    itinerary: 'Day 1: Luxor embarkation. Day 2: Karnak Temple complex. Day 3: Valley of Kings tour. Day 4: Edfu Temple visit. Day 5: Aswan sightseeing. Days 6-7: Optional extensions.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'chateau-lafayette',
    name: 'Chateau Lafayette',
    category: 'Deluxe',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-55 Guests',
    price: 'From $1,350',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['French Design', 'Lounge Bar', 'Observation Deck', 'Professional Crew'],
    description: 'French-designed elegance with comfortable accommodations and attentive crew service.',
    itinerary: 'Day 1: Aswan welcome. Day 2: Philae Temple morning. Day 3: Kom Ombo exploration. Day 4: Edfu ancient site. Day 5: Luxor temples. Days 6-7: Additional tours available.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'ms-salacia',
    name: 'MS Salacia',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-50 Guests',
    price: 'From $1,300',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Modern Amenities', 'Sundeck', 'Full Board', 'Expert Guides'],
    description: 'Modern vessel with excellent amenities and professional Egyptologist guides.',
    itinerary: 'Day 1: Luxor boarding. Day 2: West Bank tour. Day 3: Esna, Edfu temples. Day 4: Kom Ombo visit. Day 5: Aswan highlights. Days 6-7: Abu Simbel option.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'nile-premium',
    name: 'Nile Premium',
    category: 'Deluxe',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-65 Guests',
    price: 'From $1,250',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Comfortable Cabins', 'Restaurant', 'Entertainment', 'Shore Excursions'],
    description: 'Quality cruising experience with comfortable cabins and comprehensive shore excursions.',
    itinerary: 'Day 1: Aswan embark. Day 2: Temple visits. Day 3: Sailing and sites. Day 4: Edfu exploration. Day 5: Luxor arrival. Days 6-7: Extensions possible.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'ms-royal-terrasse',
    name: 'MS Royal La Terrasse',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-58 Guests',
    price: 'From $1,200',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Terrace Dining', 'Pool', 'Lounge', 'Cultural Shows'],
    description: 'Charming vessel featuring outdoor terrace dining and excellent cultural entertainment.',
    itinerary: 'Day 1: Luxor welcome. Day 2: Temple tours. Day 3: Sailing south. Day 4: Temple visits. Day 5: Aswan exploration. Days 6-7: Optional excursions.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'ms-nile-goddess',
    name: 'MS Nile Goddess',
    category: 'Deluxe',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-52 Guests',
    price: 'From $1,150',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Elegant Interiors', 'Sun Deck', 'Egyptian Nights', 'Friendly Staff'],
    description: 'Elegant interiors and warm hospitality make this a wonderful choice for Nile exploration.',
    itinerary: 'Day 1: Aswan boarding. Day 2: Philae Temple. Day 3: Kom Ombo visit. Day 4: Edfu Temple. Day 5: Luxor sites. Days 6-7: Extensions available.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'alyssa-cruise',
    name: 'Alyssa',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-48 Guests',
    price: 'From $1,100',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Cozy Atmosphere', 'Good Food', 'Guided Visits', 'Value'],
    description: 'Cozy atmosphere with quality food and well-organized guided temple visits.',
    itinerary: 'Day 1: Luxor start. Day 2: Temple complex. Day 3: Valley exploration. Day 4: River temples. Day 5: Aswan arrival. Days 6-7: Additional options.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'renaissance-cruise',
    name: 'Renaissance',
    category: 'Deluxe',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-54 Guests',
    price: 'From $1,050',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Classic Style', 'Full Board', 'Entertainment', 'Tours Included'],
    description: 'Classic Nile cruiser offering full board and comprehensive sightseeing programs.',
    itinerary: 'Day 1: Aswan embark. Day 2: Temple day. Day 3: Sailing north. Day 4: Ancient sites. Day 5: Luxor finish. Days 6-7: Optional add-ons.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'nile-capital',
    name: 'Nile Capital',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-60 Guests',
    price: 'From $1,000',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Comfortable', 'Pool', 'Restaurant', 'Good Service'],
    description: 'Comfortable vessel with pool and restaurant serving quality Egyptian cuisine.',
    itinerary: 'Day 1: Luxor boarding. Day 2: Karnak visit. Day 3: West Bank. Day 4: Temple stops. Day 5: Aswan. Days 6-7: Extensions.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'iberotel-crown',
    name: 'Iberotel Crown Emperor',
    category: 'Deluxe',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-62 Guests',
    price: 'From $950',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Reliable Service', 'Clean Cabins', 'Good Food', 'Guides'],
    description: 'Reliable service with clean cabins and consistent quality throughout your journey.',
    itinerary: 'Day 1: Aswan start. Day 2: Philae visit. Day 3: Temple tour. Day 4: Edfu stop. Day 5: Luxor end. Days 6-7: Options available.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'blue-shadow',
    name: 'Blue Shadow',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-55 Guests',
    price: 'From $900',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Modern Design', 'Sundeck', 'Meals Included', 'Tours'],
    description: 'Modern design with comfortable sundeck for relaxing between temple visits.',
    itinerary: 'Day 1: Luxor board. Day 2: Ancient sites. Day 3: Sailing day. Day 4: More temples. Day 5: Aswan. Days 6-7: Add-ons.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'al-hambra',
    name: 'Al Hambra',
    category: 'Deluxe',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-58 Guests',
    price: 'From $850',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Arabic Style', 'Comfortable', 'All Meals', 'Excursions'],
    description: 'Arabic-inspired design with comfortable cabins and all meals included.',
    itinerary: 'Day 1: Aswan welcome. Day 2: Temple visits. Day 3: Sailing. Day 4: Edfu. Day 5: Luxor. Days 6-7: Optional.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'concerto-cruise',
    name: 'Concerto',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-52 Guests',
    price: 'From $800',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Pleasant Cruise', 'Good Value', 'Full Program', 'Friendly'],
    description: 'Pleasant cruising experience with good value and a comprehensive touring program.',
    itinerary: 'Day 1: Luxor. Day 2: Temples. Day 3: Sailing. Day 4: Sites. Day 5: Aswan. Days 6-7: Extensions.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'hs-kon-tiki',
    name: 'H/S Kon Tiki',
    category: 'Deluxe',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-50 Guests',
    price: 'From $750',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Unique Character', 'Experienced Crew', 'Cultural', 'Value'],
    description: 'Unique vessel with experienced crew delivering authentic Nile experiences.',
    itinerary: 'Day 1: Aswan. Day 2: Philae. Day 3: Temples. Day 4: Edfu. Day 5: Luxor. Days 6-7: Options.',
    vesselType: 'Deluxe Cruise'
  },
  {
    id: 'ms-nile-style',
    name: 'M/S Nile Style',
    category: 'Deluxe',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-48 Guests',
    price: 'From $700',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Stylish', 'Comfortable', 'Affordable', 'Complete Tours'],
    description: 'Stylish vessel offering comfortable cruising at an affordable price point.',
    itinerary: 'Day 1: Luxor start. Day 2: Exploration. Day 3: Sailing. Day 4: Temples. Day 5: Aswan end. Days 6-7: Available.',
    vesselType: 'Deluxe Cruise'
  },
  // Standard Nile Cruises
  {
    id: 'radamis-ii',
    name: 'Radamis II',
    category: 'Standard',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-70 Guests',
    price: 'From $550',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Great Value', 'Full Program', 'Clean', 'Friendly Staff'],
    description: 'Excellent value with complete touring programs and friendly, attentive staff.',
    itinerary: 'Day 1: Luxor. Day 2: Temples. Day 3: Valley tour. Day 4: Sailing. Day 5: Aswan. Days 6-7: Optional.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'princess-sarah',
    name: 'Princess Sarah',
    category: 'Standard',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-65 Guests',
    price: 'From $520',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Budget Friendly', 'All Inclusive', 'Good Tours', 'Pool'],
    description: 'Budget-friendly all-inclusive option with good touring programs and onboard pool.',
    itinerary: 'Day 1: Aswan. Day 2: Philae. Day 3: Kom Ombo. Day 4: Edfu. Day 5: Luxor. Days 6-7: Extensions.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'tower-prestige',
    name: 'Tower Prestige',
    category: 'Standard',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-68 Guests',
    price: 'From $500',
    rating: 3.9,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Affordable', 'Complete Package', 'Decent Cabins', 'Tours'],
    description: 'Affordable complete package with decent cabin accommodations and full tour program.',
    itinerary: 'Day 1: Luxor. Day 2: Sites. Day 3: Sailing. Day 4: Temples. Day 5: Aswan. Days 6-7: Options.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'royal-esadora',
    name: 'Royal Esadora',
    category: 'Standard',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-72 Guests',
    price: 'From $480',
    rating: 3.9,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Economy', 'Full Board', 'Guides', 'Pool'],
    description: 'Economy option with full board, experienced guides, and refreshing pool.',
    itinerary: 'Day 1: Aswan start. Day 2: Temples. Day 3: Sailing. Day 4: More sites. Day 5: Luxor. Days 6-7: Add-ons.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'a-sara',
    name: 'A Sara',
    category: 'Standard',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-60 Guests',
    price: 'From $450',
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Value', 'Meals Included', 'Basic Comfort', 'Tours'],
    description: 'Good value with meals included, basic comfortable cabins, and complete tours.',
    itinerary: 'Day 1: Luxor. Day 2: Karnak. Day 3: West Bank. Day 4: Sailing. Day 5: Aswan. Days 6-7: Optional.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'la-sara',
    name: 'LA Sara',
    category: 'Standard',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-58 Guests',
    price: 'From $430',
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Budget Option', 'All Meals', 'Sightseeing', 'Clean'],
    description: 'Budget-conscious choice with all meals and comprehensive sightseeing included.',
    itinerary: 'Day 1: Aswan. Day 2: Philae. Day 3: Temples. Day 4: Edfu. Day 5: Luxor. Days 6-7: Extensions.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'princess-sarah-ii',
    name: 'Princess Sarah II',
    category: 'Standard',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-62 Guests',
    price: 'From $420',
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Economical', 'Full Package', 'Friendly', 'Tours'],
    description: 'Economical full package cruise with friendly service and complete touring.',
    itinerary: 'Day 1: Luxor board. Day 2: Ancient sites. Day 3: Sailing. Day 4: Temples. Day 5: Aswan. Days 6-7: Options.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'nile-story',
    name: 'Nile Story',
    category: 'Standard',
    location: 'Aswan to Luxor',
    duration: '4-7 Nights',
    groupSize: '2-55 Guests',
    price: 'From $400',
    rating: 3.7,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Authentic', 'Value', 'Full Board', 'Guided'],
    description: 'Authentic Nile experience at accessible prices with full board and guided tours.',
    itinerary: 'Day 1: Aswan. Day 2: Temple day. Day 3: Sailing. Day 4: Sites. Day 5: Luxor. Days 6-7: Available.',
    vesselType: 'Standard Cruise'
  },
  {
    id: 'ms-nile-dolphin',
    name: 'M/S Nile Dolphin',
    category: 'Standard',
    location: 'Luxor to Aswan',
    duration: '4-7 Nights',
    groupSize: '2-50 Guests',
    price: 'From $380',
    rating: 3.7,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: ['Most Affordable', 'Complete Tours', 'Basic Comfort', 'Friendly'],
    description: 'Most affordable option with complete tours, basic comfort, and friendly atmosphere.',
    itinerary: 'Day 1: Luxor. Day 2: Tours. Day 3: Sailing. Day 4: Temples. Day 5: Aswan. Days 6-7: Optional add-ons.',
    vesselType: 'Standard Cruise'
  }
];

export default function NileCruise() {
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Cruises', icon: Ship },
    { key: 'Luxury', label: 'Luxury', icon: Crown },
    { key: 'Deluxe', label: 'Deluxe', icon: Star },
    { key: 'Standard', label: 'Standard', icon: Anchor }
  ];

  const filteredTours = selectedCategory === 'all'
    ? nileCruiseTours
    : nileCruiseTours.filter(tour => tour.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    if (category === 'Luxury') return Crown;
    if (category === 'Deluxe') return Star;
    return Anchor;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-background via-accent/5 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568322445389-f64ac2515020?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/egypt-tour-packages">
            <Button variant="outline" className="mb-8 hover:scale-105 transition-transform">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experiences
            </Button>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 mb-8">
              <Ship className="h-6 w-6 text-accent" />
              <span className="text-accent font-semibold">Nile Cruise Collection</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
              Nile Cruise
              <span className="block text-accent">Experience</span>
            </h1>

            <div className="w-32 h-px bg-accent mx-auto mb-8"></div>

            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              Sail through ancient Egypt aboard our curated collection of luxury, deluxe, and standard vessels.
              From world-class floating palaces to comfortable cruise ships, find your perfect Nile journey.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Crown className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">9 Luxury Cruises</h3>
                <p className="text-sm text-muted-foreground">5-star floating hotels</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Star className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">15 Deluxe Cruises</h3>
                <p className="text-sm text-muted-foreground">Premium comfort</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Anchor className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">9 Standard Cruises</h3>
                <p className="text-sm text-muted-foreground">Quality & value</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Button
                  key={cat.key}
                  variant={selectedCategory === cat.key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.key)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cruises Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              {selectedCategory === 'all' ? 'All Nile Cruises' : `${selectedCategory} Nile Cruises`}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {filteredTours.length} cruises available. Click on any cruise to view the full itinerary.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => {
              const CategoryIcon = getCategoryIcon(tour.category);
              return (
                <Card
                  key={tour.id}
                  className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] flex flex-col h-full min-h-[600px]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <CategoryIcon className="h-3 w-3" />
                      {tour.vesselType}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-accent font-medium text-sm mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{tour.location}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">{tour.name}</h3>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col justify-between flex-grow">
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{tour.groupSize}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {tour.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tour.highlights.slice(0, 3).map((highlight: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                      <div>
                        <p className="text-2xl font-serif font-bold text-primary">{tour.price}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTour(selectedTour === tour.id ? null : tour.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          {selectedTour === tour.id ? 'Hide' : 'Details'}
                        </Button>
                        <Button size="sm" asChild className="hover:scale-105 transition-transform">
                          <Link href="/contact">
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {selectedTour === tour.id && (
                      <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-accent/20">
                        <h4 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-accent" />
                          Complete Itinerary
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-background/50 p-4 rounded-lg">
                            <p className="text-muted-foreground leading-relaxed">
                              {tour.itinerary}
                            </p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="font-semibold text-primary">Duration</div>
                              <div className="text-muted-foreground">{tour.duration}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="font-semibold text-primary">Group Size</div>
                              <div className="text-muted-foreground">{tour.groupSize}</div>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-border">
                            <h5 className="font-semibold text-primary mb-2">All Highlights</h5>
                            <div className="flex flex-wrap gap-2">
                              {tour.highlights.map((highlight: string, index: number) => (
                                <span
                                  key={index}
                                  className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium"
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              What's Included in Every Cruise
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, title: 'Guided Temple Tours', desc: 'Expert Egyptologist guides' },
              { icon: Users, title: 'Full Board Dining', desc: 'All meals included' },
              { icon: Ship, title: 'Scenic Sailing', desc: 'Breathtaking Nile views' },
              { icon: Heart, title: 'Entertainment', desc: 'Cultural shows nightly' }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FeatureIcon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Sail the Nile?
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl mb-10 leading-relaxed opacity-90">
            Let our cruise specialists help you choose the perfect Nile journey. From luxury floating palaces to
            comfortable cruise ships, we'll create your ideal river adventure.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg min-w-[200px] hover:scale-105 transition-transform">
                Plan Your Cruise
              </Button>
            </Link>
            <Link href="/egypt-tour-packages">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg min-w-[200px] border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover:scale-105 transition-all">
                See All Experiences
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

