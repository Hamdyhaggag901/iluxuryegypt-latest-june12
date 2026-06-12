import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Clock, Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";

// Sample blog posts data (fallback for display purposes)
const sampleBlogPosts = [
  {
    id: 'ancient-egypt-mysteries',
    title: 'Unveiling the Mysteries of Ancient Egypt: A Journey Through Time',
    excerpt: 'Discover the fascinating secrets of pharaohs, pyramids, and ancient Egyptian civilization that continue to captivate travelers from around the world.',
    content: 'Full blog post content would go here...',
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
    content: 'Full blog post content would go here...',
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
    content: 'Full blog post content would go here...',
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
    content: 'Full blog post content would go here...',
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
    content: 'Full blog post content would go here...',
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
    content: 'Full blog post content would go here...',
    author: 'Environmental Team',
    publishedAt: '2024-02-15',
    readTime: '9 min read',
    category: 'Responsible Travel',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop',
    tags: ['Sustainable Tourism', 'Conservation', 'Responsible Travel', 'Heritage']
  }
];

const categories = [
  'All Posts',
  'Culture & History',
  'Travel Tips',
  'Destinations',
  'Food & Culture',
  'Travel Planning',
  'Responsible Travel'
];

export default function Blog() {
  useSEO({
    title: "Egypt Travel Blog - Luxury Travel Tips & Guides",
    description: "Expert tips, destination guides, and insider knowledge for luxury travel in Egypt.",
  });

  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ["/api/blog/posts"],
  });

  const blogPosts = (postsResponse as any)?.posts || [];

  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = post.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-background via-accent/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6">
            Travel Stories & Insights
          </h1>
          <div className="w-32 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover Egypt through the eyes of our travel experts. From ancient mysteries to modern luxury, 
            explore stories that inspire and guide your perfect Egyptian adventure.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="relative w-full max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Results Count */}
            <p className="text-muted-foreground mb-8">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              {selectedCategory !== 'All Posts' && ` in "${selectedCategory}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background border-b border-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="min-w-[140px]"
                data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {filteredPosts.map((post: any) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02]" data-testid={`blog-post-${post.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.featuredImage || 'https://images.unsplash.com/photo-1539650116574-75c0c6d04136?q=80&w=2070&auto=format&fit=crop'}
                      alt={post.titleEn}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-serif font-bold text-white mb-2 line-clamp-2" data-testid={`text-title-${post.slug}`}>
                        {post.titleEn}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3" data-testid={`text-excerpt-${post.slug}`}>
                      {post.excerpt || 'Read this article to learn more...'}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" asChild data-testid={`button-read-${post.slug}`}>
                        <Link href={`/blog/${post.slug}`}>
                          <span>Read More</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-6">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                  No Articles Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search terms or browse different categories to find more travel stories.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Posts');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Stay Inspired
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Subscribe to our newsletter for the latest travel insights, exclusive destination guides, 
            and special offers for your next Egyptian adventure.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]">
                Subscribe to Newsletter
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
