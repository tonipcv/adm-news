import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  backLink?: {
    href: string;
    text: string;
  };
}

export default function Header({ title, backLink }: HeaderProps) {
  return (
    <div className="bg-black border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/" className="flex justify-center py-4">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={180}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </div>
    </div>
  );
} 