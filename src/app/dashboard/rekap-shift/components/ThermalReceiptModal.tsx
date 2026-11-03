'use client';

import { PackageIcon, MoneyBagIcon, PrinterIcon } from '@/components/Icons';

interface ThermalReceiptModalProps {
  shiftCategory: string;
  cashierName: string;
  startTime: string;
  soldItems: { name: string; qty: number; price: number }[];
  totalItemsSold: number;
  revenueCash: number;
  revenueQRIS: number;
  revenueShopeeFood: number;
  totalTax: number;
  totalOmset: number;
  netRevenue: number;
  estimatedPhysicalCash: number;
  onClose: () => void;
  onPrint: () => void;
}

export default function ThermalReceiptModal({
  shiftCategory,
  cashierName,
  startTime,
  soldItems,
  totalItemsSold,
  revenueCash,
  revenueQRIS,
  revenueShopeeFood,
  totalTax,
  totalOmset,
  netRevenue,
  estimatedPhysicalCash,
  onClose,
  onPrint,
}: ThermalReceiptModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print-bg">
      <div
        id="thermal-receipt-modal"
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF] text-[#2C221E] print-receipt-area"
      >
        <div className="text-center space-y-1 border-b border-dashed border-[#EBE6DF] pb-4">
          <h3 className="font-bold text-sm">BREAKFREE COFFEE</h3>
          <p className="text-[10px] text-[#7B6E65]">LAPORAN PENJUALAN SHIFT ({shiftCategory.toUpperCase()})</p>
          <p className="text-[10px] text-[#7B6E65]">
            Kasir: {cashierName} • {startTime}
          </p>
        </div>

        <div className="space-y-2 border-b border-dashed border-[#EBE6DF] pb-3">
          <p className="text-[11px] font-bold text-[#6E5545] uppercase tracking-wider flex items-center gap-1.5">
            <PackageIcon className="w-3.5 h-3.5 text-[#6E5545]" />
            <span>Rincian Item Terjual ({totalItemsSold} pcs)</span>
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
            {soldItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-[10px] text-[#7B6E65]">
                    {item.qty} x Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <span className="font-bold">
                  Rp {(item.qty * item.price).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs space-y-1.5 border-b border-dashed border-[#EBE6DF] pb-3 text-[#7B6E65]">
          <p className="text-[11px] font-bold text-[#6E5545] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MoneyBagIcon className="w-3.5 h-3.5 text-[#6E5545]" />
            <span>Rekapitulasi Kas</span>
          </p>
          <div className="flex justify-between">
            <span>Tunai (Cash)</span>
            <span className="font-bold text-[#2C221E]">Rp {revenueCash.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>QRIS</span>
            <span className="font-bold text-[#2C221E]">Rp {revenueQRIS.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>ShopeeFood</span>
            <span className="font-bold text-[#2C221E]">Rp {revenueShopeeFood.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-red-600 font-medium pt-1 border-t border-dashed border-[#EBE6DF]">
            <span>Pajak (10%)</span>
            <span>- Rp {totalTax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-bold text-[#2C221E] pt-1">
            <span>Total Omset Bruto</span>
            <span>Rp {totalOmset.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-bold text-[#6E5545] text-sm pt-0.5">
            <span>Pendapatan Murni</span>
            <span>Rp {netRevenue.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#EBE6DF] text-xs space-y-1">
          <div className="flex justify-between font-bold text-[#2C221E]">
            <span>Estimasi Kas Fisik Laci:</span>
            <span>Rp {estimatedPhysicalCash.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2 no-print">
          <button
            onClick={onPrint}
            className="w-full py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <PrinterIcon className="w-4 h-4 text-white" />
            <span>Print Struk Thermal (Kertas Kasir)</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
