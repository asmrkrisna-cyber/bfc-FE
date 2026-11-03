'use client';
import { useState } from 'react';

interface AddDiscountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formData: {
    code: string;
    name: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: string;
    minPurchase: string;
  }) => void;
}

export default function AddDiscountForm({ isOpen, onClose, onAdd }: AddDiscountFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: '',
    minPurchase: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.value) return;
    onAdd(formData);
    setFormData({ code: '', name: '', type: 'PERCENTAGE', value: '', minPurchase: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
        <h3 className="font-bold text-sm text-[#2C221E] border-b border-[#EBE6DF] pb-3">Tambah Diskon / Promo Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-[#2C221E]">Kode Voucher (Cth: PROMO10)</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
              placeholder="KODEPROMO"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#2C221E]">Nama Promo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
              placeholder="Diskon Akhir Pekan"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#2C221E]">Tipe Diskon</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium bg-white focus:outline-none focus:border-[#6E5545]"
              >
                <option value="PERCENTAGE">Persen (%)</option>
                <option value="FIXED">Nominal (Rp)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2C221E]">Nilai Diskon</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
                placeholder="10 atau 5000"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#2C221E]">Minimum Belanja (Rp)</label>
            <input
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
              className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
              placeholder="0 jika tidak ada"
            />
          </div>
          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Simpan Diskon
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}