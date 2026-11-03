'use client';

import { CashIcon, QrisIcon, ShopeeFoodIcon } from '@/components/Icons';

interface RevenueDetailCardProps {
  revenueCash: number;
  revenueQRIS: number;
  revenueShopeeFood: number;
  totalTax: number;
  totalOmset: number;
  netRevenue: number;
}

export default function RevenueDetailCard({
  revenueCash,
  revenueQRIS,
  revenueShopeeFood,
  totalTax,
  totalOmset,
  netRevenue,
}: RevenueDetailCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EBE6DF] shadow-xs flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#2C221E] border-b border-[#EBE6DF] pb-2">
          Rincian Pendapatan Shift
        </h2>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 text-[#7B6E65]">
              <CashIcon className="w-4 h-4 text-[#6E5545]" />
              <span>Cash / Tunai</span>
            </span>
            <span className="font-bold text-[#2C221E]">Rp {revenueCash.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 text-[#7B6E65]">
              <QrisIcon className="w-4 h-4 text-[#6E5545]" />
              <span>Non-Tunai / QRIS</span>
            </span>
            <span className="font-bold text-[#2C221E]">Rp {revenueQRIS.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 text-[#7B6E65]">
              <ShopeeFoodIcon className="w-4 h-4 text-[#6E5545]" />
              <span>ShopeeFood</span>
            </span>
            <span className="font-bold text-[#2C221E]">Rp {revenueShopeeFood.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center py-1 text-red-600 border-t border-dashed border-[#EBE6DF] pt-2">
            <span>Pajak Resto (10% Excl. Shopee)</span>
            <span className="font-bold">- Rp {totalTax.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-[#EBE6DF]">
        <div className="flex justify-between items-center text-xs text-[#7B6E65] mb-1">
          <span>TOTAL OMSET BRUTO:</span>
          <span className="font-bold">Rp {totalOmset.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-bold text-[#6E5545]">
          <span>NETTO RESTO:</span>
          <span>Rp {netRevenue.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
}
