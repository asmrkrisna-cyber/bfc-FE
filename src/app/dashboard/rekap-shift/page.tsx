'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { API_BASE_URL } from '@/utils/api';
import OpenShiftForm from './components/OpenShiftForm';
import ShiftActiveCard from './components/ShiftActiveCard';
import RevenueDetailCard from './components/RevenueDetailCard';
import ActionCard from './components/ActionCard';
import ShiftHistoryTable from './components/ShiftHistoryTable';
import ThermalReceiptModal from './components/ThermalReceiptModal';
import CloseShiftModal from './components/CloseShiftModal';

export interface SoldItem {
  name: string;
  qty: number;
  price: number;
}

export interface ShiftRecord {
  id: string;
  shiftCategory: string;
  cashierName: string;
  timeRange: string;
  startingCash: number;
  totalCash: number;
  totalQRIS: number;
  totalShopeeFood: number;
  taxAmount: number;
  netRevenue: number;
  finalPhysicalCash: number;
}

export default function RekapShiftPage() {
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [cashierName, setCashierName] = useState<string>('Kasir');
  const [shiftCategory, setShiftCategory] = useState<string>('Opening');
  const [startTime, setStartTime] = useState<string>('');
  const [startingCash, setStartingCash] = useState<number>(0);

  const [revenueCash, setRevenueCash] = useState<number>(0);
  const [revenueQRIS, setRevenueQRIS] = useState<number>(0);
  const [revenueShopeeFood, setRevenueShopeeFood] = useState<number>(0);
  const [totalOmset, setTotalOmset] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [netRevenue, setNetRevenue] = useState<number>(0);
  const [estimatedPhysicalCash, setEstimatedPhysicalCash] = useState<number>(0);
  const [shiftId, setShiftId] = useState<number | null>(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchSummaryData();
    fetchHistoryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shifts/summary`);
      if (res.ok) {
        const data = await res.json();
        if (data.active) {
          setShiftId(data.shiftInfo.id);
          setCashierName(data.shiftInfo.cashier_name || 'Kasir');
          setShiftCategory(data.shiftInfo.shift_status || 'Opening');
          setStartingCash(Number(data.shiftInfo.starting_cash) || 0);
          
          if (data.shiftInfo.start_time) {
            const timeStr = new Date(data.shiftInfo.start_time).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            });
            setStartTime(timeStr + ' WIB');
          }

          setRevenueCash(Number(data.totalCash) || 0);
          setRevenueQRIS(Number(data.totalQRIS) || 0);
          setRevenueShopeeFood(Number(data.totalShopeeFood) || 0);
          setTotalOmset(Number(data.grandTotal) || 0);
          setTotalTax(Number(data.tax) || 0);
          setNetRevenue(Number(data.netRevenue) || 0);
          setEstimatedPhysicalCash(Number(data.expectedCashInDrawer) || 0);

          if (data.soldItems && Array.isArray(data.soldItems)) {
            const formattedItems: SoldItem[] = data.soldItems.map((item: any) => ({
              name: item.product_name,
              qty: Number(item.total_qty),
              price: Number(item.total_price) / Number(item.total_qty) || 0,
            }));
            setSoldItems(formattedItems);
          }
          setIsShiftActive(true);
        } else {
          setIsShiftActive(false);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data rekap shift:', err);
    }
  };

  const fetchHistoryData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shifts/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat shift:', err);
    }
  };

  const totalItemsSold = soldItems.reduce((sum, item) => sum + item.qty, 0);

  const handleConfirmCloseShift = async () => {
    try {
      if (shiftId) {
        await fetch(`${API_BASE_URL}/shifts/close`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shiftId }),
        });
      }

      alert('Shift berhasil ditutup!');
      localStorage.removeItem('active_shift_status');
      window.dispatchEvent(new Event('shiftUpdated'));
      setIsShiftActive(false);
      setIsCloseModalOpen(false);
      setSoldItems([]);
      fetchHistoryData();
    } catch (err) {
      console.error('Gagal menutup shift:', err);
      setIsCloseModalOpen(false);
    }
  };

  const handleStartShift = async (cashier: string, category: 'Opening' | 'Closing', cash: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/shifts/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cashierName: cashier, shiftStatus: category, startingCash: cash }),
      });
      if (res.ok) {
        const shiftStatusText = `• Shift ${category} Aktif (${cashier})`;
        localStorage.setItem('active_shift_status', shiftStatusText);
        window.dispatchEvent(new Event('shiftUpdated'));
        setCashierName(cashier);
        setShiftCategory(category);
        setStartingCash(cash);
        setRevenueCash(0);
        setRevenueQRIS(0);
        setRevenueShopeeFood(0);
        setTotalOmset(0);
        setTotalTax(0);
        setNetRevenue(0);
        setEstimatedPhysicalCash(cash);
        setSoldItems([]);
        setIsShiftActive(true);
        fetchSummaryData();
      }
    } catch (err) {
      console.error('Gagal memulai shift:', err);
    }
  };

  const handlePrintThermal = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col relative">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt-modal,
          #thermal-receipt-modal * {
            visibility: visible;
          }
          #thermal-receipt-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <Sidebar />

      <header className="p-4 border-b border-[#EBE6DF] bg-white flex items-center justify-between shadow-xs sticky top-0 z-25 pl-20 no-print">
        <div>
          <h1 className="text-lg font-bold text-[#2C221E]">Rekap Shift & Kas</h1>
          <p className="text-[11px] text-[#7B6E65]">
            Kelola Pergantian Shift Opening/Closing & Transaksi Laci Kasir
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            isShiftActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isShiftActive ? `• Shift ${shiftCategory} Aktif (${cashierName})` : '• Shift Nonaktif (Belum Buka)'}
        </span>
      </header>

      <main className="p-6 space-y-6 flex-1 pl-20 no-print">
        {!isShiftActive ? (
          <OpenShiftForm onStartShift={handleStartShift} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ShiftActiveCard
              shiftCategory={shiftCategory}
              cashierName={cashierName}
              startTime={startTime}
              startingCash={startingCash}
              estimatedPhysicalCash={estimatedPhysicalCash}
            />

            <RevenueDetailCard
              revenueCash={revenueCash}
              revenueQRIS={revenueQRIS}
              revenueShopeeFood={revenueShopeeFood}
              totalTax={totalTax}
              totalOmset={totalOmset}
              netRevenue={netRevenue}
            />

            <ActionCard
              onOpenReceipt={() => setIsReceiptOpen(true)}
              onFinishShift={() => setIsCloseModalOpen(true)}
            />
          </div>
        )}

        <ShiftHistoryTable history={history} />
      </main>

      {isReceiptOpen && (
        <ThermalReceiptModal
          shiftCategory={shiftCategory}
          cashierName={cashierName}
          startTime={startTime}
          soldItems={soldItems}
          totalItemsSold={totalItemsSold}
          revenueCash={revenueCash}
          revenueQRIS={revenueQRIS}
          revenueShopeeFood={revenueShopeeFood}
          totalTax={totalTax}
          totalOmset={totalOmset}
          netRevenue={netRevenue}
          estimatedPhysicalCash={estimatedPhysicalCash}
          onClose={() => setIsReceiptOpen(false)}
          onPrint={handlePrintThermal}
        />
      )}

      {isCloseModalOpen && (
        <CloseShiftModal
          cashierName={cashierName}
          onClose={() => setIsCloseModalOpen(false)}
          onConfirm={handleConfirmCloseShift}
        />
      )}
    </div>
  );
}