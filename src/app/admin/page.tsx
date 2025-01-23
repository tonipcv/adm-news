'use client';
import Link from 'next/link';
import { useState } from 'react';
import NewsSection from '@/components/NewsSection';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewsModal } from '@/components/NewsModal';

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-normal text-white">Admin</h1>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Post
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        <NewsSection isAdmin showControls />
      </main>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (formData) => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
} 