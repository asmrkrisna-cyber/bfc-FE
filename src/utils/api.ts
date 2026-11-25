const SERVER_API_BASE_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5000/api/v1'
).replace(/\/+$/, '');

/**
 * Di browser selalu gunakan same-origin `/api/v1` (Next.js API proxy) agar bebas CORS,
 * tetap jalan saat diakses lewat IP LAN, dan tidak memicu `TypeError: Failed to fetch`
 * ketika backend sedang restart atau belum menyala.
 */
export const API_BASE_URL =
  typeof window !== 'undefined' ? '/api/v1' : SERVER_API_BASE_URL;
