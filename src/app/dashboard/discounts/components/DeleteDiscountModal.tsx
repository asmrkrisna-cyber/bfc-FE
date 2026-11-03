'use client';

import { TrashIcon } from '@/components/Icons';

interface DeleteDiscountModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDiscountModal({ onClose, onConfirm }: DeleteDiscountModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF] text-[#2C221E] text-center animate-fadeIn">
        <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto font-bold">
          <TrashIcon className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-base text-[#2C221E]">Hapus Diskon</h3>
          <p className="text-xs text-[#7B6E65] mt-1.5 leading-relaxed">
            Yakin ingin menghapus diskon ini dari sistem? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#FDFBF7] hover:bg-[#EBE6DF] border border-[#EBE6DF] text-[#7B6E65] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
