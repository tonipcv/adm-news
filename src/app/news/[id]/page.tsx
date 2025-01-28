import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '@/components/Header';

export default async function NewsPage({ params }: { params: { id: string } }) {
  const news = await prisma.news.findUnique({
    where: {
      id: parseInt(params.id)
    }
  });

  if (!news) {
    notFound();
  }

  const publishDate = new Date(news.publishedAt);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-black/70 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="text-zinc-400 hover:text-white inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para notícias
              </Link>
            </Button>
            {news.isPro && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-950 text-white border border-zinc-800">
                PRO
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {news.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <time dateTime={publishDate.toISOString()}>
                  {publishDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>{Math.ceil(news.content.length / 1000)} min de leitura</span>
              </div>
            </div>
          </div>

          {news.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          )}

          <div className="border-l-4 border-zinc-800 pl-6 py-4">
            <p className="text-lg sm:text-xl text-zinc-300 font-medium italic">
              {news.summary}
            </p>
          </div>

          <div className="prose prose-invert prose-zinc max-w-none 
            prose-headings:font-medium prose-headings:text-white 
            prose-p:text-zinc-300 prose-strong:text-white prose-strong:font-medium
            prose-a:text-blue-400 hover:prose-a:text-blue-300
            prose-blockquote:border-zinc-800 prose-blockquote:text-zinc-400
            prose-code:text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
            prose-img:rounded-xl prose-img:border prose-img:border-zinc-800
            prose-hr:border-zinc-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {news.content}
            </ReactMarkdown>
          </div>

          {news.video && (
            <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <iframe
                src={news.video}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}
        </article>

        <nav className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex justify-between text-sm">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="text-zinc-400 hover:text-white">
                ← Voltar para notícias
              </Link>
            </Button>
          </div>
        </nav>
      </main>
    </div>
  );
} 