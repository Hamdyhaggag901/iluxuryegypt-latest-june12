// Fallback content for the 5 original legal pages, used only when a legal page
// has not yet been saved from the admin (i.e. the public API returns nothing
// for that slug). This mirrors the content that used to be hardcoded directly
// in privacy-policy.tsx / terms-conditions.tsx / cookie-policy.tsx /
// responsible-travel.tsx / disclaimer.tsx before they were replaced by the
// single dynamic LegalPage component. Once an admin saves real data for one
// of these slugs, this fallback is no longer used for that page.

export interface LegalPageFallback {
  slug: string;
  title: string;
  subtitle: string;
  introTitle: string;
  introDescription: string;
  highlights: { icon: string; title: string; description: string }[];
  content: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export const LEGAL_PAGES_FALLBACK: Record<string, LegalPageFallback> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    subtitle: "Your privacy is paramount to us. Learn how we protect and respect your personal information.",
    introTitle: "Our Privacy Commitment",
    introDescription:
      "At I.LuxuryEgypt, we are committed to protecting your privacy and ensuring the security of your personal information. This policy outlines our practices regarding the collection, use, and protection of your data.",
    highlights: [
      { icon: "shield", title: "Data Protection", description: "Your personal information is secured with industry-standard encryption." },
      { icon: "eye", title: "Transparency", description: "We clearly explain what data we collect and how we use it." },
      { icon: "cookie", title: "Cookie Control", description: "You have full control over cookies and tracking preferences." },
      { icon: "mail", title: "Communication", description: "We only send travel-related communications you've requested." },
    ],
    content: `
<h2>Information We Collect</h2>
<h3>Personal Information</h3>
<p>We collect information you provide directly to us, such as when you:</p>
<ul>
<li>Submit travel inquiries through our contact forms</li>
<li>Subscribe to our newsletter or travel updates</li>
<li>Book luxury travel experiences with us</li>
<li>Communicate with our concierge team</li>
</ul>
<h3>Travel Preferences</h3>
<p>To create bespoke luxury experiences, we may collect information about your:</p>
<ul>
<li>Preferred destinations and travel dates</li>
<li>Accommodation preferences and dietary requirements</li>
<li>Special interests and accessibility needs</li>
<li>Previous travel history with us</li>
</ul>
<h3>Technical Information</h3>
<p>We automatically collect certain information when you visit our website, including:</p>
<ul>
<li>IP address and browser information</li>
<li>Pages visited and time spent on our site</li>
<li>Device information and screen resolution</li>
<li>Referral sources and search terms</li>
</ul>
<h2>How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
<li>Design and deliver personalized luxury travel experiences</li>
<li>Communicate with you about your inquiries and bookings</li>
<li>Provide 24/7 concierge support during your travels</li>
<li>Send you travel inspiration and exclusive offers (with your consent)</li>
<li>Improve our services and website functionality</li>
<li>Comply with legal obligations and protect our business interests</li>
</ul>
<h2>Information Sharing</h2>
<p>We may share your information with:</p>
<ul>
<li><strong>Luxury hotel partners and service providers</strong> — to arrange your accommodations and experiences</li>
<li><strong>Transportation providers</strong> — to organize transfers and flights</li>
<li><strong>Local guides and experience curators</strong> — to deliver authentic cultural experiences</li>
<li><strong>Payment processors</strong> — to securely handle transactions</li>
<li><strong>Legal authorities</strong> — when required by law or to protect our rights</li>
</ul>
<p><strong>We never sell your personal information to third parties.</strong></p>
<h2>Data Security</h2>
<p>We implement appropriate security measures to protect your personal information, including:</p>
<ul>
<li>SSL encryption for all data transmissions</li>
<li>Secure servers and databases with access controls</li>
<li>Regular security audits and updates</li>
<li>Employee training on data protection practices</li>
</ul>
<h2>Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access and review the personal information we have about you</li>
<li>Request corrections to any inaccurate information</li>
<li>Request deletion of your personal information</li>
<li>Opt-out of marketing communications at any time</li>
<li>Restrict how we process your information</li>
<li>Request a copy of your data in a portable format</li>
</ul>
<p>To exercise these rights, please contact us using the details below.</p>
`.trim(),
    contactEmail: "privacy@i.luxuryegypt.com",
    contactPhone: "+20 xxx xxx xxxx",
    contactAddress: "Cairo, Egypt",
  },

  "terms-conditions": {
    slug: "terms-conditions",
    title: "Terms & Conditions",
    subtitle: "Understanding our service terms ensures a seamless luxury travel experience for you.",
    introTitle: "Service Terms Overview",
    introDescription:
      "These terms govern your use of I.LuxuryEgypt services and ensure a transparent, professional relationship throughout your luxury travel experience.",
    highlights: [
      { icon: "scale", title: "Fair Terms", description: "Clear, transparent terms that protect both you and our luxury services." },
      { icon: "file-text", title: "Service Agreement", description: "Detailed outline of our luxury travel services and your expectations." },
      { icon: "calendar", title: "Booking Terms", description: "Flexible booking and cancellation policies for luxury travel." },
      { icon: "credit-card", title: "Payment Terms", description: "Secure payment processing with clear pricing structures." },
    ],
    content: `
<h2>Acceptance of Terms</h2>
<p>By accessing our website or using our luxury travel services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
<p>These terms apply to all visitors, users, and others who access or use I.LuxuryEgypt services, including our bespoke travel planning, concierge services, and luxury accommodations.</p>
<h2>Service Description</h2>
<h3>Luxury Travel Services</h3>
<p>I.LuxuryEgypt provides bespoke luxury travel experiences in Egypt, including:</p>
<ul>
<li>Personalized itinerary planning and design</li>
<li>Luxury accommodation bookings at premium hotels</li>
<li>Private guided tours and cultural experiences</li>
<li>VIP access to historical sites and exclusive venues</li>
<li>24/7 concierge support throughout your journey</li>
<li>Transportation arrangements and transfers</li>
</ul>
<h3>Service Availability</h3>
<p>Our services are available to travelers worldwide who wish to experience luxury travel in Egypt. All services are subject to availability and confirmation by our team and partner providers.</p>
<h2>Booking and Reservations</h2>
<h3>Booking Process</h3>
<ul>
<li>All bookings require written confirmation from I.LuxuryEgypt</li>
<li>A deposit may be required to secure your luxury experience</li>
<li>Final payments are due according to the agreed timeline</li>
<li>Travel insurance is strongly recommended for all bookings</li>
</ul>
<h3>Changes and Modifications</h3>
<ul>
<li>Changes to confirmed bookings may incur additional fees</li>
<li>Modifications are subject to availability of hotels and services</li>
<li>We will do our best to accommodate changes while maintaining luxury standards</li>
<li>Some partner services may have their own modification policies</li>
</ul>
<h2>Payment Terms</h2>
<h3>Payment Schedule</h3>
<ul>
<li>Deposit required upon booking confirmation (typically 30-50%)</li>
<li>Final payment due 30 days prior to travel</li>
<li>Payment plans available for extended luxury experiences</li>
<li>All prices quoted are in USD unless otherwise specified</li>
</ul>
<h3>Accepted Payment Methods</h3>
<ul>
<li>Major credit cards (Visa, MasterCard, American Express)</li>
<li>Bank transfers for larger bookings</li>
<li>Online payment platforms as agreed</li>
<li>All payments are processed securely through encrypted systems</li>
</ul>
<h2>Cancellation Policy</h2>
<h3>Cancellation Timeline</h3>
<ul>
<li><strong>60+ days before travel:</strong> Full refund minus 10% administrative fee</li>
<li><strong>30-59 days before travel:</strong> 50% refund of total booking value</li>
<li><strong>14-29 days before travel:</strong> 25% refund of total booking value</li>
<li><strong>Less than 14 days:</strong> No refund available</li>
</ul>
<h3>Special Circumstances</h3>
<p>We understand that luxury travel plans can change due to unforeseen circumstances. We may consider exceptions for:</p>
<ul>
<li>Medical emergencies (with documentation)</li>
<li>Government travel advisories</li>
<li>Force majeure events</li>
<li>Cases covered by comprehensive travel insurance</li>
</ul>
<h2>Liability and Responsibility</h2>
<p>I.LuxuryEgypt acts as an intermediary between travelers and service providers. While we carefully select our luxury partners, we are not liable for:</p>
<ul>
<li>Acts of third-party service providers (hotels, airlines, local operators)</li>
<li>Natural disasters, political events, or force majeure circumstances</li>
<li>Personal injuries or losses during travel</li>
<li>Delays or cancellations by airlines or other transportation providers</li>
</ul>
<p><strong>We strongly recommend comprehensive travel insurance for all luxury travel experiences.</strong></p>
<h2>Intellectual Property</h2>
<p>All content on our website, including text, images, logos, and itinerary designs, is the property of I.LuxuryEgypt and is protected by copyright laws.</p>
<p>You may not reproduce, distribute, or use our content for commercial purposes without written permission.</p>
<h2>Governing Law</h2>
<p>These Terms and Conditions are governed by Egyptian law. Any disputes will be resolved through good faith negotiation or mediation in Cairo, Egypt.</p>
<p>If you have concerns about our services, please contact us first using the details below.</p>
`.trim(),
    contactEmail: "legal@i.luxuryegypt.com",
    contactPhone: "+20 xxx xxx xxxx",
    contactAddress: "Cairo, Egypt",
  },

  "cookie-policy": {
    slug: "cookie-policy",
    title: "Cookie Policy",
    subtitle: "Learn how we use cookies to enhance your luxury travel experience on our website.",
    introTitle: "Types of Cookies We Use",
    introDescription:
      "We use different types of cookies to provide you with a personalized and secure browsing experience while planning your luxury Egyptian adventure.",
    highlights: [
      { icon: "shield", title: "Essential Cookies", description: "Required for website functionality and security." },
      { icon: "bar-chart", title: "Analytics Cookies", description: "Help us understand how visitors use our website." },
      { icon: "settings", title: "Functional Cookies", description: "Enable enhanced features and personalisation." },
      { icon: "cookie", title: "Marketing Cookies", description: "Used to deliver relevant luxury travel content." },
    ],
    content: `
<h2>What Are Cookies?</h2>
<p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.</p>
<p>I.LuxuryEgypt uses cookies responsibly to enhance your journey of discovering Egypt's luxury travel opportunities, ensuring you receive relevant information about our bespoke services.</p>
<h2>Essential Cookies</h2>
<p>These cookies are necessary for our website to function properly and cannot be switched off. They are usually set in response to actions you take, such as:</p>
<ul>
<li>Filling in contact forms for luxury travel inquiries</li>
<li>Setting privacy preferences</li>
<li>Logging into secured areas of our site</li>
<li>Security features that prevent fraud</li>
</ul>
<blockquote>These cookies do not store personally identifiable information and are automatically deleted when you close your browser.</blockquote>
<h2>Analytics Cookies</h2>
<p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us:</p>
<ul>
<li>Understand which luxury destinations are most popular</li>
<li>See how long visitors spend reading about our services</li>
<li>Identify which pages need improvement</li>
<li>Measure the effectiveness of our marketing campaigns</li>
</ul>
<p><strong>Third-party services we use:</strong></p>
<ul>
<li>Google Analytics — to understand website usage patterns</li>
<li>Hotjar — to see how users navigate our site (if applicable)</li>
</ul>
<h2>Functional Cookies</h2>
<p>These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages. They help us:</p>
<ul>
<li>Remember your language and region preferences</li>
<li>Provide live chat functionality for immediate assistance</li>
<li>Embed videos showing Egypt's luxury destinations</li>
<li>Remember form information to make inquiries easier</li>
</ul>
<p>If you do not allow these cookies, some or all of these enhanced features may not function properly.</p>
<h2>Marketing Cookies</h2>
<p>These cookies are used to deliver advertisements that are relevant to your interests. They help us:</p>
<ul>
<li>Show you luxury travel content that matches your interests</li>
<li>Limit the number of times you see the same advertisement</li>
<li>Measure the effectiveness of advertising campaigns</li>
<li>Provide social media features like sharing buttons</li>
</ul>
<blockquote>You can opt out of marketing cookies without affecting the core functionality of our website. Your luxury travel experience will remain uncompromised.</blockquote>
<h2>Managing Your Cookie Preferences</h2>
<h3>Browser Settings</h3>
<p>You can control and delete cookies through your browser settings:</p>
<ul>
<li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
<li><strong>Firefox:</strong> Options → Privacy &amp; Security → Cookies and Site Data</li>
<li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
<li><strong>Edge:</strong> Settings → Site permissions → Cookies and site data</li>
</ul>
<h3>Cookie Consent</h3>
<p>When you first visit our website, we will ask for your consent to use cookies. You can:</p>
<ul>
<li>Accept all cookies for the full luxury browsing experience</li>
<li>Customize your preferences to choose which types of cookies to allow</li>
<li>Reject non-essential cookies while keeping core functionality</li>
<li>Change your preferences at any time using our cookie preferences center</li>
</ul>
<h3>Third-Party Opt-Outs</h3>
<p>You can also opt out of tracking by specific services:</p>
<ul>
<li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics Opt-out Browser Add-on</a></li>
<li><strong>Social Media:</strong> Adjust privacy settings on Facebook, Twitter, LinkedIn</li>
</ul>
<h2>How Long We Keep Cookies</h2>
<ul>
<li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
<li><strong>Persistent Cookies:</strong> Stored for up to 24 months, then automatically deleted</li>
<li><strong>Analytics Cookies:</strong> Retained for 26 months for traffic analysis</li>
<li><strong>Marketing Cookies:</strong> Vary by provider, typically 30 days to 2 years</li>
</ul>
`.trim(),
    contactEmail: "privacy@i.luxuryegypt.com",
    contactPhone: "+20 xxx xxx xxxx",
    contactAddress: "Cairo, Egypt",
  },
    "responsible-travel": {
    slug: "responsible-travel",
    title: "Responsible Travel",
    subtitle: "Luxury travel with a conscience - preserving Egypt's treasures while creating meaningful experiences.",
    introTitle: "Our Responsibility Pillars",
    introDescription:
      "At I.LuxuryEgypt, we believe luxury travel should enrich both travelers and destinations. Our responsible travel approach ensures your experiences contribute positively to Egypt's future.",
    highlights: [
      { icon: "leaf", title: "Environmental Care", description: "Protecting Egypt's natural wonders and ancient sites for future generations." },
      { icon: "heart", title: "Cultural Respect", description: "Honoring local traditions and supporting authentic Egyptian heritage." },
      { icon: "users", title: "Community Support", description: "Empowering local communities through sustainable tourism practices." },
      { icon: "globe", title: "Global Responsibility", description: "Contributing to sustainable travel practices worldwide." },
    ],
    content: `
<h2>Environmental Stewardship</h2>
<h3>Protecting Ancient Sites</h3>
<p>We work exclusively with operators who follow strict conservation guidelines:</p>
<ul>
<li>Small group sizes to minimize impact on archaeological sites</li>
<li>Supporting restoration projects at historic monuments</li>
<li>Following UNESCO guidelines for World Heritage site visits</li>
<li>Educating travelers about the importance of preservation</li>
</ul>
<h3>Sustainable Practices</h3>
<p>Our luxury experiences incorporate environmentally conscious practices:</p>
<ul>
<li>Partnering with eco-certified luxury hotels and resorts</li>
<li>Promoting water conservation in desert environments</li>
<li>Supporting renewable energy initiatives in hospitality</li>
<li>Encouraging responsible wildlife viewing in natural areas</li>
</ul>
<blockquote>We offset carbon emissions from luxury transportation through verified environmental programs.</blockquote>
<h2>Cultural Preservation &amp; Respect</h2>
<h3>Authentic Cultural Experiences</h3>
<p>We create meaningful connections with Egyptian culture:</p>
<ul>
<li>Supporting traditional artisans and craftspeople</li>
<li>Organizing private workshops with master artisans</li>
<li>Promoting authentic cuisine prepared by local chefs</li>
<li>Facilitating respectful interactions with local communities</li>
</ul>
<h3>Heritage Protection</h3>
<p>We actively support cultural heritage preservation:</p>
<ul>
<li>Contributing to archaeological research and documentation</li>
<li>Supporting museums and cultural institutions</li>
<li>Promoting traditional arts and music performances</li>
<li>Funding educational programs about Egyptian heritage</li>
</ul>
<h3>Respectful Travel Guidelines</h3>
<p>We educate our travelers about:</p>
<ul>
<li>Appropriate dress codes for religious and cultural sites</li>
<li>Photography etiquette at sacred locations</li>
<li>Respectful interaction with local communities</li>
<li>Understanding and appreciating local customs and traditions</li>
</ul>
<h2>Community Empowerment</h2>
<h3>Local Economic Support</h3>
<p>Our luxury travel experiences prioritize local economic development:</p>
<ul>
<li>Partnering with locally-owned luxury accommodations</li>
<li>Sourcing experiences from local operators and guides</li>
<li>Purchasing from local artisans and businesses</li>
<li>Supporting restaurants that use local ingredients</li>
</ul>
<h3>Education and Training</h3>
<p>We invest in local community development:</p>
<ul>
<li>Supporting hospitality training programs</li>
<li>Funding language education for tourism professionals</li>
<li>Providing scholarships for tourism and heritage studies</li>
<li>Mentoring young entrepreneurs in the travel industry</li>
</ul>
<h3>Community Projects</h3>
<p>A portion of our profits supports:</p>
<ul>
<li>Educational programs in rural Egyptian communities</li>
<li>Healthcare initiatives in underserved areas</li>
<li>Infrastructure improvements near tourist destinations</li>
<li>Environmental conservation projects</li>
</ul>
<h2>Ethical Travel Guidelines</h2>
<h3>For Our Travelers</h3>
<p>We encourage our guests to:</p>
<ul>
<li>Respect local customs, traditions, and religious practices</li>
<li>Support local businesses and artisans</li>
<li>Minimize environmental impact during travels</li>
<li>Engage meaningfully with local communities</li>
<li>Share their positive experiences responsibly</li>
</ul>
<h3>For Our Partners</h3>
<p>We require our luxury partners to:</p>
<ul>
<li>Maintain fair labor practices and competitive wages</li>
<li>Implement environmental sustainability measures</li>
<li>Respect local communities and cultural sites</li>
<li>Provide excellent service while preserving authenticity</li>
<li>Contribute to local economic development</li>
</ul>
<h2>Measuring Our Impact</h2>
<h3>Transparency and Accountability</h3>
<p>We regularly assess and report on our responsible travel initiatives:</p>
<ul>
<li>Annual sustainability reports for stakeholders</li>
<li>Tracking economic impact on local communities</li>
<li>Monitoring environmental conservation contributions</li>
<li>Measuring guest satisfaction with responsible travel aspects</li>
</ul>
<h3>Continuous Improvement</h3>
<p>We continuously enhance our responsible travel practices:</p>
<ul>
<li>Regular audits of partner sustainability practices</li>
<li>Guest feedback integration into our programs</li>
<li>Collaboration with international sustainable tourism organizations</li>
<li>Investment in innovative responsible travel solutions</li>
</ul>
<blockquote>Our goal is to be Egypt's leading example of luxury travel that benefits all stakeholders.</blockquote>
<h2>Travel Responsibly With Us</h2>
<h3>Make a Difference</h3>
<p>When you choose I.LuxuryEgypt, you're not just experiencing luxury - you're contributing to:</p>
<ul>
<li>Preservation of Egypt's ancient monuments and cultural heritage</li>
<li>Economic development of local communities</li>
<li>Environmental conservation in the Nile region</li>
<li>Education and capacity building for Egyptian youth</li>
</ul>
<h3>Optional Contributions</h3>
<p>Guests can make additional voluntary contributions to:</p>
<ul>
<li>Archaeological preservation projects</li>
<li>Local education and healthcare initiatives</li>
<li>Environmental restoration programs</li>
<li>Artisan and craftsperson support funds</li>
</ul>
`.trim(),
    contactEmail: "sustainability@i.luxuryegypt.com",
    contactPhone: "+20 xxx xxx xxxx",
    contactAddress: "Cairo, Egypt",
  },

  disclaimer: {
    slug: "disclaimer",
    title: "Disclaimer",
    subtitle: "Important information about our luxury travel services and limitations of liability.",
    introTitle: "Important Disclaimers",
    introDescription:
      "Please read these important disclaimers carefully before using our luxury travel services. They outline the limitations and conditions of our services.",
    highlights: [
      { icon: "info", title: "Information Accuracy", description: "We strive for accuracy but information may change without notice." },
      { icon: "shield", title: "Service Limitations", description: "Our liability is limited as outlined in our terms and conditions." },
      { icon: "globe", title: "Third-Party Services", description: "We work with partners but are not responsible for their services." },
      { icon: "alert-triangle", title: "Travel Risks", description: "International luxury travel involves inherent risks and uncertainties." },
    ],
    content: `
<h2>General Disclaimer</h2>
<p>The information provided on this website and through our luxury travel services is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on this website or in our services.</p>
<p>Any reliance you place on such information is therefore strictly at your own risk. In no event will I.LuxuryEgypt be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website or our services.</p>
<h2>Travel Service Disclaimer</h2>
<h3>Role as Travel Consultant</h3>
<p>I.LuxuryEgypt acts as a luxury travel consultant and intermediary. We arrange bookings with third-party providers including:</p>
<ul>
<li>Luxury hotels and resorts</li>
<li>Airlines and transportation companies</li>
<li>Local tour operators and guides</li>
<li>Restaurants and entertainment venues</li>
</ul>
<h3>Service Provider Responsibility</h3>
<p>Each service provider is responsible for the provision of their own services. We are not liable for:</p>
<ul>
<li>Quality of accommodations or service standards</li>
<li>Flight delays, cancellations, or schedule changes</li>
<li>Changes to hotel amenities or room categories</li>
<li>Restaurant closures or menu changes</li>
<li>Weather conditions affecting outdoor activities</li>
</ul>
<blockquote>We carefully select our luxury partners based on their reputation and service standards, but we cannot guarantee their performance.</blockquote>
<h2>Travel Risks and Insurance</h2>
<h3>Inherent Travel Risks</h3>
<p>International travel involves inherent risks, including but not limited to:</p>
<ul>
<li>Political instability or government travel advisories</li>
<li>Natural disasters, weather events, or climate conditions</li>
<li>Health risks, pandemics, or medical emergencies</li>
<li>Currency fluctuations affecting costs</li>
<li>Changes in local laws or regulations</li>
<li>Transportation strikes or infrastructure issues</li>
</ul>
<h3>Travel Insurance Requirement</h3>
<p>We strongly recommend that all clients obtain comprehensive travel insurance that covers:</p>
<ul>
<li>Trip cancellation and interruption</li>
<li>Medical expenses and emergency evacuation</li>
<li>Lost or delayed baggage</li>
<li>Travel delays and missed connections</li>
</ul>
<blockquote>Travel insurance is not included in our service fees but is essential for luxury travel protection.</blockquote>
<h2>Information Accuracy</h2>
<h3>Website Content</h3>
<p>Information on our website, including prices, availability, and service descriptions, may change without notice. We strive to maintain accuracy but:</p>
<ul>
<li>Prices are subject to change until booking is confirmed</li>
<li>Availability depends on third-party providers</li>
<li>Images may not represent actual accommodations</li>
<li>Service descriptions are based on provider information</li>
</ul>
<h3>Booking Confirmation</h3>
<p>All bookings are subject to confirmation by our partners. Final prices and availability will be confirmed in writing before your travel.</p>
<h2>Health and Safety</h2>
<h3>Medical Advice</h3>
<p>We are not medical professionals and cannot provide health advice. Before traveling to Egypt, please:</p>
<ul>
<li>Consult your physician about required vaccinations</li>
<li>Check government health advisories for Egypt</li>
<li>Consider your physical fitness for planned activities</li>
<li>Bring necessary medications and prescriptions</li>
</ul>
<h3>Safety Precautions</h3>
<p>While Egypt is generally safe for luxury travelers, please:</p>
<ul>
<li>Follow local laws and customs</li>
<li>Keep copies of important documents</li>
<li>Stay informed about local conditions</li>
<li>Follow guidance from local authorities and guides</li>
</ul>
<h2>Limitation of Liability</h2>
<p>I.LuxuryEgypt's liability is limited to the total amount paid for our services. We are not liable for:</p>
<ul>
<li>Indirect, incidental, or consequential damages</li>
<li>Loss of profits, data, or business opportunities</li>
<li>Damages exceeding the cost of our services</li>
<li>Acts of third-party service providers</li>
<li>Force majeure events beyond our control</li>
</ul>
<blockquote>This limitation applies to the fullest extent permitted by law.</blockquote>
<h2>Jurisdiction and Governing Law</h2>
<p>This disclaimer is governed by Egyptian law. Any disputes arising from our services will be subject to the exclusive jurisdiction of Egyptian courts in Cairo.</p>
<p>If any provision of this disclaimer is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable.</p>
`.trim(),
    contactEmail: "legal@i.luxuryegypt.com",
    contactPhone: "+20 xxx xxx xxxx",
    contactAddress: "Cairo, Egypt",
  },
};
