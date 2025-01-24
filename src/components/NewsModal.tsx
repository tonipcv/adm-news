'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { News } from '@/types/news';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: News) => void;
  initialData?: News | null;
}

export function NewsModal({ isOpen, onClose, onSubmit, initialData }: NewsModalProps) {
  const [formData, setFormData] = useState<News>({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    image: initialData?.image || '',
    video: initialData?.video || '',
    id: initialData?.id || 0,
    publishedAt: initialData?.publishedAt || ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/v1/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar notícia');
      }

      const result = await response.json();
      if (result.success) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">
            {initialData ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Título</label>
            <Input
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título da notícia"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Resumo</label>
            <Textarea
              value={formData.summary}
              onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Digite um breve resumo"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Conteúdo</label>
            <Textarea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Digite o conteúdo em markdown"
              className="bg-zinc-800 border-zinc-700 min-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">URL da Imagem</label>
              <Input
                value={formData.image || ''}
                onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://exemplo.com/imagem.jpg"
                className="bg-zinc-800 border-zinc-700"
              />
              {formData.image && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">URL do Vídeo</label>
              <Input
                value={formData.video || ''}
                onChange={e => setFormData(prev => ({ ...prev, video: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 