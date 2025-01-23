import NewsSection from '@/components/NewsSection';
import Header from '@/components/Header';

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Admin" 
        backLink={{ href: "/", text: "Ver site" }}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <p className="text-zinc-400">
            Gerencie o conteúdo do portal
          </p>
        </div>

        <NewsSection isAdmin={true} showControls={true} />
      </main>
    </div>
  );
} 