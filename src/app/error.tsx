'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Catat error client-side tanpa mengekspos stack trace mentah ke pengguna
    console.error('Segment Error caught by error.tsx:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center shadow-lg space-y-5">
        <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[#2C221E]">Terjadi Kendala pada Halaman</h2>
          <p className="text-xs text-[#7B6E65] leading-relaxed">
            Sistem mendeteksi adanya gangguan saat memuat segmen ini. Silakan coba muat ulang atau kembali ke menu utama.
          </p>
          {error.digest && (
            <p className="text-[10px] text-gray-400 font-mono pt-1">
              Incident Digest: {error.digest}
            </p>
          )}
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => router.push('/pos')}
            className="px-5 py-2.5 bg-white border border-[#EBE6DF] hover:bg-stone-50 text-[#7B6E65] rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            Kembali ke Kasir
          </button>
        </div>
      </div>
    </div>
  );
}
