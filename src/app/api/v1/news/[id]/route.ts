import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Extrair o ID da URL
    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const idString = segments[segments.length - 1];
    
    const id = parseInt(idString, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Notícia não encontrada' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar notícia' 
      },
      { status: 500 }
    );
  }
} 