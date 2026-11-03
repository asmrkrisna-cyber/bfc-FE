'use client';
import { Transaction } from '@/data/riwayatData';
import { AlertIcon, PrinterIcon } from '@/components/Icons';

interface TransactionDetailProps {
  selectedTx: Transaction | undefined;
  onOpenPrintModal: () => void;
  onOpenVoidModal: () => void;
}

export default function TransactionDetail({
  selectedTx,
  onOpenPrintModal,
  onOpenVoidModal,
}: TransactionDetailProps) {
  const isVoid = selectedTx?.status?.toUpperCase().includes('VOID');

  return (
    <div className="w-full lg:w-[420px] bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs flex flex-col justify-between shrink-0">
      {selectedTx ? (
        <div className="space-y-4">
          {/* Status Badge jika VOID atau SUKSES */}
          {isVoid ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1 text-center">
              <p className="font-bold flex items-center justify-center gap-1.5">
                <AlertIcon className="w-4 h-4 text-red-600 shrink-0" />
                <span>TRANSAKSI TELAH DIBATALKAN (VOID)</span>
              </p>
              {selectedTx.voidReason && (
                <p className="text-[11px] text-red-600 bg-white/70 py-1 px-2 rounded-lg border border-red-100">
                  <span className="font-semibold">Alasan:</span> {selectedTx.voidReason}
                </p>
              )}
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between font-bold">
              <span>Status: Transaksi Sukses</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          )}

          {/* Header Resi Struk Kasir */}
          <div className="text-center pb-4 border-b border-dashed border-[#EBE6DF]">
            <h2 className="font-extrabold text-base text-[#2C221E] tracking-wide uppercase">
              BREAKFREE COFFEE
            </h2>
            <p className="text-[11px] text-[#7B6E65]">Malang, Indonesia</p>
            <p className="text-[11px] text-[#7B6E65] mt-0.5">
              {selectedTx.date || 'Hari Ini'}, {selectedTx.time}
            </p>
          </div>

          {/* Informasi Detail Transaksi */}
          <div className="py-2 text-xs space-y-1.5 border-b border-dashed border-[#EBE6DF] text-[#2C221E]">
            <div className="flex justify-between">
              <span className="text-[#7B6E65]">No. Transaksi:</span>
              <span className="font-bold font-mono">{selectedTx.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6E65]">Pelanggan:</span>
              <span className="font-semibold">{selectedTx.customerName || 'Tamu / Umum'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6E65]">No. Meja:</span>
              <span className="font-semibold">{selectedTx.tableNumber || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6E65]">Metode Bayar:</span>
              <span className="font-semibold">{selectedTx.paymentMethod}</span>
            </div>
          </div>

          {/* Rincian Item Pesanan */}
          <div className="py-2 border-b border-dashed border-[#EBE6DF] space-y-2">
            <p className="text-[10px] font-bold text-[#7B6E65] uppercase tracking-wider">
              Item Pesanan ({selectedTx.items?.length || 0})
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedTx.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs items-start">
                  <span className={`text-[#2C221E] font-medium ${isVoid ? 'line-through text-gray-400' : ''}`}>
                    {item.name} <span className="text-[#7B6E65] font-normal">x{item.qty}</span>
                  </span>
                  <span className={`font-semibold ${isVoid ? 'text-gray-400' : 'text-[#2C221E]'}`}>
                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Perhitungan Total & Omset */}
          <div className="py-2 border-b border-dashed border-[#EBE6DF] text-xs space-y-1.5">
            <div className="flex justify-between text-[#7B6E65]">
              <span>Subtotal</span>
              <span className="font-medium text-[#2C221E]">
                Rp {(selectedTx.subtotal || selectedTx.total).toLocaleString('id-ID')}
              </span>
            </div>

            {selectedTx.discount ? selectedTx.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Diskon</span>
                <span className="font-medium">-Rp {selectedTx.discount.toLocaleString('id-ID')}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-[#7B6E65]">
              <span>Pajak (10%)</span>
              <span className="font-medium text-[#2C221E]">
                Rp {(selectedTx.tax || 0).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center font-bold text-sm text-[#2C221E] pt-2">
              <span className={isVoid ? 'text-red-700' : 'text-[#2C221E]'}>
                {isVoid ? 'Total Void' : 'Total Transaksi'}
              </span>
              <span className={`text-base font-extrabold ${isVoid ? 'text-red-700' : 'text-[#2C221E]'}`}>
                Rp {selectedTx.total.toLocaleString('id-ID')}
              </span>
            </div>

            {selectedTx.cashGiven ? (
              <>
                <div className="flex justify-between text-[#7B6E65] pt-1">
                  <span>Tunai Diterima</span>
                  <span className="font-medium text-[#2C221E]">
                    Rp {selectedTx.cashGiven.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[#137333] font-bold">
                  <span>Kembalian</span>
                  <span>Rp {(selectedTx.change || 0).toLocaleString('id-ID')}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 text-xs text-[#7B6E65]">
          Pilih salah satu transaksi untuk melihat rincian resi
        </div>
      )}

      {/* Tombol Aksi Struk & Void */}
      <div className="pt-4 space-y-2 border-t border-[#EBE6DF]">
        {selectedTx && (
          <button
            onClick={onOpenPrintModal}
            className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              isVoid
                ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                : 'bg-[#F5F2EC] hover:bg-[#EBE6DF] text-[#2C221E] border-[#EBE6DF]'
            }`}
          >
            <PrinterIcon className="w-4 h-4" />
            <span>{isVoid ? 'Cetak Struk Void (Batal)' : 'Cetak Ulang Struk (Reprint)'}</span>
          </button>
        )}
        {selectedTx && !isVoid && (
          <button
            onClick={onOpenVoidModal}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <AlertIcon className="w-4 h-4 text-white shrink-0" />
            <span>Batalkan / Void Transaksi Ini</span>
          </button>
        )}
      </div>
    </div>
  );
}
