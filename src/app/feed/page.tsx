import NewsSection from '@/components/NewsSection';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header fixo */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-black/70 border-b border-zinc-800">
        <div className="max-w-xl mx-auto px-3 py-2 sm:px-4 sm:py-3 md:max-w-2xl lg:max-w-3xl flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-medium text-white">Feed</h1>
          <Button variant="ghost" size="sm" className="h-7 px-2 sm:h-8 sm:px-3" asChild>
            <Link href="/" className="text-zinc-400 hover:text-white text-xs sm:text-sm">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      {/* Feed de notícias */}
      <main className="max-w-xl mx-auto md:max-w-2xl lg:max-w-3xl border-x border-zinc-800">
        <div className="divide-y divide-zinc-800">
          <NewsSection isPreview={false} />
        </div>
      </main>
    </div>
  );
} 