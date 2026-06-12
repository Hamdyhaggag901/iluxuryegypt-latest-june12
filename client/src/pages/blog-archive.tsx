import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Clock, Calendar, User, ArrowRight, Archive, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

// Sample blog posts data - same as main blog but organized for archive view
const blogPosts = [
  {
    id: 'ancient-egypt-mysteries',
    title: 'Unveiling the Mysteries of Ancient Egypt: A Journey Through Time',
    excerpt: 'Discover the fascinating secrets of pharaohs, pyramids, and ancient Egyptian civilization that continue to captivate travelers from around the world.',
    author: 'Dr. Sarah Mitchell',
    publishedAt: '2024-03-15',
    readTime: '8 min read',
    category: 'Culture & History',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d04136?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'luxury-nile-cruise-guide',
    title: 'The Ultimate Guide to Luxury Nile River Cruises',
    excerpt: 'Experience the magic of sailing the legendary Nile River aboard world-class luxury vessels with exclusive amenities and unparalleled service.',
    author: 'Ahmed Hassan',
    publishedAt: '2024-03-10',
    readTime: '12 min read',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1578925441513-b3c1bd1bb0e8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'hidden-gems-egypt',
    title: 'Hidden Gems of Egypt: Beyond the Tourist Trail',
    excerpt: 'Explore Egypt\'s best-kept secrets, from remote oases to lesser-known archaeological sites that offer authentic and intimate experiences.',
    author: 'Layla Abdel Rahman',
    publishedAt: '2024-03-05',
    readTime: '10 min read',
    category: 'Destinations',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'egyptian-cuisine-journey',
    title: 'A Culinary Journey Through Egyptian Flavors',
    excerpt: 'Savor the rich tapestry of Egyptian cuisine, from street food delights to gourmet dining experiences that reflect centuries of culinary tradition.',
    author: 'Chef Omar Farouk',
    publishedAt: '2024-02-28',
    readTime: '6 min read',
    category: 'Food & Culture',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'best-time-visit-egypt',
    title: 'When is the Best Time to Visit Egypt? A Seasonal Guide',
    excerpt: 'Plan your perfect Egyptian adventure with our comprehensive guide to Egypt\'s seasons, weather patterns, and optimal travel times.',
    author: 'Travel Team',
    publishedAt: '2024-02-20',
    readTime: '7 min read',
    category: 'Travel Planning',
    image: 'https://images.unsplash.com/photo-1594735797063-9d0c7e54f6c8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'sustainable-tourism-egypt',
    title: 'Sustainable Tourism in Egypt: Preserving Heritage for Future Generations',
    excerpt: 'Learn about responsible travel practices and how luxury tourism can contribute to preserving Egypt\'s cultural heritage and natural environment.',
    author: 'Environmental Team',
    publishedAt: '2024-02-15',
    readTime: '9 min read',
    category: 'Responsible Travel',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'cairo-nightlife-guide',
    title: 'Cairo After Dark: A Guide to Egypt\'s Vibrant Nightlife',
    excerpt: 'Explore Cairo\'s sophisticated evening scene, from rooftop lounges with pyramid views to traditional coffee houses and cultural performances.',
    author: 'Nightlife Expert',
    publishedAt: '2024-01-25',
    readTime: '8 min read',
    category: 'Destinations',
    image: 'https://images.unsplash.com/photo-1544428661-30eaaef8b263?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'red-sea-diving-adventures',
    title: 'Diving the Red Sea: Underwater Wonders of Egypt',
    excerpt: 'Discover the spectacular coral reefs and marine life that make Egypt\'s Red Sea coast one of the world\'s premier diving destinations.',
    author: 'Marine Biologist',
    publishedAt: '2024-01-15',
    readTime: '11 min read',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'luxury-desert-camping',
    title: 'Under the Desert Stars: Luxury Camping in the Sahara',
    excerpt: 'Experience the magic of the Egyptian desert with our guide to luxury camping experiences that combine adventure with five-star comfort.',
    author: 'Desert Guide',
    publishedAt: '2024-01-08',
    readTime: '9 min read',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'alexandria-cultural-heritage',
    title: 'Alexandria: Where Mediterranean Meets Ancient Egypt',
    excerpt: 'Explore the cultural treasures of Alexandria, from ancient libraries to modern museums, in Egypt\'s historic Mediterranean port city.',
    author: 'Cultural Historian',
    publishedAt: '2023-12-20',
    readTime: '10 min read',
    category: 'Culture & History',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'egyptian-cotton-shopping',
    title: 'The Finest Threads: A Guide to Egyptian Cotton Shopping',
    excerpt: 'Discover the world\'s finest cotton and learn where to find authentic Egyptian textiles, from luxury hotels to traditional bazaars.',
    author: 'Shopping Expert',
    publishedAt: '2023-12-10',
    readTime: '6 min read',
    category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1586463175471-999bb2ac2c6e?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'pharaonic-temples-guide',
    title: 'Temple Hopping: A Complete Guide to Egypt\'s Sacred Sites',
    excerpt: 'Journey through Egypt\'s most magnificent temples, from Karnak to Abu Simbel, and discover the stories carved in stone.',
    author: 'Egyptologist',
    publishedAt: '2023-11-28',
    readTime: '15 min read',
    category: 'Culture & History',
    image: 'https://images.unsplash.com/photo-1569859850974-8e03e8b74c10?q=80&w=2070&auto=format&fit=crop'
  }
];

// Group posts by year and month
function groupPostsByDate(posts: typeof blogPosts) {
  const grouped: { [year: string]: { [month: string]: typeof blogPosts } } = {};
  
  posts.forEach(post => {
    const date = new Date(post.publishedAt);
    const year = date.getFullYear().toString();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    
    if (!grouped[year]) {
      grouped[year] = {};
    }
    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }
    grouped[year][month].push(post);
  });
  
  return grouped;
}

export default function BlogArchive() {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set(['2024']));
  
  const groupedPosts = groupPostsByDate(blogPosts);
  const years = Object.keys(groupedPosts).sort((a, b) => parseInt(b) - parseInt(a));
  
  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const totalPosts = blogPosts.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-background via-accent/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Archive className="h-12 w-12 text-accent" />
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary">
              Story Archive
            </h1>
          </div>
          <div className="w-32 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our complete collection of travel stories, insights, and guides. 
            From ancient mysteries to modern luxury adventures, discover Egypt through our curated timeline of articles.
          </p>
          <div className="mt-8">
            <p className="text-lg font-medium text-primary">
              {totalPosts} Stories Archived
            </p>
          </div>
        </div>
      </section>

      {/* Archive Navigation */}
      <section className="py-8 bg-muted/50 border-b border-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog">
              <Button variant="outline" data-testid="link-blog-main">
                Latest Stories
              </Button>
            </Link>
            <Button variant="default" data-testid="button-archive-current">
              Archive
            </Button>
          </div>
        </div>
      </section>

      {/* Archive Content */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {years.map((year) => (
            <div key={year} className="mb-12">
              {/* Year Header */}
              <div 
                className="flex items-center justify-between p-6 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleYear(year)}
                data-testid={`year-header-${year}`}
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-serif font-bold text-primary">
                    {year}
                  </h2>
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    {Object.values(groupedPosts[year]).flat().length} articles
                  </span>
                </div>
                {expandedYears.has(year) ? (
                  <ChevronUp className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              {/* Year Content */}
              {expandedYears.has(year) && (
                <div className="mt-6 space-y-8">
                  {Object.entries(groupedPosts[year])
                    .sort(([a], [b]) => {
                      const monthA = new Date(`${a} 1, ${year}`).getMonth();
                      const monthB = new Date(`${b} 1, ${year}`).getMonth();
                      return monthB - monthA;
                    })
                    .map(([month, posts]) => (
                    <div key={month} className="ml-8">
                      {/* Month Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-2xl font-serif font-semibold text-primary">
                          {month}
                        </h3>
                        <div className="flex-1 h-px bg-accent/20"></div>
                        <span className="text-sm text-muted-foreground">
                          {posts.length} article{posts.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Posts for this month */}
                      <div className="space-y-4">
                        {posts
                          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                          .map((post) => (
                          <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                            <CardContent className="p-0">
                              <div className="flex gap-6 p-6">
                                {/* Post Image */}
                                <div className="flex-shrink-0">
                                  <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                                    <img
                                      src={post.image}
                                      alt={post.title}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                  </div>
                                </div>

                                {/* Post Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h4 className="text-xl font-serif font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                                        {post.title}
                                      </h4>
                                      <p className="text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed">
                                        {post.excerpt}
                                      </p>
                                      
                                      {/* Meta Information */}
                                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          <span>{post.readTime}</span>
                                        </div>
                                        <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">
                                          {post.category}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Read More Button */}
                                    <div className="flex-shrink-0">
                                      <Button variant="outline" size="sm" asChild>
                                        <Link href={`/blog/${post.id}`} data-testid={`read-more-${post.id}`}>
                                          <span className="hidden sm:inline">Read Article</span>
                                          <span className="sm:hidden">Read</span>
                                          <ArrowRight className="ml-2 h-3 w-3" />
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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
            Let our stories inspire your journey. Contact our luxury travel specialists to craft 
            your perfect Egyptian adventure, tailored to your dreams and desires.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-contact-specialists">
                Contact Our Specialists
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-latest-stories">
                Latest Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}