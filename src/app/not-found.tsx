import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#EBE6DF] p-8 max-w-md w-full text-center shadow-lg space-y-5">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[#2C221E]">404 - Halaman Tidak Ditemukan</h2>
          <p className="text-xs text-[#7B6E65] leading-relaxed">
            Halaman atau menu yang Anda tuju tidak ditemukan atau alamat URL salah.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/pos"
            className="px-5 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Kembali ke Kasir (POS)
          </Link>
          <Link
            href="/dashboard/rekap-shift"
            className="px-5 py-2.5 bg-white border border-[#EBE6DF] hover:bg-stone-50 text-[#7B6E65] rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            Rekap Shift
          </Link>
        </div>
      </div>
    </div>
  );
}

