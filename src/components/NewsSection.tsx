'use client';
import { useState, useEffect } from 'react';
import { NewsCard } from './NewsCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { News } from '@/types/news';

interface NewsSectionProps {
  isAdmin?: boolean;
  isPreview?: boolean;
  showControls?: boolean;
  onEdit?: (item: News) => void;
  onDelete?: (id: number) => void;
}

export default function NewsSection({ isAdmin = false, isPreview = false, showControls = false, onEdit, onDelete }: NewsSectionProps) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/v1/news', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setNews(result.data);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Carregando...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-900 text-red-300">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (news.length === 0) {
    return <div className="text-center py-8 text-zinc-400">Nenhuma notícia encontrada</div>;
  }

  return (
    <div className="divide-y divide-zinc-800">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          {...item}
          showControls={showControls}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 