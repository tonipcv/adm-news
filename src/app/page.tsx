import NewsSection from '@/components/NewsSection';

export default function Home() {
  console.log('Renderizando Home page');
  
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-normal text-white">Portal</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        <div className="debug-info hidden">
          {/* Elemento para debug */}
          <pre className="text-xs text-zinc-500">
            {JSON.stringify({
              env: process.env.NODE_ENV,
              time: new Date().toISOString()
            }, null, 2)}
          </pre>
        </div>
        <NewsSection />
      </main>
    </div>
  );
}
