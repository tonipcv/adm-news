import TwitterStyleNews from '@/components/TwitterStyleNews';

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800 sticky top-0 z-10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-sm sm:text-lg font-medium text-white">Página Inicial</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
        <TwitterStyleNews />
      </main>
    </div>
  );
} 