"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { Badge } from "@/components/ui/badge";

// Interface for fetched articles
interface FetchedArticle {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

// Helper to calculate read time (words per minute)
const calculateReadTime = (content: string): string => {
  if (!content) return "1";
  const words = content.trim().split(/\s+/).length;
  const wpm = 200; // Average reading speed
  const time = Math.ceil(words / wpm);
  return time < 1 ? "1" : time.toString();
};

// Added loop and skipSnaps: false
const OPTIONS: EmblaOptionsType = { 
  align: 'center', 
  containScroll: 'trimSnaps', 
  skipSnaps: false,
  loop: true
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<FetchedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hashtags] = useState(['#hashtags', '#trending', '#popular', '#news']);

  // Embla Carousel state and refs
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  // Scale effect state
  const [scale, setScale] = useState<number[]>([]);
  const [opacity, setOpacity] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    
    // Scale effect calculation
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      
      // Calculate scale (center: 1, sides: 0.8)
      const scale = 1 - Math.abs(diffToTarget) * 0.2;
      
      // Calculate opacity (center: 1, sides: 0.5)
      const opacity = 1 - Math.abs(diffToTarget) * 0.5;
      
      return [scale, opacity];
    });
    
    setScale(styles.map((style) => style[0]));
    setOpacity(styles.map((style) => style[1]));
  }, [emblaApi, setScale, setOpacity]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    setScrollSnaps(emblaApi.scrollSnapList());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    onScroll();
  }, [onScroll]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect(emblaApi); // Set initial index
    onScroll(); // Set initial scale
    
    emblaApi.on('select', onSelect); // Listen for changes
    emblaApi.on('reInit', onSelect); // Handle re-initialization
    emblaApi.on('scroll', onScroll); // Apply scale on scroll
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('scroll', onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const selectedArticle = articles.length > 0 ? articles[selectedIndex] : null;

  return (
    <div className="min-h-screen text-foreground p-6 md:p-8 relative">
      {/* Background Effects */}
      <div className="absolute w-[183px] h-[157px] top-0 right-0 bg-[#d9d9d9] rounded-[91.5px/78.5px] blur-[200px] opacity-20 z-0" />
      <div className="absolute w-[183px] h-[157px] bottom-0 right-20 bg-[#d9d9d9] rounded-[91.5px/78.5px] blur-[200px] opacity-20 z-0" />
      
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-16 relative z-10">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#e1e1e1cc] tracking-wider">Explore</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative w-full bg-[#d9d9d903] rounded-full shadow-[inset_0px_2.97px_2.23px_#bebebe40,0px_2.97px_4.45px_#00000057] h-14">
            <Input
              type="text"
              placeholder="Explore Keywords, Topics, Authors..."
              className="w-full border-none bg-transparent shadow-none h-full pl-12 pr-4 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
        </div>

        {/* Search Results Text */}
        {searchQuery && (
          <div className="text-center text-muted-foreground text-sm">
            <span className="italic">Showing search results for </span>
            <span className="font-bold text-foreground text-lg">&apos;{searchQuery}&apos;</span>
          </div>
        )}

        {/* Hashtags */}
        <div className="flex gap-4 justify-center flex-wrap">
          {hashtags.map((hashtag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-6 py-2 rounded-full border border-solid border-[#d9d9d9] flex items-center justify-center bg-transparent"
            >
              <span className="font-normal text-muted-foreground text-sm tracking-wider">
                {hashtag}
              </span>
            </Badge>
          ))}
        </div>

        {/* Embla Carousel Section with Effects */}
        <div className="embla relative -mx-6 md:-mx-8 pt-8 pb-12">
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex items-center space-x-4 md:space-x-6 pl-6 pr-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="embla__slide w-72 md:w-80 flex-shrink-0 space-y-3">
                    <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : articles.length === 0 ? (
                <div className="w-full flex justify-center py-12 embla__slide">
                  <p className="text-center text-muted-foreground">No articles found.</p>
                </div>
              ) : (
                articles.map((article, index) => {
                  const cardData = {
                    title: article.title,
                    author: article.author,
                    readTime: calculateReadTime(article.content),
                  };
                  
                  const scaleStyle = scale.length > 0 ? {
                    transform: `scale(${scale[index]})`,
                    opacity: opacity[index],
                    transition: 'transform 0.3s, opacity 0.3s'
                  } : {};
                  
                  return (
                    <div 
                      key={article._id} 
                      className={`embla__slide w-72 md:w-80 h-[354px] flex-shrink-0 ${
                        index === selectedIndex ? 'is-selected' : ''
                      }`}
                      style={scaleStyle}
                    >
                      <Link href={`/articles/${article._id}`} className="block h-full" tabIndex={index === selectedIndex ? 0 : -1}> 
                        <ArticleCard article={cardData} />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-6 gap-2">
            <Button 
              onClick={scrollPrev} 
              disabled={!prevBtnEnabled}
              variant="outline" 
              size="icon" 
              className="rounded-full"
            >
              ←
            </Button>
            <Button 
              onClick={scrollNext} 
              disabled={!nextBtnEnabled}
              variant="outline" 
              size="icon" 
              className="rounded-full"
            >
              →
            </Button>
          </div>
        </div>
        
        {!isLoading && selectedArticle && (
           <div className="text-center pt-10 md:pt-16 border-t border-border">
             <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
               incididunt ut labore et dolore magna aliqua.
             </p>
             <Link href={`/articles/${selectedArticle._id}`}>
                <Button
                  className="rounded-[3.26px] shadow-[0px_3.54px_9.03px_#00000040] bg-gradient-to-br from-[rgba(30,31,36,0.97)] to-[rgba(30,31,36,0.97)] flex items-center justify-center gap-2 px-6 py-3"
                >
                  <span className="font-normal text-[#ffffffcc] text-lg tracking-wider whitespace-nowrap">
                    Read Now
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
             </Link>
           </div>
        )}
      </div>
    </div>
  );
}