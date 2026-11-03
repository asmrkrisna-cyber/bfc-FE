'use client';
import { useState } from 'react';
import { Transaction } from '@/data/riwayatData';
import { SearchIcon, PrinterIcon, AlertIcon } from '@/components/Icons';

interface TransactionListProps {
  transactions: Transaction[];
  selectedTxId: string;
  onSelectTx: (id: string) => void;
  onReprintTx?: (tx: Transaction) => void;
  onVoidTx?: (tx: Transaction) => void;
}

export default function TransactionList({
  transactions,
  selectedTxId,
  onSelectTx,
  onReprintTx,
  onVoidTx,
}: TransactionListProps) {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUKSES' | 'VOID'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const countSukses = transactions.filter((t) => !t.status?.toUpperCase().includes('VOID')).length;
  const countVoid = transactions.filter((t) => t.status?.toUpperCase().includes('VOID')).length;

  const filtered = transactions.filter((tx) => {
    const isVoid = tx.status?.toUpperCase().includes('VOID');
    if (filterStatus === 'SUKSES' && isVoid) return false;
    if (filterStatus === 'VOID' && !isVoid) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      tx.id.toLowerCase().includes(query) ||
      (tx.customerName && tx.customerName.toLowerCase().includes(query)) ||
      (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(query)) ||
      (tx.tableNumber && tx.tableNumber.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex-1 bg-white border border-[#EBE6DF] rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Filter Bar */}
      <div className="space-y-3 border-b border-[#EBE6DF] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-sm text-[#2C221E]">
            Daftar Riwayat Transaksi ({transactions.length})
          </h2>

          {/* Filter Status: Semua, Sukses, Void */}
          <div className="flex bg-[#F5F2EC] p-0.5 rounded-xl border border-[#EBE6DF] text-xs font-bold">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterStatus === 'ALL'
                  ? 'bg-[#6E5545] text-white shadow-xs'
                  : 'text-[#7B6E65] hover:text-[#2C221E]'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setFilterStatus('SUKSES')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterStatus === 'SUKSES'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-[#7B6E65] hover:text-[#2C221E]'
              }`}
            >
              Sukses ({countSukses})
            </button>
            <button
              onClick={() => setFilterStatus('VOID')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterStatus === 'VOID'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-[#7B6E65] hover:text-[#2C221E]'
              }`}
            >
              Void ({countVoid})
            </button>
          </div>
        </div>

        {/* Input Pencarian */}
        <div className="w-full relative">
          <SearchIcon className="w-4 h-4 text-[#A89F91] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nomor transaksi, nama pelanggan, meja, atau metode bayar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3.5 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] placeholder-[#A89F91]"
          />
        </div>
      </div>

      {/* List Card Transaksi */}
      <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {filtered.map((tx) => {
          const isVoid = tx.status?.toUpperCase().includes('VOID');
          const isSelected = selectedTxId === tx.id;

          return (
            <div
              key={tx.id}
              onClick={() => onSelectTx(tx.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                isSelected
                  ? 'border-[#6E5545] bg-[#FAF7F2] ring-1 ring-[#6E5545]'
                  : isVoid
                  ? 'border-red-200 bg-red-50/30 hover:bg-red-50/50'
                  : 'border-[#EBE6DF] bg-[#FDFBF7] hover:bg-white'
              }`}
            >
              {/* Info Utama */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#2C221E]">{tx.id}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isVoid
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isVoid ? 'VOID' : 'SUKSES'}
                  </span>
                  {tx.tableNumber && tx.tableNumber !== '-' && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 text-[#7B6E65] rounded font-medium">
                      Meja: {tx.tableNumber}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#2C221E] font-semibold">{tx.customerName || 'Tamu / Umum'}</p>
                <p className="text-[10px] text-[#7B6E65]">
                  {tx.date || 'Hari ini'} • {tx.time} • <span className="font-medium text-[#2C221E]">{tx.paymentMethod}</span>
                  {tx.items && tx.items.length > 0 && ` • (${tx.items.length} item)`}
                </p>

                {isVoid && tx.voidReason && (
                  <p className="text-[10px] text-red-600 font-medium">
                    Alasan: {tx.voidReason}
                  </p>
                )}
              </div>

              {/* Total & Tombol Aksi per Transaksi */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EBE6DF]">
                <span
                  className={`font-bold text-sm ${
                    isVoid ? 'text-red-700 line-through' : 'text-[#2C221E]'
                  }`}
                >
                  Rp {tx.total.toLocaleString('id-ID')}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Tombol Cetak Struk per Transaksi */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTx(tx.id);
                      if (onReprintTx) onReprintTx(tx);
                    }}
                    title={isVoid ? 'Cetak Salinan Struk Void' : 'Cetak Ulang Struk (Reprint)'}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isVoid
                        ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                        : 'bg-white hover:bg-gray-100 text-[#2C221E] border-[#EBE6DF]'
                    }`}
                  >
                    <PrinterIcon className="w-3.5 h-3.5" />
                    <span>{isVoid ? 'Struk Void' : 'Struk'}</span>
                  </button>

                  {/* Tombol Void per Transaksi (hanya muncul jika SUKSES) */}
                  {!isVoid && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTx(tx.id);
                        if (onVoidTx) onVoidTx(tx);
                      }}
                      title="Batalkan / Void transaksi ini"
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <AlertIcon className="w-3.5 h-3.5" />
                      <span>Void</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-[#FAF7F2] rounded-xl border border-[#EBE6DF] text-xs text-[#7B6E65]">
            Tidak ada transaksi yang cocok dengan pencarian atau filter.
          </div>
        )}
      </div>
    </div>
  );
}
