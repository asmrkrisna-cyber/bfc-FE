/**
 * Next.js Server-side Instrumentation & Error Logging
 * Sesuai Dokumen: Mencatat error sisi server menggunakan hook `onRequestError`
 * dengan penyensoran data sensitif (header Authorization & Cookie).
 */

export async function register() {
  // Inisialisasi monitoring atau APM saat server Next.js mulai aktif
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] BreakFree POS Server Runtime initialized with secure error logging.');
  }
}

export async function onRequestError(
  err: { digest?: string } & Error,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  },
  context: {
    routerKind: string;
    routeType: string;
  }
) {
  // SENSOR DATA SENSITIF: Cookie & Authorization dilarang keras dicatat ke log
  const sanitizedHeaders = { ...request.headers };
  if (sanitizedHeaders.authorization) {
    sanitizedHeaders.authorization = '[REDACTED]';
  }
  if (sanitizedHeaders.cookie) {
    sanitizedHeaders.cookie = '[REDACTED]';
  }

  const serverErrorLog = {
    timestamp: new Date().toISOString(),
    event: 'SERVER_REQUEST_ERROR',
    digest: err.digest || 'no-digest',
    method: request.method,
    path: request.path,
    routerKind: context.routerKind,
    routeType: context.routeType,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    headers: sanitizedHeaders,
  };

  // Log berformat JSON terstruktur
  console.error(JSON.stringify(serverErrorLog));
}

