'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2, Bookmark } from "lucide-react";

interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string;
  publishedAt: string;
}

export default function TwitterStyleNews() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/news');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar notícias');
      }

      setNews(result.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar notícias');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-zinc-500 text-sm">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-2 sm:space-y-4">
      {news.map((item) => (
        <Card 
          key={item.id} 
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-900/80 transition-colors"
        >
          <Link href={`/news/${item.id}`}>
            <div className="p-2 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Avatar className="h-6 w-6 sm:h-10 sm:w-10">
                  <AvatarImage src="/avatar.png" alt="Futuros Tech" />
                  <AvatarFallback>FT</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="font-medium text-white text-[10px] sm:text-sm">Futuros Tech</span>
                    <span className="text-zinc-500 text-[10px] sm:text-sm">@futurostech</span>
                    <span className="text-zinc-500 hidden sm:inline">·</span>
                    <span className="text-zinc-500 text-[10px] sm:text-sm">
                      {new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  
                  <p className="text-white text-[11px] sm:text-base mt-0.5 sm:mt-1 whitespace-pre-wrap">
                    {item.title}
                  </p>

                  <p className="text-zinc-400 text-[10px] sm:text-sm mt-1">
                    {item.summary}
                  </p>
                </div>
              </div>

              {item.image && (
                <div className="mt-2 sm:mt-3 rounded-md sm:rounded-xl overflow-hidden">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-1.5 sm:mt-3 text-zinc-500">
                <Button variant="ghost" size="sm" className="hover:text-emerald-500 p-0.5 sm:p-2">
                  <MessageCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-emerald-500 p-0.5 sm:p-2">
                  <Share2 className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-red-500 p-0.5 sm:p-2">
                  <Heart className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-emerald-500 p-0.5 sm:p-2">
                  <Bookmark className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
} 