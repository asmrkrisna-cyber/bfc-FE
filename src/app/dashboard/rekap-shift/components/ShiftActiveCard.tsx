'use client';

interface ShiftActiveCardProps {
  shiftCategory: string;
  cashierName: string;
  startTime: string;
  startingCash: number;
  estimatedPhysicalCash: number;
}

export default function ShiftActiveCard({
  shiftCategory,
  cashierName,
  startTime,
  startingCash,
  estimatedPhysicalCash,
}: ShiftActiveCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EBE6DF] shadow-xs flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
            SHIFT {shiftCategory.toUpperCase()}
          </span>
          <span className="text-[11px] font-medium text-[#7B6E65]">
            Mulai: {startTime}
          </span>
        </div>
        <h2 className="text-base font-bold text-[#2C221E]">{cashierName}</h2>
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex justify-between text-[#7B6E65]">
            <span>Modal Kas Awal</span>
            <span className="font-bold text-[#2C221E]">
              Rp {startingCash.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-[#EBE6DF] bg-[#FDFBF7] -mx-5 -mb-5 p-5 rounded-b-2xl">
        <span className="text-[10px] uppercase font-bold text-[#7B6E65] tracking-wider block">
          ESTIMASI KAS FISIK DI LACI
        </span>
        <span className="text-xl font-bold text-[#2C221E] block mt-0.5">
          Rp {estimatedPhysicalCash.toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
}