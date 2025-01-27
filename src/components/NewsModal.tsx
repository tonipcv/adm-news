'use client';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { News } from '@/types/news';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";

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
    publishedAt: initialData?.publishedAt || '',
    isPro: initialData?.isPro ?? true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.title.trim()) {
      alert('Por favor, preencha o título');
      return;
    }
    
    try {
      const method = initialData ? 'PUT' : 'POST';
      console.log('Enviando dados:', formData); // Debug

      const response = await fetch('/api/v1/news', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          publishedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar notícia');
      }

      const result = await response.json();
      console.log('Resposta:', result);

      if (result.success) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao salvar notícia');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const filename = `news/${Date.now()}-${file.name}`;

      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'POST',
        body: file,
      });

      const data = await response.json();
      console.log('Resposta do upload:', data);

      if (!response.ok) throw new Error('Upload failed');

      // Atualiza o estado com a URL da imagem
      setFormData(prev => {
        const newState = { ...prev, image: data.url };
        console.log('Novo estado após upload:', newState);
        return newState;
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload da imagem');
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
              <label className="text-sm text-zinc-400">Imagem</label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="bg-zinc-800 border-zinc-700"
                />
                <Input
                  value={formData.image || ''}
                  onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Ou cole a URL da imagem"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              {formData.image && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 mt-2">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm text-zinc-400">Tipo de Conteúdo</label>
              <p className="text-xs text-zinc-500">
                {formData.isPro ? 'Conteúdo exclusivo PRO' : 'Conteúdo gratuito'}
              </p>
            </div>
            <Switch
              checked={!formData.isPro}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPro: !checked }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!formData.title.trim()}
            >
              {initialData ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 