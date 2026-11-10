'use client';

import { Dispatch, SetStateAction } from 'react';
import { CloseIcon } from '@/components/Icons';
import { MenuItem } from '@/data/menuData';

interface MenuFormData {
  name: string;
  category: string;
  price: string;
  description: string;
}

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: MenuItem | null;
  formData: MenuFormData;
  setFormData: Dispatch<SetStateAction<MenuFormData>>;
  categories: string[];
  handleSaveMenu: (e: React.FormEvent) => void;
}

export default function MenuFormModal({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
  categories,
  handleSaveMenu,
}: MenuFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900">
            {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer transition-colors" aria-label="Tutup">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSaveMenu} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Nama Menu</label>
            <input
              type="text"
              required
              placeholder="Contoh: Matcha Latte"
              value={formData.name}
              onChange={(e) => {
                // Hanya izinkan huruf alfabet dan spasi (tanpa angka)
                const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                setFormData({ ...formData, name: textOnly });
              }}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl text-xs text-gray-900 outline-none"
            />
            <p className="text-[10px] text-gray-400">Hanya huruf alfabet (tanpa angka)</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl text-xs text-gray-900 outline-none"
            >
              {categories.filter((c) => c !== 'Semua').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Harga (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              required
              placeholder="Contoh: 20000"
              value={formData.price}
              onChange={(e) => {
                // Hanya izinkan angka (0-9)
                const digitsOnly = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, price: digitsOnly });
              }}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl text-xs text-gray-900 outline-none"
            />
            <p className="text-[10px] text-gray-400">Hanya angka (tanpa titik atau koma)</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Deskripsi</label>
            <textarea
              rows={2}
              placeholder="Deskripsi singkat produk..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl text-xs text-gray-900 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm"
            >
              {editingItem ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
