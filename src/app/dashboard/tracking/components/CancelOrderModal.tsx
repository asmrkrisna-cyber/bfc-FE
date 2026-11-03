'use client';
import { useState } from 'react';
import { AlertIcon, CloseIcon } from '@/components/Icons';

interface CancelOrderModalProps {
  orderId: string;
  customerName: string;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
}

export default function CancelOrderModal({
  orderId,
  customerName,
  onClose,
  onConfirmCancel,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmCancel(reason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
        <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertIcon className="w-4 h-4 shrink-0" />
            <h3 className="font-bold text-sm">Pembatalan Pesanan Dapur</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#7B6E65] hover:text-[#2C221E] p-1 rounded-lg cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#7B6E65]">
          Anda akan membatalkan pesanan <span className="font-bold text-[#2C221E]">{orderId}</span> atas nama <span className="font-bold text-[#2C221E]">{customerName}</span>. 
          Harap berikan alasan pembatalan:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            required
            rows={3}
            placeholder="Contoh: Stok bahan habis / Pelanggan minta membatalkan pesanan"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545]"
          />

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Ya, Batalkan Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
