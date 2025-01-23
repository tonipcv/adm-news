'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string;
  video?: string;
  publishedAt: string;
}

interface NewsSectionProps {
  isPreview?: boolean;
  isAdmin?: boolean;
  showControls?: boolean;
}

export default function NewsSection({ 
  isPreview = false, 
  isAdmin = false,
  showControls = false 
}: NewsSectionProps) {
  const [news, setNews] = useState<News[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: '',
    video: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/news');
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Erro no servidor: resposta não é JSON");
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar notícias');
      }
      
      setNews(data);
    } catch (err) {
      console.error('Error details:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao carregar notícias. Tente novamente mais tarde.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addNews = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          summary: formData.summary.trim() || '',
          video: formData.video.trim() || '',
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Erro no servidor: resposta não é JSON");
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar notícia');
      }

      await fetchNews();
      setFormData({
        title: '',
        summary: '',
        content: '',
        image: '',
        video: ''
      });
      setIsAdding(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao criar notícia. Tente novamente mais tarde.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (item: News) => {
    setIsEditing(item.id);
    setFormData({
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image || '',
      video: item.video || ''
    });
    setIsAdding(true);
  };

  const updateNews = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: isEditing,
          ...formData,
          summary: formData.summary.trim() || '',
          video: formData.video.trim() || '',
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Erro no servidor: resposta não é JSON");
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar notícia');
      }

      await fetchNews();
      cancelEdit();
    } catch (err) {
      console.error('Error details:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao atualizar notícia. Tente novamente mais tarde.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({
      title: '',
      summary: '',
      content: '',
      image: '',
      video: ''
    });
  };

  const deleteNews = async (id: number) => {
    const response = await fetch(`/api/news?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await fetchNews();
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Alert className="mb-6">
          <AlertDescription>Carregando...</AlertDescription>
        </Alert>
      )}

      {isAdmin && showControls && !isPreview && (
        <div className="mb-8 sm:mb-12">
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200">
              + Nova Notícia
            </Button>
          ) : (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl font-normal text-white">
                  {isEditing ? 'Editar Notícia' : 'Nova Notícia'}
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Título da notícia"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Resumo</label>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Breve resumo"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Conteúdo</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Conteúdo completo"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400">Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="w-full text-gray-200 file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0 file:text-sm file:font-semibold
                             file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-zinc-400">
                    URL do Vídeo (opcional)
                  </label>
                  <Input
                    type="url"
                    value={formData.video}
                    onChange={(e) => setFormData(prev => ({ ...prev, video: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={isEditing ? updateNews : addNews}
                    className="bg-white text-black hover:bg-zinc-200"
                  >
                    {isEditing ? 'Atualizar' : 'Publicar'}
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="border-zinc-700 text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="space-y-4 sm:space-y-12">
        {news.map((item) => (
          <Card key={item.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
            {item.image && (
              <div className="relative w-full aspect-[16/9] sm:h-[400px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}
            
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-6 mb-3 sm:mb-6">
                <div>
                  <Link href={`/news/${item.id}`} className="group">
                    <h2 className="text-base sm:text-2xl font-normal text-white group-hover:text-zinc-300 transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                {isAdmin && showControls && (
                  <div className="flex gap-1 sm:gap-4">
                    <Button
                      onClick={() => startEditing(item)}
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteNews(item.id)}
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <p className="text-zinc-300 text-sm sm:text-lg mb-3 sm:mb-6 line-clamp-3">
                {item.summary}
              </p>

              {isPreview && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto border-zinc-700 text-zinc-400 hover:text-white text-xs sm:text-sm"
                >
                  <Link href={`/news/${item.id}`}>
                    Continuar lendo →
                  </Link>
                </Button>
              )}

              {!isPreview && (
                <div className="prose prose-xs sm:prose-base prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className="text-zinc-400 leading-relaxed line-clamp-6 sm:line-clamp-none"
                  >
                    {item.content}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 