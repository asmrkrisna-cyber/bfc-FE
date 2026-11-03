'use client';

interface EditDiscountCardProps {
  editName: string;
  setEditName: (val: string) => void;
  editCode: string;
  setEditCode: (val: string) => void;
  editType: 'percentage' | 'fixed';
  setEditType: (val: 'percentage' | 'fixed') => void;
  editValue: string;
  setEditValue: (val: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditDiscountCard({
  editName,
  setEditName,
  editCode,
  setEditCode,
  editType,
  setEditType,
  editValue,
  setEditValue,
  onCancel,
  onSave,
}: EditDiscountCardProps) {
  return (
    <div className="p-4 border-2 border-[#6E5545] bg-[#FDFBF7] rounded-xl space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-[#7B6E65] mb-1">Nama</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-[#EBE6DF] rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#7B6E65] mb-1">Kode</label>
          <input
            type="text"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-[#EBE6DF] rounded-lg text-xs uppercase"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#7B6E65] mb-1">Jenis</label>
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value as 'percentage' | 'fixed')}
            className="w-full px-3 py-1.5 bg-white border border-[#EBE6DF] rounded-lg text-xs"
          >
            <option value="percentage">Persentase (%)</option>
            <option value="fixed">Nominal Potongan (Rp)</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#7B6E65] mb-1">Nilai</label>
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-[#EBE6DF] rounded-lg text-xs"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 bg-white border border-[#EBE6DF] text-[#7B6E65] hover:bg-gray-100 rounded-lg text-xs font-semibold cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-3 py-1.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}