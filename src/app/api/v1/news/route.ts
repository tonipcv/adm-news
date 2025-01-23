import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/news - Lista todas as notícias
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit,
      skip: offset,
    });
    
    return NextResponse.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/news - Cria uma nova notícia
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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

    const news = await prisma.news.create({
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
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao criar notícia' 
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