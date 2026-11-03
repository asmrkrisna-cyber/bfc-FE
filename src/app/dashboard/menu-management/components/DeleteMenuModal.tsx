'use client';

import { TrashIcon } from '@/components/Icons';

interface DeleteMenuModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMenuModal({ onClose, onConfirm }: DeleteMenuModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4 text-center">
        <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto font-bold">
          <TrashIcon className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-base text-gray-900">Hapus Menu</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Yakin ingin menghapus menu ini dari katalog? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
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
