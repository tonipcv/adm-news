import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    await prisma.$connect();
    
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: 'desc'
      }
    });
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('Database error:', error);
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    await prisma.$connect();
    
    const data = await request.json();
    
    const cleanData = {
      title: data.title,
      summary: data.summary || '',
      content: data.content,
      image: data.image || null,
      video: data.video || null,
      publishedAt: new Date(),
    };

    const news = await prisma.news.create({
      data: cleanData
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao criar notícia' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.news.delete({
      where: {
        id: parseInt(id)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Error deleting news' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await prisma.$connect();
    
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const cleanData = {
      title: updateData.title,
      summary: updateData.summary || '',
      content: updateData.content,
      image: updateData.image || null,
      video: updateData.video || null,
    };

    const news = await prisma.news.update({
      where: { id: parseInt(id) },
      data: cleanData
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar notícia' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 