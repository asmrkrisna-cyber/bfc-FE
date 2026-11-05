'use client';

import { ShiftHistoryItem } from '@/data/rekapShiftData';

interface ShiftHistoryTableProps {
  history: ShiftHistoryItem[];
}

export default function ShiftHistoryTable({ history }: ShiftHistoryTableProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EBE6DF] shadow-xs space-y-4">
      <h2 className="text-base font-bold text-[#2C221E]">Riwayat Rekap Shift Selesai</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F9F6F0] text-[#7B6E65] font-semibold border-b border-[#EBE6DF]">
              <th className="p-3">Kategori Shift</th>
              <th className="p-3">Kasir</th>
              <th className="p-3">Waktu Mulai - Selesai</th>
              <th className="p-3 text-right">Kas Awal</th>
              <th className="p-3 text-right">Total Tunai</th>
              <th className="p-3 text-right">Total QRIS</th>
              <th className="p-3 text-right">Total ShopeeFood</th>
              <th className="p-3 text-right text-red-600">Pajak (10%)</th>
              <th className="p-3 text-right font-bold">Pendapatan Murni</th>
              <th className="p-3 text-right font-bold">Kas Fisik Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE6DF] text-[#2C221E]">
            {!history || history.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-400">
                  Belum ada riwayat shift yang ditutup.
                </td>
              </tr>
            ) : (
              history.map((item, idx) => {
                const startTime = item.start_time
                  ? new Date(item.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  : '-';
                const endTime = item.end_time
                  ? new Date(item.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  : 'Selesai';

                return (
                  <tr key={item.id || idx} className="hover:bg-[#FDFBF7]/60 transition-all">
                    <td className="p-3 font-semibold">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                        {item.shift_status || item.shiftCategory || 'CLOSED'}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{item.cashier_name || item.cashierName || 'Kasir'}</td>
                    <td className="p-3 text-gray-500">{startTime} - {endTime} WIB</td>
                    <td className="p-3 text-right">Rp {Number(item.starting_cash || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right">Rp {Number(item.total_cash || item.totalCash || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right">Rp {Number(item.total_qris || item.totalQRIS || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right">Rp {Number(item.total_shopeefood || item.totalShopeeFood || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right text-red-600">- Rp {Number(item.tax_amount || item.tax || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right font-bold">Rp {Number(item.net_revenue || item.netRevenue || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right font-bold text-amber-900">
                      Rp {Number(item.final_physical_cash || item.expected_cash || item.starting_cash || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
