import { NextResponse } from 'next/server';
import { s3Client } from '@/lib/minio';
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  console.log('Iniciando upload:', { filename });

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    );
  }

  try {
    const blob = await request.blob();
    console.log('Blob recebido:', { 
      type: blob.type, 
      size: blob.size 
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    console.log('Buffer criado:', { 
      length: buffer.length 
    });

    const command = new PutObjectCommand({
      Bucket: 'katsu',
      Key: filename,
      Body: buffer,
      ContentType: blob.type,
      ACL: 'public-read',
    });

    console.log('Enviando para MinIO...');
    const result = await s3Client.send(command);
    console.log('Resultado do upload:', result);

    const imageUrl = `https://minios3-minio.dpbdp1.easypanel.host/katsu/${filename}`;
    console.log('URL gerada:', imageUrl);

    return NextResponse.json({
      url: imageUrl,
      success: true
    });
  } catch (error) {
    console.error('Erro detalhado do upload:', error);
    return NextResponse.json(
      { 
        error: 'Error uploading file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 