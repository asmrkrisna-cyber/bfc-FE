'use client';
import { DiscountItem } from '@/data/discountData';

interface DiscountCardProps {
  item: DiscountItem;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DiscountCard({ item, onToggleActive, onDelete }: DiscountCardProps) {
  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all ${
        item.isActive ? 'border-[#EBE6DF]' : 'border-red-200 bg-red-50/20 opacity-75'
      }`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-[#6E5545] bg-[#F5F2EC] px-2.5 py-0.5 rounded-md border border-[#EBE6DF]">
            {item.code}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {item.isActive ? 'Aktif' : 'Non-Aktif'}
          </span>
        </div>
        <h3 className="text-sm font-bold text-[#2C221E]">{item.name}</h3>
        <p className="text-xs font-bold text-emerald-700">
          {item.type === 'PERCENTAGE' ? `Diskon ${item.value}%` : `Potongan Rp ${item.value.toLocaleString('id-ID')}`}
        </p>
        <p className="text-[10px] text-[#7B6E65]">
          Min. Belanja: Rp {item.minPurchase.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-[#EBE6DF] flex items-center justify-between">
        <button
          onClick={() => onToggleActive(item.id)}
          className="text-[11px] font-medium text-[#7B6E65] hover:text-[#2C221E] cursor-pointer"
        >
          {item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium cursor-pointer border border-red-200"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}