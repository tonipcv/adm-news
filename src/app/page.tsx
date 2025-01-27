import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';

export default async function HomePage() {
  const news = await prisma.news.findMany({
    orderBy: {
      publishedAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Lista de Notícias */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => {
            const publishDate = new Date(item.publishedAt);
            
            return (
              <Card 
                key={item.id} 
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <Link href={`/news/${item.id}`}>
                  {item.image && (
                    <div className="relative aspect-[16/9] rounded-t-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`
                          px-2 py-0.5 rounded-full text-[10px] font-medium
                          ${item.isPro 
                            ? 'bg-amber-500/90 text-amber-50' 
                            : 'bg-emerald-500/90 text-emerald-50'
                          }
                        `}>
                          {item.isPro ? 'PRO' : 'FREE'}
                        </span>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <time className="text-xs text-zinc-500" dateTime={publishDate.toISOString()}>
                      {publishDate.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </time>
                    
                    <h2 className="text-lg font-medium text-white mt-2 mb-1 line-clamp-2 group-hover:text-zinc-300 transition-colors">
                      {item.title}
                    </h2>
                    
                    <p className="text-zinc-400 text-sm line-clamp-2">
                      {item.summary}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">Nenhuma notícia encontrada</p>
          </div>
        )}
      </main>
    </div>
  );
}
