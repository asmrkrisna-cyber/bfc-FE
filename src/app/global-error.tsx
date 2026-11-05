'use client';

/**
 * Root Error Boundary
 * Sesuai Dokumen: Wajib memiliki tag <html> dan <body> sendiri
 * untuk menangani kerusakan fatal pada level Root Layout.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-[#FAF7F2] text-[#2C221E] min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-red-700">Aplikasi Mengalami Gangguan Fatal</h1>
            <p className="text-xs text-[#7B6E65] leading-relaxed">
              Terjadi error pada struktur dasar layout aplikasi. Kami telah mencatat kejadian ini untuk perbaikan.
            </p>
            {error.digest && (
              <p className="text-[10px] text-gray-400 font-mono pt-1">
                Ref ID: {error.digest}
              </p>
            )}
          </div>
          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

