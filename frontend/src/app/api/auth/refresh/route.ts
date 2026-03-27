import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function POST(request: NextRequest) {
  try {
    // Read refreshToken cookie from the browser request
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const backendResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : {}),
      },
    });

    // Check if the response is actually JSON, if backend returns 404 HTML this will throw
    const text = await backendResponse.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    const response = NextResponse.json(data, { status: backendResponse.status });

    // Forward the new Set-Cookie header from backend to browser
    const setCookie = backendResponse.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (error) {
    console.error('Refresh proxy error:', error);
    return NextResponse.json(
      { message: 'Erro interno ao renovar sessão', error: String(error) },
      { status: 500 }
    );
  }
}
