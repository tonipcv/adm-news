'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { News } from '@/types/news';
import { useState } from 'react';

interface NewsCardProps extends News {
  showControls?: boolean;
  onEdit?: (item: NewsCardProps) => void;
  onDelete?: (id: number) => void;
}

export function NewsCard({ id, title, summary, content, image, publishedAt, isPro, showControls, onEdit, onDelete }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="px-3 py-2.5 sm:p-3 md:p-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
      <div className="flex gap-2.5 sm:gap-3 md:gap-4">
        {/* Avatar */}
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 shrink-0">
          <AvatarImage src="/avatar.png" alt="Futuros Tech" />
          <AvatarFallback>FT</AvatarFallback>
        </Avatar>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 md:space-y-2">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm md:text-base flex-wrap">
                <span className="font-bold text-white truncate">Futuros Tech</span>
                <span className="text-zinc-400 text-xs md:text-sm truncate">@futurostech</span>
                <span className="text-zinc-400 mx-0.5">·</span>
                <time className="text-zinc-400 text-xs md:text-sm" dateTime={publishedAt}>
                  {new Date(publishedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </time>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-zinc-400 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Título e Conteúdo */}
          <div className="space-y-1 sm:space-y-1.5">
            <Link href={`/news/${id}`} className="block">
              <h2 className="font-bold text-white text-sm sm:text-base line-clamp-2">{title}</h2>
            </Link>
            <div className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert prose-zinc max-w-none prose-xs sm:prose-sm md:prose-base"
              >
                {summary}
              </ReactMarkdown>
            </div>
          </div>

          {/* Imagem */}
          {image && !imageError && (
            <div className="relative mt-2 sm:mt-2.5 md:mt-3 aspect-[16/9] rounded-md sm:rounded-lg md:rounded-xl overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 600px, 800px"
                onError={() => setImageError(true)}
                unoptimized
              />
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between pt-2 sm:pt-2.5 md:pt-3 -ml-1.5">
            <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-xs sm:text-sm text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10">
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
              <span>24</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-xs sm:text-sm text-zinc-400 hover:text-pink-400 hover:bg-pink-400/10">
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
              <span>142</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-xs sm:text-sm text-zinc-400 hover:text-green-400 hover:bg-green-400/10">
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
              <span>12</span>
            </Button>
          </div>

          {showControls && (
            <div className="flex justify-end gap-2 mt-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onEdit?.({ 
                  id, 
                  title, 
                  summary, 
                  content, 
                  image, 
                  publishedAt,
                  isPro
                })}
              >
                Editar
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(id)}
              >
                Deletar  
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
} 