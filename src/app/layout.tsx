import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portal de Notícias',
  description: 'Portal de notícias com as últimas atualizações',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-black text-zinc-100 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
