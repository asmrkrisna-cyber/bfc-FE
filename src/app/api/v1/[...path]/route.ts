import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_BASE_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5000/api/v1'
).replace(/\/+$/, '');

const FORWARDED_REQUEST_HEADERS = ['authorization', 'content-type', 'accept'];
const FORWARDED_RESPONSE_HEADERS = ['content-type', 'cache-control'];

async function proxyToBackend(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = path.map((segment) => encodeURIComponent(segment)).join('/');
  const targetUrl = `${BACKEND_BASE_URL}/${targetPath}${request.nextUrl.search}`;

  const headers = new Headers();
  for (const key of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    headers.set('x-forwarded-for', forwardedFor);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      cache: 'no-store',
    });

    const resHeaders = new Headers();
    for (const key of FORWARDED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(key);
      if (value) resHeaders.set(key, value);
    }

    if (upstream.status === 204 || upstream.status === 304) {
      return new NextResponse(null, {
        status: upstream.status,
        headers: resHeaders,
      });
    }

    const responseBody = await upstream.arrayBuffer();
    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: resHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        code: 'BACKEND_UNAVAILABLE',
        message: 'Server backend (port 5000) belum aktif atau sedang dimulai ulang.',
      },
      { status: 503 }
    );
  }
}

export const GET = proxyToBackend;
export const POST = proxyToBackend;
export const PUT = proxyToBackend;
export const PATCH = proxyToBackend;
export const DELETE = proxyToBackend;
export const OPTIONS = proxyToBackend;
