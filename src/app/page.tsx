import NewsSection from '@/components/NewsSection';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Portal" 
        backLink={{ href: "/admin", text: "Admin" }}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <NewsSection isPreview={true} isAdmin={false} />
      </main>
    </div>
  );
}
