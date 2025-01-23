import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Se não for GET, não aplica o middleware
  if (request.method !== 'GET') {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Permitir qualquer origem para GET
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 