'use client';

import { CashIcon, QrisIcon, ShopeeFoodIcon } from '@/components/Icons';

interface RevenueDetailCardProps {
  revenueCash: number;
  revenueQRIS: number;
  revenueShopeeFood: number;
  revenueBreakfreeHub: number;
  breakfreeHubCount?: number;
  totalTax: number;
  totalOmset: number;
  netRevenue: number;
}

export default function RevenueDetailCard({
  revenueCash,
  revenueQRIS,
  revenueShopeeFood,
  revenueBreakfreeHub,
  breakfreeHubCount = 0,
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
              <span>Cash / Tunai (POS)</span>
            </span>
            <span className="font-bold text-[#2C221E]">Rp {revenueCash.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 text-[#7B6E65]">
              <QrisIcon className="w-4 h-4 text-[#6E5545]" />
              <span>Non-Tunai / QRIS (POS)</span>
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
          <div className="flex justify-between items-center py-1.5 px-2.5 -mx-2 rounded-xl bg-[#FAF6F0] border border-[#E6DDD1]">
            <span className="flex items-center gap-2 text-[#4A372B] font-semibold">
              <svg className="w-4 h-4 text-[#6E5545]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>BreakFree Hub</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {breakfreeHubCount} order
              </span>
            </span>
            <span className="font-bold text-[#2C221E]">Rp {revenueBreakfreeHub.toLocaleString('id-ID')}</span>
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
