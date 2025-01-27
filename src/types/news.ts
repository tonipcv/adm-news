export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string | null;
  video?: string | null;
  publishedAt: string;
  isPro: boolean;
} 