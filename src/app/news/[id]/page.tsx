import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function NewsPage({ params }: PageProps) {
  const news = await prisma.news.findUnique({
    where: {
      id: parseInt(params.id)
    }
  });

  if (!news) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl text-white mb-4">Notícia não encontrada</h1>
          <Button variant="ghost" asChild>
            <Link href="/" className="text-zinc-400 hover:text-white">
              ← Voltar
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-normal text-white">Portal</h1>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="text-zinc-400 hover:text-white text-sm sm:text-base">
                ← Voltar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          {news.image && (
            <div className="relative w-full aspect-[16/9] sm:h-[500px]">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          
          <CardContent className="p-4 sm:p-8">
            <div className="mb-4 sm:mb-8">
              <h1 className="text-lg sm:text-3xl font-normal text-white mb-2 sm:mb-4">
                {news.title}
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm">
                {new Date(news.publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <p className="text-sm sm:text-xl text-zinc-300 mb-4 sm:mb-8 font-normal">
              {news.summary}
            </p>

            {news.video && (
              <div className="mb-4 sm:mb-8 rounded overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={news.video}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="prose prose-xs sm:prose-base prose-invert max-w-none">
              <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {news.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 