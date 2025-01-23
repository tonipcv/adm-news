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
    <header className="border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl font-normal text-white">{title}</h1>
          {backLink && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={backLink.href} className="text-xs sm:text-base text-zinc-400 hover:text-white">
                {backLink.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 