import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

// GET /api/v1/news - Lista todas as notícias
export async function GET() {
  try {
    console.log('📥 API: Recebendo requisição GET');
    
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: 'desc'
      }
    });
    
    console.log('📤 API: Enviando resposta', {
      count: news.length,
      sample: news[0]
    });

    return NextResponse.json({
      success: true,
      data: news
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('🔥 API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/news - Cria uma nova notícia
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const news = await prisma.news.create({
      data: {
        title: data.title,
        summary: data.summary || '',
        content: data.content,
        image: data.image || null,
        video: data.video || null,
      }
    });

    return NextResponse.json({
      success: true,
      data: news
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao criar notícia',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// PUT /api/v1/news/:id - Atualiza uma notícia existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID é obrigatório' 
        },
        { status: 400 }
      );
    }

    // Validação básica
    if (!body.title || !body.content) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Título e conteúdo são obrigatórios' 
        },
        { status: 400 }
      );
    }

    const news = await prisma.news.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        summary: body.summary || '',
        content: body.content,
        image: body.image || null,
        video: body.video || null,
      }
    });

    return NextResponse.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao atualizar notícia' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/news/:id - Remove uma notícia
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID é obrigatório' 
        },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Notícia removida com sucesso'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao remover notícia' 
      },
      { status: 500 }
    );
  }
} 