import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface GalleryCarouselSlide {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryCarouselProps {
  slides: GalleryCarouselSlide[];
  dark?: boolean;
}

export default function GalleryCarousel({ slides, dark = false }: GalleryCarouselProps) {
  return (
    <Carousel opts={{ align: "start", loop: false }} className="w-full" data-testid="gallery-carousel">
      <div className="flex items-center justify-end gap-3 mb-6">
        <CarouselPrevious
          className={
            dark
              ? "static translate-y-0 h-10 w-10 border border-white/30 text-white hover:bg-white hover:text-primary"
              : "static translate-y-0 h-10 w-10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          }
          data-testid="button-gallery-prev"
        />
        <CarouselNext
          className={
            dark
              ? "static translate-y-0 h-10 w-10 border border-white/30 text-white hover:bg-white hover:text-primary"
              : "static translate-y-0 h-10 w-10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          }
          data-testid="button-gallery-next"
        />
      </div>
      <CarouselContent>
        {slides.map((slide, i) => (
          <CarouselItem key={i} className="basis-[80%] sm:basis-[55%] md:basis-[42%] lg:basis-[32%]">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
            {slide.caption && (
              <p className={dark ? "mt-3 text-sm text-white/70" : "mt-3 text-sm text-muted-foreground"}>
                {slide.caption}
              </p>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
