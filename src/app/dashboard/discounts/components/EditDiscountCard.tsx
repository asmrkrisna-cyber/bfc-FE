'use client';
import { useState } from 'react';
import { DiscountItem } from '@/data/discountData';

interface EditDiscountModalProps {
  isOpen: boolean;
  item: DiscountItem | null;
  onClose: () => void;
  onSave: (id: string, data: {
    code: string;
    name: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    minPurchase: number;
    maxDiscount?: number | null;
    description?: string;
  }) => void;
}

export default function EditDiscountCard({
  isOpen,
  item,
  onClose,
  onSave,
}: EditDiscountModalProps) {
  if (!isOpen || !item) return null;
  return <EditDiscountForm key={item.id} item={item} onClose={onClose} onSave={onSave} />;
}

function EditDiscountForm({
  item,
  onClose,
  onSave,
}: {
  item: DiscountItem;
  onClose: () => void;
  onSave: EditDiscountModalProps['onSave'];
}) {
  const [code, setCode] = useState(item.code || '');
  const [name, setName] = useState(item.name || '');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>(item.type || 'PERCENTAGE');
  const [value, setValue] = useState(item.value?.toString() || '');
  const [minPurchase, setMinPurchase] = useState(item.minPurchase?.toString() || '0');
  const [maxDiscount, setMaxDiscount] = useState(item.maxDiscount?.toString() || '');
  const [description, setDescription] = useState(item.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !value) return;

    onSave(item.id, {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      value: Number(value),
      minPurchase: Number(minPurchase) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
        <h3 className="font-bold text-sm text-[#2C221E] border-b border-[#EBE6DF] pb-3">
          Edit Diskon / Promo
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-[#2C221E]">Kode Voucher</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium uppercase focus:outline-none focus:border-[#6E5545]"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#2C221E]">Nama Promo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#2C221E]">Tipe Diskon</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'PERCENTAGE' | 'FIXED')}
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#2C221E]">Min. Belanja (Rp)</label>
              <input
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2C221E]">Maks. Diskon (Rp, opsional)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
                placeholder="Tanpa batas"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#2C221E]">Deskripsi Promo (opsional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 mt-1 border border-[#EBE6DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6E5545]"
              placeholder="Berlaku untuk semua menu..."
            />
          </div>
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#EBE6DF] hover:bg-gray-50 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
