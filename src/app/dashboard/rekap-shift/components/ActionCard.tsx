'use client';

import { PrinterIcon } from '@/components/Icons';

interface ActionCardProps {
  onOpenReceipt: () => void;
  onFinishShift: () => void;
}

export default function ActionCard({ onOpenReceipt, onFinishShift }: ActionCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EBE6DF] shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#2C221E]">Tutup / Oper Shift</h2>
        <p className="text-xs text-[#7B6E65]">
          Pastikan uang fisik di laci sesuai dengan rekapitulasi sistem sebelum menyelesaikan shift.
        </p>
      </div>
      <div className="space-y-2 pt-6">
        <button
          onClick={onOpenReceipt}
          className="w-full py-2.5 bg-white border border-[#EBE6DF] hover:bg-[#FAF7F2] text-[#2C221E] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <PrinterIcon className="w-4 h-4 text-[#6E5545]" />
          <span>Cetak Struk Rekap Kas</span>
        </button>
        <button
          onClick={onFinishShift}
          className="w-full py-3 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Selesaikan & Tutup Shift
        </button>
      </div>
    </div>
  );
}
