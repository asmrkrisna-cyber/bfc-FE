'use client';
import { Transaction } from '@/data/riwayatData';
import { AlertIcon, ReceiptIcon, PrinterIcon } from '@/components/Icons';

interface ReprintModalProps {
  selectedTx: Transaction;
  onClose: () => void;
  onPrint: () => void;
}

export default function ReprintModal({ selectedTx, onClose, onPrint }: ReprintModalProps) {
  const isVoid = selectedTx.status?.toUpperCase().includes('VOID');

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF] print-receipt-area">
        {/* Status Banner Struk */}
        <div
          className={`border text-[10px] font-extrabold flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg uppercase tracking-wider ${
            isVoid
              ? 'bg-red-100 border-red-300 text-red-800'
              : 'bg-amber-100 border-amber-300 text-amber-900'
          }`}
        >
          {isVoid ? (
            <>
              <AlertIcon className="w-3.5 h-3.5 shrink-0" />
              <span>STRUK VOID / TRANSAKSI DIBATALKAN</span>
            </>
          ) : (
            <>
              <ReceiptIcon className="w-3.5 h-3.5 shrink-0" />
              <span>SALINAN RESI / CETAK ULANG (REPRINT)</span>
            </>
          )}
        </div>

        {/* Header Toko */}
        <div className="text-center space-y-0.5 border-b border-dashed border-[#EBE6DF] pb-3">
          <h3 className="font-extrabold text-base text-[#2C221E] uppercase tracking-wide">
            BREAKFREE COFFEE
          </h3>
          <p className="text-[10px] text-[#7B6E65]">Malang, Indonesia</p>
          <p className="text-[10px] text-[#7B6E65]">
            {selectedTx.date || 'Hari Ini'}, {selectedTx.time}
          </p>
        </div>

        {/* Informasi Transaksi */}
        <div className="text-[11px] text-[#7B6E65] space-y-1.5 border-b border-dashed border-[#EBE6DF] pb-3">
          <div className="flex justify-between">
            <span className="font-bold text-[#2C221E]">No. Transaksi:</span>
            <span className="font-mono font-bold text-[#2C221E]">{selectedTx.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-[#2C221E]">Pelanggan:</span>
            <span>{selectedTx.customerName || 'Tamu / Umum'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-[#2C221E]">No. Meja:</span>
            <span>{selectedTx.tableNumber || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-[#2C221E]">Metode Bayar:</span>
            <span className="font-semibold text-[#2C221E]">{selectedTx.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#2C221E]">Status Transaksi:</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isVoid ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isVoid ? 'VOID / BATAL' : 'SUKSES'}
            </span>
          </div>
          {isVoid && selectedTx.voidReason && (
            <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[10px]">
              <span className="font-bold">Alasan Void:</span> {selectedTx.voidReason}
            </div>
          )}
        </div>

        {/* Daftar Item Pesanan */}
        <div className="space-y-2 max-h-40 overflow-y-auto text-xs border-b border-dashed border-[#EBE6DF] pb-3 pr-1">
          {selectedTx.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <span className={`text-[#2C221E] ${isVoid ? 'line-through text-gray-400' : ''}`}>
                {item.name} <span className="text-[#7B6E65] font-normal">x{item.qty}</span>
              </span>
              <span className={`font-semibold ${isVoid ? 'text-gray-400' : 'text-[#2C221E]'}`}>
                Rp {(item.price * item.qty).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>

        {/* Kalkulasi & Total */}
        <div className="text-xs space-y-1.5 border-b border-dashed border-[#EBE6DF] pb-3">
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

          <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-dashed border-[#EBE6DF]">
            <span className={isVoid ? 'text-red-700' : 'text-[#2C221E]'}>
              {isVoid ? 'Nilai Void (Batal)' : 'Total Bayar'}
            </span>
            <span
              className={`text-base font-extrabold ${
                isVoid ? 'text-red-700' : 'text-[#2C221E]'
              }`}
            >
              Rp {selectedTx.total.toLocaleString('id-ID')}
            </span>
          </div>

          {selectedTx.cashGiven ? (
            <>
              <div className="flex justify-between text-[#7B6E65] pt-1">
                <span>Tunai</span>
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

        {/* Footer Thermal Struk */}
        <div className="text-center text-[10px] text-[#7B6E65] pt-1">
          {isVoid ? (
            <p className="text-red-600 font-bold">*** TRANSAKSI TIDAK BERLAKU / TELAH DI-VOID ***</p>
          ) : (
            <p>Terima kasih atas kunjungan Anda!</p>
          )}
        </div>

        {/* Tombol Aksi (Tidak Ikut Tercetak Saat Di-Print) */}
        <div className="space-y-2 pt-2 no-print">
          <button
            onClick={onPrint}
            className="w-full py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <PrinterIcon className="w-4 h-4 text-white" />
            <span>Cetak ke Printer Thermal</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
