'use client';
import { MenuItem } from '@/data/menuData';

interface MenuCardProps {
  item: MenuItem;
  onToggleStatus: (id: string) => void;
  onOpenEditModal: (item: MenuItem) => void;
  onDeleteRequest: (id: string) => void;
}

export default function MenuCard({
  item,
  onToggleStatus,
  onOpenEditModal,
  onDeleteRequest,
}: MenuCardProps) {
  return (
    <div
      className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm space-y-4 ${
        item.isAvailable ? 'border-gray-200' : 'border-red-200 bg-red-50/30'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">
              {item.category}
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-1.5">{item.name}</h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              item.isAvailable
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {item.isAvailable ? 'Tersedia' : 'Sold Out'}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
          {item.description || 'Tidak ada deskripsi.'}
        </p>
        <p className="text-sm font-bold text-gray-900 mt-3">
          Rp {item.price.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={item.isAvailable}
            onChange={() => onToggleStatus(item.id)}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 relative"></div>
          <span className="text-[11px] font-medium text-gray-600">
            {item.isAvailable ? 'Aktif' : 'Habis'}
          </span>
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenEditModal(item)}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteRequest(item.id)}
            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}