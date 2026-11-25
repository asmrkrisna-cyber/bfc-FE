'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  KitchenOrder,
  getKitchenOrderActionId,
  getKitchenOrderKey,
} from '@/data/trackingData';
import { API_BASE_URL } from '@/utils/api';

import OrderCard from './components/OrderCard';
import CancelOrderModal from './components/CancelOrderModal';

export default function KitchenTrackingPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState<KitchenOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadKitchenOrders = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch(`${API_BASE_URL}/kitchen-orders`, {
        signal: controller.signal,
        cache: 'no-store',
      });

      if (!res.ok) {
        let serverMsg = `Gagal memuat pesanan dapur (HTTP ${res.status}).`;
        try {
          const errJson = await res.json();
          if (errJson?.message) serverMsg = String(errJson.message);
        } catch {
          // Abaikan bila body bukan JSON
        }
        if (isMountedRef.current) {
          setConnectionError(serverMsg);
          setIsLoading(false);
        }
        return;
      }

      const data = await res.json();
      if (isMountedRef.current) {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setConnectionError(null);
        setIsLoading(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      if (isMountedRef.current) {
        setConnectionError(
          'Tidak dapat terhubung ke server backend. Memeriksa ulang otomatis setiap 5 detik...'
        );
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const initialTimer = setTimeout(() => {
      void loadKitchenOrders();
    }, 0);
    // Auto-polling antrian dapur setiap 5 detik agar pesanan dari Kasir langsung muncul
    const interval = setInterval(() => {
      void loadKitchenOrders();
    }, 5000);

    return () => {
      isMountedRef.current = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
      abortControllerRef.current?.abort();
    };
  }, [loadKitchenOrders]);

  const newOrders = orders.filter((o) => o.status === 'Baru' || o.status === 'Menunggu Bayar');
  const processingOrders = orders.filter((o) => o.status === 'Diproses');
  const readyOrders = orders.filter((o) => o.status === 'Siap Diambil');

  const handleUpdateStatus = async (targetOrder: KitchenOrder, nextStatus: KitchenOrder['status']) => {
    const targetActionId = getKitchenOrderActionId(targetOrder);
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) =>
        getKitchenOrderActionId(o) === targetActionId ? { ...o, status: nextStatus } : o
      )
    );

    try {
      const encodedId = encodeURIComponent(targetActionId);
      const res = await fetch(`${API_BASE_URL}/kitchen-orders/${encodedId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        setConnectionError('Gagal memperbarui status pesanan dapur di server.');
      }
    } catch {
      setConnectionError('Koneksi ke server terputus saat memperbarui status pesanan.');
    } finally {
      void loadKitchenOrders();
    }
  };

  const handlePickupOrder = async (targetOrder: KitchenOrder) => {
    const targetActionId = getKitchenOrderActionId(targetOrder);
    // Optimistic UI update: hapus dari antrian aktif saat selesai diambil
    setOrders((prev) => prev.filter((o) => getKitchenOrderActionId(o) !== targetActionId));

    try {
      const encodedId = encodeURIComponent(targetActionId);
      const res = await fetch(`${API_BASE_URL}/kitchen-orders/${encodedId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Selesai' }),
      });
      if (!res.ok) {
        setConnectionError('Gagal menandai pesanan selesai di server.');
        void loadKitchenOrders();
      }
    } catch {
      setConnectionError('Koneksi ke server terputus saat menandai pesanan selesai.');
      void loadKitchenOrders();
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedCancelOrder) return;
    const targetActionId = getKitchenOrderActionId(selectedCancelOrder);
    setOrders((prev) => prev.filter((o) => getKitchenOrderActionId(o) !== targetActionId));
    setSelectedCancelOrder(null);

    try {
      const encodedId = encodeURIComponent(targetActionId);
      const res = await fetch(`${API_BASE_URL}/kitchen-orders/${encodedId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        setConnectionError('Gagal membatalkan pesanan dapur di server.');
        void loadKitchenOrders();
      }
    } catch {
      setConnectionError('Koneksi ke server terputus saat membatalkan pesanan.');
      void loadKitchenOrders();
    }
  };

  const renderOrderCard = (order: KitchenOrder, index: number) => (
    <OrderCard
      key={getKitchenOrderKey(order, index)}
      order={order}
      onUpdateStatus={(_id, nextStatus) => handleUpdateStatus(order, nextStatus)}
      onOpenCancelModal={setSelectedCancelOrder}
      onPickupOrder={() => handlePickupOrder(order)}
    />
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col relative">
      <Sidebar />

      <header className="p-4 border-b border-[#EBE6DF] bg-white flex items-center justify-between shadow-xs sticky top-0 z-20 pl-20">
        <div>
          <h1 className="text-lg font-bold text-[#2C221E]">Live Tracking Dapur</h1>
          <p className="text-[11px] text-[#7B6E65]">Monitoring pesanan Dapur real-time dari Kasir POS & Aplikasi</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-[#F5F2EC] text-[#7B6E65] rounded-full text-xs font-semibold border border-[#EBE6DF]">
            Antrian Aktif: {newOrders.length + processingOrders.length}
          </span>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
            Siap Saji: {readyOrders.length}
          </span>
        </div>
      </header>

      <main className="p-6 space-y-6 flex-1 max-w-7xl mx-auto w-full">
        {connectionError && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <span>{connectionError}</span>
            <button
              type="button"
              onClick={() => void loadKitchenOrders()}
              className="rounded-lg bg-amber-600 px-3 py-1.5 font-semibold text-white hover:bg-amber-700 transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="text-center py-12 text-sm text-[#7B6E65]">Memuat pesanan dapur dari server...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kolom 1: Pesanan Baru Masuk */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DF]">
                <h2 className="font-bold text-sm text-[#2C221E] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Pesanan Baru
                </h2>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-200">
                  {newOrders.length}
                </span>
              </div>
              <div className="space-y-3">
                {newOrders.length === 0 ? (
                  <p className="text-xs text-[#7B6E65] italic text-center py-8">Tidak ada pesanan baru</p>
                ) : (
                  newOrders.map(renderOrderCard)
                )}
              </div>
            </div>

            {/* Kolom 2: Sedang Diproses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DF]">
                <h2 className="font-bold text-sm text-[#2C221E] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Sedang Diproses
                </h2>
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                  {processingOrders.length}
                </span>
              </div>
              <div className="space-y-3">
                {processingOrders.length === 0 ? (
                  <p className="text-xs text-[#7B6E65] italic text-center py-8">Belum ada pesanan diracik</p>
                ) : (
                  processingOrders.map(renderOrderCard)
                )}
              </div>
            </div>

            {/* Kolom 3: Siap Diambil / Diantar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DF]">
                <h2 className="font-bold text-sm text-[#2C221E] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Siap Saji / Diambil
                </h2>
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                  {readyOrders.length}
                </span>
              </div>
              <div className="space-y-3">
                {readyOrders.length === 0 ? (
                  <p className="text-xs text-[#7B6E65] italic text-center py-8">Tidak ada pesanan menunggu</p>
                ) : (
                  readyOrders.map(renderOrderCard)
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Konfirmasi Pembatalan Pesanan */}
      {selectedCancelOrder && (
        <CancelOrderModal
          orderId={selectedCancelOrder.id}
          customerName={selectedCancelOrder.customerName}
          onClose={() => setSelectedCancelOrder(null)}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
    </div>
  );
}
