
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Clock, Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Sample blog posts data (fallback)
const sampleBlogPosts = [
  {
    id: 'ancient-egypt-mysteries',
    title: 'Unveiling the Mysteries of Ancient Egypt: A Journey Through Time',
    excerpt: 'Discover the fascinating secrets of pharaohs, pyramids, and ancient Egyptian civilization that continue to captivate travelers from around the world.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead">For over five millennia, the mysteries of ancient Egypt have captivated the human imagination. From the towering pyramids that pierce the desert sky to the golden treasures of Tutankhamun, Egypt remains the world's greatest open-air museum, where every stone tells a story of divine pharaohs, ambitious builders, and a civilization that achieved immortality through stone.</p>

        <h2>The Pyramid Complex: Engineering Marvels of the Ancient World</h2>
        <p>The Great Pyramid of Giza, the last surviving wonder of the ancient world, continues to baffle engineers and archaeologists alike. Built over 4,500 years ago for Pharaoh Khufu, this architectural masterpiece consists of approximately 2.3 million stone blocks, each weighing between 2.5 and 15 tons. The precision with which these monuments were constructed—aligned perfectly with cardinal directions and celestial bodies—speaks to a sophisticated understanding of mathematics, astronomy, and engineering that rivals modern capabilities.</p>

        <p>Recent discoveries using cosmic ray imaging have revealed hidden chambers within the Great Pyramid, suggesting that we have only begun to unlock the secrets these monuments hold. The pyramid complex at Giza, including the enigmatic Sphinx with its weathered features gazing eternally eastward, represents not just tombs but complete religious and ceremonial centers designed to ensure the pharaoh's successful journey to the afterlife.</p>

        <h2>The Valley of the Kings: Portal to Eternity</h2>
        <p>Hidden in the hills west of Luxor, the Valley of the Kings served as the royal necropolis for pharaohs of the New Kingdom (1550-1077 BCE). Here, beneath the pyramid-shaped peak of Al-Qurn, lie the tombs of some of Egypt's most powerful rulers, including Tutankhamun, Ramesses II, and Seti I.</p>

        <p>The tomb walls are adorned with intricate paintings and hieroglyphic texts from the Book of the Dead, providing detailed maps for navigating the afterlife. These vivid frescoes, preserved in Egypt's dry climate, offer glimpses into ancient Egyptian beliefs about death, rebirth, and the eternal journey of the soul. Each tomb tells a unique story, from the hasty burial of the young Tutankhamun to the magnificent corridors of Seti I's tomb, considered one of the finest in the valley.</p>

        <h2>Deciphering Hieroglyphs: The Rosetta Stone Revolution</h2>
        <p>The discovery of the Rosetta Stone in 1799 by Napoleon's troops marked a turning point in our understanding of ancient Egypt. This granodiorite stele, inscribed with the same decree in three scripts—hieroglyphic, demotic, and ancient Greek—provided French scholar Jean-François Champollion with the key to deciphering hieroglyphs after more than 1,400 years of silence.</p>

        <p>This breakthrough opened floodgates of knowledge, allowing us to read the voices of ancient pharaohs, priests, and scribes. Temple walls, papyrus scrolls, and tomb inscriptions revealed stories of conquest and diplomacy, religious ceremonies and daily life, transforming our understanding of this remarkable civilization from mysterious symbols to human narratives spanning three millennia.</p>

        <h2>Modern Egypt: Where Ancient Meets Contemporary</h2>
        <p>Today's Egypt offers travelers the unique opportunity to walk in the footsteps of pharaohs while experiencing the vibrant culture of modern Egypt. In Cairo, the medieval Islamic quarter coexists with ancient monuments, while the new Grand Egyptian Museum near the Pyramids promises to be the world's largest archaeological museum.</p>

        <p>Luxury travel in Egypt has evolved to offer unprecedented access to these wonders. Private after-hours visits to temples, exclusive archaeological site tours with renowned Egyptologists, and intimate dinner settings with pyramid backdrops create unforgettable experiences that honor both the ancient and the contemporary.</p>

        <h2>The Eternal Appeal</h2>
        <p>What makes Egypt eternally fascinating is not just the grandeur of its monuments, but the human stories they preserve. These are testimonies to ambition, faith, love, and the universal human desire for immortality. Whether standing before the colossal statues of Abu Simbel, cruising the Nile as pharaohs once did, or exploring hidden tombs in the Valley of the Kings, visitors to Egypt don't just see history—they experience the dreams and achievements of one of humanity's greatest civilizations.</p>

        <p>As Egypt continues to reveal its secrets through ongoing archaeological discoveries, each visit offers the possibility of witnessing history in the making, making it not just a destination, but a journey through the very essence of human civilization.</p>
      </div>
    `,
    author: 'Dr. Sarah Mitchell',
    publishedAt: '2024-03-15',
    readTime: '8 min read',
    category: 'Culture & History',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d04136?q=80&w=2070&auto=format&fit=crop',
    tags: ['Ancient Egypt', 'Pyramids', 'History', 'Culture']
  },
  {
    id: 'luxury-nile-cruise-guide',
    title: 'The Ultimate Guide to Luxury Nile River Cruises',
    excerpt: 'Experience the magic of sailing the legendary Nile River aboard world-class luxury vessels with exclusive amenities and unparalleled service.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead">The Nile River, lifeblood of ancient Egypt and the world's longest river, offers one of the most enchanting and culturally rich cruise experiences on Earth. A luxury Nile cruise combines the romance of river travel with the majesty of ancient monuments, creating an unforgettable journey through 5,000 years of history.</p>

        <h2>The Classic Route: Aswan to Luxor</h2>
        <p>The traditional Nile cruise route between Aswan and Luxor covers approximately 200 kilometers of the most historically significant stretch of the river. This 3-7 day journey takes you past some of Egypt's most remarkable temples and monuments, each with its own story to tell.</p>

        <p>Starting in Aswan, with its granite quarries and Nubian culture, the journey includes stops at the Temple of Kom Ombo, dedicated to the crocodile god Sobek and the falcon-headed Horus; the remarkably preserved Temple of Horus at Edfu; and the atmospheric Temple of Khnum at Esna, before culminating in Luxor, home to the magnificent Karnak and Luxor temples and gateway to the Valley of the Kings.</p>

        <h2>Luxury Vessel Categories: From Elegant to Extraordinary</h2>
        
        <h3>Premium Cruise Ships</h3>
        <p>Modern luxury cruise ships on the Nile typically accommodate 70-150 guests in spacious cabins with panoramic windows, private balconies, and marble-appointed bathrooms. These vessels feature multiple restaurants, spas, swimming pools, and evening entertainment, providing resort-like amenities while floating through ancient landscapes.</p>

        <h3>Boutique River Ships</h3>
        <p>Smaller boutique vessels, hosting 20-60 guests, offer more intimate experiences with higher crew-to-guest ratios and personalized service. These ships often feature unique design elements reflecting Egyptian heritage, from lotus-inspired décor to reproduction antiques, creating an atmosphere that honors the river's storied past.</p>

        <h3>Private Dahabiyas</h3>
        <p>For the ultimate in exclusivity, traditional sailing vessels called dahabiyas offer private charters for 6-12 guests. These elegant yachts, reminiscent of the boats used by 19th-century European travelers, feature just 3-6 luxurious suites, personal crew, and completely customizable itineraries. With their distinctive lateen sails and intimate atmosphere, dahabiyas provide the most romantic and authentic Nile experience.</p>

        <h2>Onboard Luxury Amenities</h2>
        <p>Today's luxury Nile cruises rival the world's finest hotels in their amenities and service standards. Expect spa facilities offering traditional Egyptian treatments with ingredients like Cleopatra's milk and honey, fitness centers with panoramic river views, and multiple dining venues serving everything from authentic Egyptian cuisine to international gourmet fare.</p>

        <p>Many vessels feature sun decks with swimming pools, perfect for relaxing between temple visits, while libraries stocked with Egyptology references and comfortable lounges provide spaces for quiet contemplation of the day's discoveries. Evening entertainment might include traditional Nubian music performances, whirling dervish shows, or lectures by onboard Egyptologists.</p>

        <h2>Temple Visits and Guided Experiences</h2>
        <p>The true magic of a Nile cruise lies in the guided explorations of ancient temples and monuments. Expert Egyptologists accompany guests, bringing hieroglyphs to life and explaining the religious and historical significance of each site. Many luxury cruises offer exclusive access experiences, such as early morning visits to avoid crowds or special evening illumination ceremonies.</p>

        <p>Highlights include the Temple of Philae, dedicated to the goddess Isis and relocated stone by stone to its current island location; the colossal twin temples of Abu Simbel, built by Ramesses II; and the Unfinished Obelisk in Aswan's granite quarries, which provides insights into ancient Egyptian stone-working techniques.</p>

        <h2>Seasonal Considerations and Best Times</h2>
        <p>The optimal time for Nile cruising is during Egypt's cooler months, from October through April. During this period, daytime temperatures are pleasant for sightseeing, ranging from 20-25°C (68-77°F), while evenings are cool enough to enjoy the ship's outdoor spaces comfortably.</p>

        <p>Winter months (December-February) offer the most comfortable weather but also the highest crowds and prices. The shoulder seasons of October-November and March-April provide an excellent balance of favorable weather and fewer tourists, making them ideal for luxury travelers seeking a more intimate experience.</p>

        <h2>Cultural Immersion and Local Encounters</h2>
        <p>Luxury Nile cruises increasingly emphasize authentic cultural experiences beyond temple visits. These might include visits to traditional Nubian villages, where guests can experience local hospitality and learn about Nubian culture and traditions that have persisted for millennia along the Nile's banks.</p>

        <p>Some cruises incorporate visits to local markets, spice souks, and artisan workshops where traditional crafts like pottery, weaving, and jewelry-making continue ancient techniques. These interactions provide deeper understanding of how the Nile continues to sustain communities today, just as it has for thousands of years.</p>

        <h2>Planning Your Luxury Nile Experience</h2>
        <p>When selecting a luxury Nile cruise, consider factors beyond just amenities and price. The quality and expertise of guides can make the difference between a good trip and a transformative experience. Look for cruises that employ certified Egyptologists and offer small group sizes for temple visits.</p>

        <p>Consider extending your cruise with overland excursions to Abu Simbel, visits to Cairo's museums and pyramids, or relaxation time at Red Sea resorts. Many luxury travel specialists offer comprehensive packages that seamlessly combine Nile cruising with other Egyptian experiences for a complete luxury adventure.</p>

        <p>A luxury Nile cruise is more than a vacation—it's a journey through the cradle of civilization, where every sunset over ancient temples reminds you that you're following in the wake of pharaohs, traveling one of humanity's most historic waterways in unparalleled comfort and style.</p>
      </div>
    `,
    author: 'Ahmed Hassan',
    publishedAt: '2024-03-10',
    readTime: '12 min read',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1578925441513-b3c1bd1bb0e8?q=80&w=2070&auto=format&fit=crop',
    tags: ['Nile Cruise', 'Luxury Travel', 'River Journey', 'Egypt']
  },
  {
    id: 'hidden-gems-egypt',
    title: 'Hidden Gems of Egypt: Beyond the Tourist Trail',
    excerpt: 'Explore Egypt\'s best-kept secrets, from remote oases to lesser-known archaeological sites that offer authentic and intimate experiences.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead">While the Pyramids of Giza and the temples of Luxor rightfully claim their place among the world's greatest wonders, Egypt's true magic often lies in its lesser-known treasures. These hidden gems offer intimate encounters with history, culture, and natural beauty away from the crowds, providing authentic experiences that reveal the soul of this ancient land.</p>

        <h2>Siwa Oasis: Egypt's Most Remote Paradise</h2>
        <p>Nearly 600 kilometers from Cairo, Siwa Oasis feels like a world apart. This isolated desert sanctuary, home to the Oracle of Amun that Alexander the Great consulted, remains largely untouched by mass tourism. The oasis is renowned for its natural hot springs, including Cleopatra's Spring, where crystal-clear thermal waters provide a magical swimming experience surrounded by date palms.</p>

        <p>The medieval mud-brick fortress of Shali dominates the town, its organic architecture crumbling romantically back to the earth. Berber culture thrives here, with traditional crafts, music, and customs preserved by the friendly Siwan people. Visitors can explore the ancient necropolis of Gebel al-Mawta, swim in pristine salt lakes, and experience the profound silence of the Great Sand Sea during sunset camel treks.</p>

        <h2>Wadi Al-Hitan: Valley of the Whales</h2>
        <p>Deep in the Fayoum Depression lies one of Egypt's most extraordinary natural heritage sites. Wadi Al-Hitan, designated a UNESCO World Heritage Site, preserves the remains of ancient whales that lived in the Tethys Sea 40 million years ago. This open-air museum of evolution tells the story of how whales evolved from land to sea creatures.</p>

        <p>The fossils here are so well-preserved that they include not just bones but also stomach contents, revealing what these ancient giants ate. The landscape itself is hauntingly beautiful, with sculptural sandstone formations and petrified mangrove roots creating a surreal moonscape that feels like stepping into another world entirely.</p>

        <h2>Abydos: The Holy City of Ancient Egypt</h2>
        <p>While Luxor draws millions of visitors, nearby Abydos remains surprisingly quiet despite housing some of Egypt's most beautiful and significant temples. The Temple of Seti I at Abydos features the finest relief carving in all of Egypt, with colors so vivid they appear to have been painted yesterday.</p>

        <p>This was ancient Egypt's holiest city, dedicated to Osiris, god of the afterlife. Every pharaoh made pilgrimage here, and many built cenotaphs (symbolic tombs) to ensure their connection to Osiris in death. The famous Abydos King List, inscribed on the temple walls, provides one of the most complete records of pharaonic succession, making it invaluable to Egyptologists and history enthusiasts.</p>

        <h2>Dendera Temple Complex: Celestial Wonder</h2>
        <p>The Temple of Hathor at Dendera, about 60 kilometers north of Luxor, showcases some of the most stunning astronomical ceiling decorations in Egypt. The famous Dendera Zodiac (the original is now in the Louvre) represents one of the most complete ancient star maps ever discovered.</p>

        <p>What makes Dendera extraordinary is its state of preservation. The temple's halls retain their roofs, creating an intimate, almost mysterious atmosphere as sunlight filters through clerestory windows. The crypts beneath the temple, decorated with scenes of Hathor and Horus, can be explored with special permission, offering glimpses into the secret religious practices of ancient Egypt.</p>

        <h2>White Desert National Park: Nature's Sculpture Garden</h2>
        <p>The Western Desert's White Desert creates one of the most surreal landscapes on Earth. Chalk-white rock formations sculpted by wind and sand over millennia create an otherworldly terrain that resembles alien mushrooms, animal shapes, and abstract art installations.</p>

        <p>Camping overnight in the White Desert ranks among Egypt's most magical experiences. As the sun sets, the white formations glow pink and orange, while the clear desert sky reveals brilliant stars unmarred by light pollution. The silence is profound, broken only by the gentle whoosh of desert wind through the limestone sculptures.</p>

        <h2>El Qasr: Medieval Village Frozen in Time</h2>
        <p>In the Dakhla Oasis, the village of El Qasr preserves medieval Islamic architecture like nowhere else in Egypt. Narrow covered streets wind between multi-story mud-brick houses with intricately carved wooden lintels and mashrabiya screens. The village's medieval mosque, school, and courthouse remain largely intact.</p>

        <p>Walking through El Qasr feels like traveling back in time to medieval Egypt. Local families still live in these ancient houses, maintaining traditional crafts and agricultural practices. The village offers authentic cultural exchange opportunities, from learning traditional bread-making to participating in date harvest festivals.</p>

        <h2>Berenice: Red Sea's Archaeological Secret</h2>
        <p>While Hurghada and Sharm El-Sheikh attract diving enthusiasts, the ancient port of Berenice in the far south remains largely unexplored. Recent archaeological excavations have uncovered a remarkable Ptolemaic and Roman trading port that connected Egypt with India and the Far East via the Red Sea.</p>

        <p>The site includes temple ruins, ancient harbors, and residential quarters, but its remote location means visitors often have the ruins entirely to themselves. The nearby Red Sea coast offers pristine coral reefs and marine life without the crowds, making it perfect for those seeking both cultural exploration and underwater adventures.</p>

        <h2>Hermopolis and Tuna el-Gebel: City of Thoth</h2>
        <p>The ancient city of Hermopolis, dedicated to Thoth, god of wisdom and writing, offers fascinating insights into Greco-Roman Egypt. The nearby necropolis of Tuna el-Gebel features unique tomb architecture blending pharaonic, Greek, and Roman styles.</p>

        <p>The tomb of Petosiris stands out for its remarkable fusion of Egyptian and Hellenistic art, while the catacombs contain thousands of mummified ibis birds sacred to Thoth. The site's relative obscurity means visitors can explore these remarkable monuments in peaceful solitude, often with personalized attention from local guides eager to share their knowledge.</p>

        <h2>Experiencing Hidden Egypt</h2>
        <p>Accessing these hidden gems often requires specialized local knowledge and arrangements. Many sites have limited infrastructure and irregular opening hours, making expert local guides essential. The rewards, however, are immeasurable: authentic cultural encounters, unprecedented access to archaeological sites, and the rare privilege of experiencing Egypt's magic away from crowds.</p>

        <p>For luxury travelers, these hidden destinations can be incorporated into bespoke itineraries that combine comfort with adventure. Private 4WD expeditions, exclusive camping experiences, and chartered flights to remote oases ensure that exploring Egypt's secrets doesn't mean sacrificing comfort or safety.</p>

        <p>These hidden gems remind us that Egypt's treasures extend far beyond its famous monuments. They offer opportunities for discovery, contemplation, and genuine connection with local communities, creating travel memories that last a lifetime and stories that few others can tell.</p>
      </div>
    `,
    author: 'Layla Abdel Rahman',
    publishedAt: '2024-03-05',
    readTime: '10 min read',
    category: 'Destinations',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop',
    tags: ['Hidden Gems', 'Off the Beaten Path', 'Adventure', 'Desert']
  },
  {
    id: 'egyptian-cuisine-journey',
    title: 'A Culinary Journey Through Egyptian Flavors',
    excerpt: 'Savor the rich tapestry of Egyptian cuisine, from street food delights to gourmet dining experiences that reflect centuries of culinary tradition.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead">Egyptian cuisine is a reflection of the country's rich history and cultural crossroads, blending ancient traditions with influences from Mediterranean, Middle Eastern, and African culinary practices. From the aromatic spices of Khan el-Khalili's markets to the refined presentations in luxury hotels, Egyptian food tells the story of a civilization that has celebrated flavor and hospitality for millennia.</p>

        <h2>Ancient Ingredients, Timeless Flavors</h2>
        <p>Many ingredients fundamental to Egyptian cuisine have been cultivated along the Nile for thousands of years. Fava beans, the foundation of ful medames (Egypt's national dish), were found in pharaonic tombs and remain a breakfast staple today. Ancient grains like durum wheat for baladi bread, and legumes like lentils and chickpeas, continue to form the backbone of Egyptian meals.</p>

        <p>The fertile Nile Delta produces exceptional vegetables: sweet onions from Behera, tomatoes from the oases, and the famous Egyptian rice that's shorter and stickier than other varieties, perfect for dishes like roz bel laban (rice pudding) and mahshi (stuffed vegetables). Even the ancient practice of preserving foods—from pickled turnips to aged cheeses—remains central to Egyptian cooking.</p>

        <h2>Street Food: The Soul of Egyptian Cuisine</h2>
        <p>Egypt's street food scene offers some of the world's most flavorful and authentic culinary experiences. In Cairo's bustling alleys and Alexandria's historic squares, vendors create culinary magic from simple ingredients and centuries-old recipes.</p>

        <p>Koshary, often called Egypt's national dish, exemplifies this beautifully. This hearty mix of rice, lentils, chickpeas, macaroni, and vermicelli, topped with spiced tomato sauce and crispy fried onions, might sound unusual but creates a satisfying harmony of textures and flavors. Each koshary vendor has secret spice blends and sauce recipes passed down through generations.</p>

        <p>Ta'meya (Egyptian falafel) differs from its Middle Eastern cousins by using fava beans instead of chickpeas, creating a greener color and nuttier flavor. Served in fresh baladi bread with tahini, pickles, and fresh herbs, it's a complete meal that has sustained Egyptians for generations. The art lies in achieving the perfect crispy exterior while maintaining a fluffy interior.</p>

        <h2>The Art of Egyptian Bread</h2>
        <p>Bread holds sacred significance in Egyptian culture, and the country produces some of the world's most distinctive varieties. Baladi bread, baked in traditional stone ovens, creates pockets perfect for scooping up dips and stews. The bread's slightly sour tang comes from wild yeasts and long fermentation, techniques unchanged since pharaonic times.</p>

        <p>Shamsi bread, round and flat with a distinctive pattern, is traditionally baked on hot sand or stones. Fino, introduced during the French influence, represents Egypt's adaptation of European techniques. Each type serves specific culinary purposes, from the hearty baladi perfect for ful medames to delicate fino ideal for elegant sandwiches.</p>

        <h2>Spices and Aromatics: The Egyptian Pantry</h2>
        <p>Egyptian cuisine's complexity comes from its masterful use of spices and herbs. Dukkah, a mixture of ground nuts, seeds, and spices, serves both as a condiment and a snack. Each family has its own dukkah recipe, often including hazelnuts, sesame seeds, coriander, and cumin, with proportions passed down through generations.</p>

        <p>Baharat, the Egyptian spice blend, typically includes black pepper, allspice, cardamom, cinnamon, cloves, cumin, and nutmeg. This warming mixture appears in everything from meat dishes to rice preparations. Fresh herbs like parsley, cilantro, and dill feature prominently, often used in such quantities they become vegetables rather than seasonings.</p>

        <h2>Traditional Cooking Techniques</h2>
        <p>Egyptian cooking methods have evolved to make the most of available ingredients while creating complex flavors. Slow-cooking in tagines allows tough cuts of meat to become tender while developing rich, concentrated flavors. The technique of layering flavors—building spice pastes, browning aromatics, and slow-simmering—creates the depth characteristic of Egyptian cuisine.</p>

        <p>Stuffing vegetables (mahshi) represents both resourcefulness and artistry. Grape leaves, zucchini, eggplant, and peppers are hollowed out and filled with spiced rice, herbs, and sometimes meat, then slowly cooked in aromatic broths. The result is vegetables that become vessels for complex, harmonious flavors.</p>

        <h2>Sweets and Desserts: A Legacy of Celebration</h2>
        <p>Egyptian sweets reflect the country's position at the crossroads of cultures. Baklava shows Ottoman influence, while basbousa (semolina cake soaked in syrup) has purely Egyptian roots. Um Ali, Egypt's most famous dessert, tells the story of a Sultan's wife creating a celebratory sweet from bread, milk, and nuts.</p>

        <p>Kunafa, shredded pastry with sweet cheese or nuts, requires tremendous skill to prepare properly. The pastry must be paper-thin, the syrup perfectly balanced between sweet and aromatic (often flavored with orange blossom or rose water), and the timing precise to achieve the contrast between crispy exterior and creamy interior.</p>

        <h2>Modern Egyptian Cuisine: Tradition Meets Innovation</h2>
        <p>Contemporary Egyptian chefs are reinterpreting traditional dishes with modern techniques and presentations while respecting authentic flavors. Luxury hotels and upscale restaurants now offer refined versions of street food classics, elevated with premium ingredients and artistic plating.</p>

        <p>Farm-to-table movements are rediscovering heritage varieties of vegetables and grains, while modern Egyptian wines from the Nile Delta and New Valley regions are gaining international recognition, perfectly complementing the country's rich culinary traditions.</p>

        <h2>Regional Specialties</h2>
        <p>Each region of Egypt contributes unique dishes to the national cuisine. Alexandria's coastal location influences its seafood preparations, with dishes like sayadeya (spiced fish with rice) showcasing Mediterranean influences. Upper Egypt's cuisine tends to be spicier, with dishes like bamia bil lahma (okra with meat) reflecting Nubian influences.</p>

        <p>The oases each have specialties adapted to desert conditions. Date-based dishes, preserved meats, and hearty stews sustained caravan travelers and continue to delight visitors today. These regional variations demonstrate how geography and history continue to shape Egyptian cuisine.</p>

        <h2>The Culinary Experience: More Than Just Food</h2>
        <p>Egyptian dining is fundamentally social, with meals serving as opportunities for connection and hospitality. The concept of "breaking bread together" takes literal meaning, as sharing food creates bonds and shows respect. Traditional Egyptian meals unfold slowly, with multiple dishes served simultaneously for sharing.</p>

        <p>For visitors, participating in Egyptian food culture means accepting invitations to share meals, trying unfamiliar dishes, and appreciating the stories behind recipes. Whether enjoying street food from a cart in Cairo or dining in luxury restaurants overlooking the Nile, the true flavor of Egypt comes from understanding food as an expression of culture, history, and human connection.</p>

        <p>Egyptian cuisine offers travelers a delicious pathway into the country's soul, where every meal tells a story and every flavor carries the weight of history, making it an essential part of any authentic Egyptian experience.</p>
      </div>
    `,
    author: 'Chef Omar Farouk',
    publishedAt: '2024-02-28',
    readTime: '6 min read',
    category: 'Food & Culture',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070&auto=format&fit=crop',
    tags: ['Egyptian Cuisine', 'Food Culture', 'Traditional Dishes', 'Gastronomy']
  },
  {
    id: 'best-time-visit-egypt',
    title: 'When is the Best Time to Visit Egypt? A Seasonal Guide',
    excerpt: 'Plan your perfect Egyptian adventure with our comprehensive guide to Egypt\'s seasons, weather patterns, and optimal travel times.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead">Egypt's climate and seasonal variations play a crucial role in planning the perfect luxury travel experience. From the comfortable coolness of winter to the intense heat of summer, understanding Egypt's weather patterns, cultural calendar, and tourist seasons will help you choose the optimal time for your Egyptian adventure.</p>

        <h2>Egypt's Climate Overview</h2>
        <p>Egypt enjoys a desert climate characterized by hot, dry summers and mild winters with minimal rainfall. The country experiences two primary seasons rather than four distinct ones: a hot season (May through October) and a cooler season (November through April). The Nile River and Mediterranean coast provide some temperature moderation, while Upper Egypt and desert regions experience more extreme variations.</p>

        <p>Humidity levels vary significantly by region, with coastal areas experiencing higher humidity while inland desert locations remain dry year-round. This diversity means that the optimal travel time can vary depending on your specific destinations and planned activities within Egypt.</p>

        <h2>Winter Season (December - February): Peak Luxury Travel Time</h2>
        <p>Winter represents Egypt's prime luxury travel season, offering the most comfortable weather conditions for sightseeing and outdoor activities. Daytime temperatures typically range from 20-25°C (68-77°F), perfect for exploring temples, pyramids, and archaeological sites without the exhaustion that extreme heat brings.</p>

        <p>Evenings can be surprisingly cool, dropping to 8-12°C (46-54°F), making warm clothing essential for Nile cruise deck dining and desert excursions. The clear, dry air provides excellent visibility for photography and stargazing, while the comfortable temperatures make walking tours of ancient sites genuinely enjoyable rather than endurance tests.</p>

        <p>However, winter is also peak tourist season, meaning higher prices, crowded sites, and the need for advance reservations at luxury hotels and cruise ships. The trade-off between comfort and crowds requires careful consideration based on your priorities and flexibility.</p>

        <h2>Spring (March - May): The Sweet Spot</h2>
        <p>Spring offers arguably the best balance of favorable weather and manageable tourist numbers. March and April feature delightful temperatures ranging from 23-28°C (73-82°F) during the day, with pleasantly cool evenings perfect for outdoor dining and terrace relaxation.</p>

        <p>This season showcases Egypt at its most photogenic, with clear skies and excellent lighting conditions for both professional photography and personal memories. The Nile cruise experience reaches its peak during spring, as temperatures are warm enough for swimming and sunbathing but cool enough for comfortable sightseeing.</p>

        <p>May begins the transition toward summer heat, with temperatures climbing toward 30-35°C (86-95°F), but remains manageable for most travelers, especially those accustomed to warm climates. Spring represents the last opportunity for comfortable desert excursions before summer heat makes them challenging.</p>

        <h2>Summer (June - August): Heat and Heritage</h2>
        <p>Summer in Egypt brings intense heat that can be overwhelming for many travelers, with temperatures regularly exceeding 40°C (104°F) in Upper Egypt and desert regions. Cairo and Alexandria experience slightly more moderate temperatures due to their northern location and proximity to water bodies, but still reach uncomfortable levels for extensive sightseeing.</p>

        <p>However, summer offers unique advantages for discerning travelers. Tourist numbers drop dramatically, providing rare opportunities to experience major sites with minimal crowds. Luxury accommodations offer significant discounts, and those comfortable with heat can enjoy almost private access to temples and monuments.</p>

        <p>Early morning and evening activities become essential during summer, with most sightseeing scheduled before 9 AM and after 5 PM. Indoor attractions like museums and air-conditioned restaurants and hotels become havens during the hottest midday hours.</p>

        <h2>Autumn (September - November): Gradual Relief</h2>
        <p>Autumn brings gradual relief from summer's intensity, though September can still be quite warm with temperatures around 35°C (95°F). October marks a turning point, with comfortable daytime temperatures returning and pleasant evenings encouraging outdoor activities.</p>

        <p>November approaches winter's ideal conditions, with temperatures settling into the comfortable 25-30°C (77-86°F) range perfect for all types of sightseeing and activities. This period offers the advantage of post-summer tranquility before winter's tourist influx begins.</p>

        <p>Autumn represents an excellent time for photography enthusiasts, as the light begins to soften from summer's harsh intensity while maintaining excellent clarity and minimal atmospheric interference.</p>

        <h2>Regional Variations Within Egypt</h2>
        
        <h3>Cairo and Northern Egypt</h3>
        <p>Cairo's location in the Nile Delta provides some temperature moderation, though summer heat remains intense. Winter can bring occasional rainfall and surprisingly cool temperatures, making layers essential for comfort throughout the day.</p>

        <h3>Alexandria and Mediterranean Coast</h3>
        <p>Egypt's Mediterranean coast experiences the country's most moderate climate, with sea breezes providing cooling relief during summer and mild winters rarely requiring heavy clothing. This region remains comfortable for beach activities even during summer months.</p>

        <h3>Upper Egypt (Luxor and Aswan)</h3>
        <p>Southern Egypt experiences the country's most extreme temperatures, with scorching summers that can exceed 45°C (113°F) and delightfully warm winters perfect for Nile cruises. The dry heat means that shade provides immediate relief, and evening temperatures drop significantly.</p>

        <h3>Red Sea Resorts</h3>
        <p>Coastal resorts like Hurghada and Sharm El-Sheikh benefit from sea breezes that moderate temperatures year-round. These destinations remain popular even during summer, as water activities and air-conditioned facilities provide relief from heat.</p>

        <h3>Western Desert and Oases</h3>
        <p>Desert regions experience extreme temperature variations between day and night, with scorching daytime heat and surprisingly cool evenings. Winter desert camping becomes possible, while summer desert expeditions require careful planning and early morning scheduling.</p>

        <h2>Cultural and Religious Considerations</h2>
        <p>Egypt's cultural calendar significantly impacts travel planning beyond weather considerations. Ramadan, the Islamic holy month of fasting, affects dining options, opening hours, and cultural activities. While luxury hotels cater to international guests, understanding and respecting local customs enhances the travel experience.</p>

        <p>Major Islamic holidays like Eid al-Fitr and Eid al-Adha bring celebrations but also crowded domestic tourism and potential service disruptions. Coptic Christian holidays, while less widespread, also influence local schedules and activities.</p>

        <h2>Activity-Specific Timing</h2>

        <h3>Temple and Archaeological Site Visits</h3>
        <p>Winter and spring provide optimal conditions for extensive archaeological exploration, with comfortable temperatures allowing thorough site visits without heat exhaustion.</p>

        <h3>Nile River Cruises</h3>
        <p>October through April represents the ideal Nile cruising season, with comfortable temperatures for deck activities and pleasant evenings for outdoor dining.</p>

        <h3>Desert Adventures</h3>
        <p>Desert excursions work best during winter months, when temperature extremes are more manageable and overnight camping becomes comfortable rather than challenging.</p>

        <h3>Red Sea Diving and Water Sports</h3>
        <p>Red Sea activities remain excellent year-round, with water temperatures staying comfortable and underwater visibility typically outstanding regardless of season.</p>

        <h2>Luxury Travel Advantages by Season</h2>
        <p>Each season offers unique luxury travel opportunities. Winter provides the ultimate comfort experience with perfect weather but requires premium pricing and advance planning. Summer offers exclusive access and significant savings for heat-tolerant travelers, while shoulder seasons provide optimal combinations of weather, pricing, and access.</p>

        <p>For the discerning traveler, Egypt rewards those who understand its rhythms and plan accordingly, offering unforgettable experiences regardless of season for those prepared to embrace each period's unique characteristics and opportunities.</p>
      </div>
    `,
    author: 'Travel Team',
    publishedAt: '2024-02-20',
    readTime: '7 min read',
    category: 'Travel Planning',
    image: 'https://images.unsplash.com/photo-1594735797063-9d0c7e54f6c8?q=80&w=2070&auto=format&fit=crop',
    tags: ['Travel Planning', 'Weather', 'Seasons', 'Travel Tips']
  },
  {
    id: 'sustainable-tourism-egypt',
    title: 'Sustainable Tourism in Egypt: Preserving Heritage for Future Generations',
    excerpt: 'Learn about responsible travel practices and how luxury tourism can contribute to preserving Egypt\'s cultural heritage and natural environment.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead">Egypt's ancient monuments and natural wonders have survived millennia, but modern tourism brings both opportunities and challenges for preservation. Sustainable luxury tourism offers a path forward that protects these irreplaceable treasures while providing authentic, meaningful experiences for travelers and economic benefits for local communities.</p>

        <h2>The Challenge of Preservation</h2>
        <p>Egypt's archaeological sites face unprecedented pressures in the modern era. Rising groundwater threatens the foundations of temples, air pollution accelerates stone deterioration, and millions of annual visitors contribute to wear on ancient structures. The Pyramids of Giza, for instance, experience structural stress from visitor traffic, while the tombs in the Valley of the Kings suffer from humidity created by tourist breathing and photography equipment.</p>

        <p>Climate change compounds these challenges, with more frequent sandstorms, temperature extremes, and changing weather patterns affecting both stone monuments and organic materials like wood and papyrus found in archaeological contexts. The urgency of preservation has never been greater, making sustainable tourism practices essential rather than optional.</p>

        <h2>Sustainable Practices in Luxury Tourism</h2>

        <h3>Controlled Access and Visitor Management</h3>
        <p>Leading luxury tour operators now implement controlled access policies that limit visitor numbers while enhancing experience quality. Private early-morning or late-afternoon site visits reduce environmental impact while providing more intimate encounters with ancient wonders. These exclusive access arrangements help sites manage visitor flow while generating premium revenue that can fund conservation efforts.</p>

        <h3>Supporting Conservation Through Tourism</h3>
        <p>Progressive luxury travel companies partner directly with archaeological missions and conservation organizations, contributing portions of tour revenue to preservation projects. Travelers might sponsor specific restoration work, from cleaning hieroglyphic inscriptions to stabilizing temple foundations, creating personal connections to preservation efforts that extend beyond their visit.</p>

        <h3>Local Community Integration</h3>
        <p>Sustainable luxury tourism prioritizes local community involvement, ensuring that tourism benefits reach beyond international hotel chains and tour operators. This includes employing local guides, artisans, and service providers; supporting locally-owned restaurants and shops; and incorporating community-based experiences like traditional craft workshops or family-hosted meals.</p>

        <h2>Environmental Responsibility</h2>

        <h3>Renewable Energy and Resource Conservation</h3>
        <p>Egypt's abundant sunshine makes solar energy a natural choice for sustainable tourism infrastructure. Leading eco-lodges and luxury camps in the Western Desert operate entirely on solar power, while luxury Nile cruise ships increasingly incorporate solar panels and energy-efficient systems to reduce their environmental footprint.</p>

        <p>Water conservation takes special importance in Egypt's desert environment. Luxury accommodations implement advanced water recycling systems, drought-resistant landscaping, and guest education programs about water conservation. Some desert camps demonstrate how luxury and sustainability can coexist through innovative water harvesting and treatment technologies.</p>

        <h3>Waste Reduction and Management</h3>
        <p>Sustainable luxury operators eliminate single-use plastics, implement comprehensive recycling programs, and work with local communities to address waste management challenges. Some luxury cruise operators have achieved zero-discharge standards, treating all wastewater to prevent Nile River pollution while maintaining five-star service standards.</p>

        <h2>Cultural Heritage Preservation</h2>

        <h3>Traditional Craft Revival</h3>
        <p>Sustainable tourism helps preserve Egypt's rich tradition of handicrafts by creating markets for authentic, high-quality products. Luxury travelers seek genuine cultural experiences, supporting artisans who maintain traditional techniques in pottery, textiles, jewelry, and woodworking. This economic support helps preserve skills that might otherwise disappear in an increasingly modern economy.</p>

        <h3>Intangible Heritage Conservation</h3>
        <p>Beyond physical monuments, sustainable tourism helps preserve Egypt's intangible cultural heritage—music, storytelling, cooking traditions, and festivals. Luxury tour operators work with cultural organizations to incorporate authentic performances, cooking classes, and cultural exchanges that provide income for tradition bearers while educating visitors about Egypt's living culture.</p>

        <h2>Technology and Innovation in Conservation</h2>
        <p>Modern technology plays an increasingly important role in sustainable tourism and conservation. 3D scanning and virtual reality allow detailed documentation of archaeological sites while reducing physical impact from research activities. These technologies also enable virtual tourism experiences that can supplement rather than replace physical visits.</p>

        <p>Drones equipped with high-resolution cameras help monitor site conditions and detect problems before they become critical, while satellite imagery tracks environmental changes around archaeological sites. Smart sensors monitor temperature, humidity, and visitor impact in real-time, allowing site managers to adjust access and preservation strategies dynamically.</p>

        <h2>Economic Sustainability</h2>

        <h3>Fair Wages and Working Conditions</h3>
        <p>Sustainable luxury tourism ensures that workers throughout the industry receive fair compensation and good working conditions. This includes not just tour guides and hotel staff, but also drivers, boat crews, cooks, and craftspeople. Fair employment practices reduce poverty and create economic incentives for communities to support conservation efforts.</p>

        <h3>Revenue Sharing and Transparency</h3>
        <p>Transparent revenue sharing ensures that tourism income reaches local communities and conservation projects rather than concentrating in international corporations. Some operators publish annual sustainability reports detailing their community contributions and environmental impact, allowing travelers to make informed choices about their travel partners.</p>

        <h2>Traveler Responsibility</h2>

        <h3>Conscious Travel Choices</h3>
        <p>Sustainable luxury tourism requires conscious choices from travelers themselves. This includes selecting operators with demonstrated environmental and social commitments, respecting local customs and regulations, and understanding the impact of their travel decisions on fragile environments and communities.</p>

        <h3>Carbon Offset and Compensation</h3>
        <p>Many luxury travelers now offset their carbon emissions through certified programs that fund renewable energy, reforestation, or community development projects. Some travel companies include carbon offsets in their packages, while others offer optional programs that allow travelers to neutralize their environmental impact.</p>

        <h2>The Future of Sustainable Luxury Tourism in Egypt</h2>

        <h3>Innovation and Best Practices</h3>
        <p>Egypt is becoming a laboratory for sustainable luxury tourism innovation. New eco-lodges demonstrate how desert architecture can provide comfort while working with rather than against the environment. Advanced waste treatment systems show how tourism facilities can achieve zero environmental impact while maintaining luxury standards.</p>

        <h3>Policy and Regulation</h3>
        <p>Egyptian government initiatives increasingly emphasize sustainable tourism development, with new regulations governing archaeological site access, environmental protection, and community involvement. These policies create frameworks for responsible tourism while encouraging investment in sustainable infrastructure.</p>

        <h2>Making a Difference Through Travel</h2>
        <p>Sustainable luxury tourism in Egypt offers travelers the opportunity to experience one of the world's greatest civilizations while contributing to its preservation. By choosing responsible operators, supporting local communities, and traveling with awareness of their impact, luxury travelers can help ensure that Egypt's wonders remain available for future generations to discover and cherish.</p>

        <p>The ultimate luxury lies not just in exclusive access or premium accommodations, but in knowing that your travel contributes positively to the preservation of humanity's shared heritage. In Egypt, sustainable tourism represents the highest form of respect for the ancient civilization that continues to inspire and educate us, ensuring that the land of the pharaohs remains a source of wonder and learning for centuries to come.</p>
      </div>
    `,
    author: 'Environmental Team',
    publishedAt: '2024-02-15',
    readTime: '9 min read',
    category: 'Responsible Travel',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop',
    tags: ['Sustainable Tourism', 'Conservation', 'Responsible Travel', 'Heritage']
  }
];

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: postResponse, isLoading } = useQuery({
    queryKey: ["/api/blog/posts", slug],
    enabled: !!slug,
  });

  const post = (postResponse as any)?.post;

  useSEO({
    title: post?.title,
    description: post?.metaDescription || post?.excerpt?.slice(0, 160),
    image: post?.featuredImage,
    type: "article",
  });

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "Article link has been copied to your clipboard.",
          });
          return;
        } catch (err) {
          toast({
            title: "Copy failed",
            description: "Unable to copy link to clipboard.",
            variant: "destructive",
          });
          return;
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={post.featuredImage || 'https://images.unsplash.com/photo-1539650116574-75c0c6d04136?q=80&w=2070&auto=format&fit=crop'}
          alt={post.titleEn}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <Link href="/blog">
              <Button variant="outline" className="mb-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight" data-testid="text-post-title">
              {post.titleEn}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.focusKeyword && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{post.focusKeyword}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row gap-16">
            {/* Main Content */}
            <article className="xl:flex-1 max-w-4xl xl:max-w-none">
              <div className="mb-12">
                <div className="w-24 h-px bg-accent mb-8"></div>
                <div className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {post.excerpt}
                </div>
              </div>
              
              <div
                className="prose prose-xl max-w-none prose-primary"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                  letterSpacing: '0.01em'
                }}
                data-testid="text-post-content"
                dangerouslySetInnerHTML={{ __html: post.bodyEn || post.excerpt || '' }}
              />
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-16 pt-12 border-t border-border">
                  <h4 className="text-2xl font-serif font-bold text-primary mb-6">Related Topics</h4>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-base bg-accent/10 text-accent px-4 py-2 rounded-full flex items-center gap-2 hover:bg-accent/20 transition-colors"
                      >
                        <Tag className="h-4 w-4" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="xl:w-96 xl:flex-shrink-0">
              {/* Article Info */}
              <Card className="mb-8 bg-muted/30">
                <CardContent className="p-8">
                  <h4 className="text-xl font-serif font-bold text-primary mb-6">Article Information</h4>
                  <div className="space-y-4">
                    {post.category && (
                      <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium text-primary">{post.category}</p>
                          <p className="text-sm text-muted-foreground">Category</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium text-primary">{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                        <p className="text-sm text-muted-foreground">Published</p>
                      </div>
                    </div>
                    {post.focusKeyword && (
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium text-primary">{post.focusKeyword}</p>
                          <p className="text-sm text-muted-foreground">Topic</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Share Article */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <h4 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                    <Share2 className="h-6 w-6 text-accent" />
                    Share This Article
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-3 justify-start p-4 h-auto"
                    >
                      <Facebook className="h-5 w-5" />
                      Share on Facebook
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-3 justify-start p-4 h-auto"
                    >
                      <Twitter className="h-5 w-5" />
                      Share on Twitter
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center gap-3 justify-start p-4 h-auto"
                    >
                      <Linkedin className="h-5 w-5" />
                      Share on LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('copy')}
                      className="flex items-center gap-3 justify-start p-4 h-auto"
                    >
                      <Copy className="h-5 w-5" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Explore More */}
              <Card>
                <CardContent className="p-8">
                  <h4 className="text-xl font-serif font-bold text-primary mb-6">Explore More</h4>
                  <p className="text-muted-foreground mb-4">Discover more travel insights and tips for your Egyptian adventure.</p>
                  <Link href="/blog">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Browse All Articles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Ready for Your Egyptian Adventure?
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Let our travel specialists create a bespoke luxury journey tailored to your interests and preferences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]">
                Plan Your Journey
              </Button>
            </Link>
            <Link href="/egypt-tour-packages">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg min-w-[200px]">
                Explore Experiences
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

