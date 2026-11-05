'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { KitchenOrder } from '@/data/trackingData';
import { API_BASE_URL } from '@/utils/api';

import OrderCard from './components/OrderCard';
import CancelOrderModal from './components/CancelOrderModal';

export default function KitchenTrackingPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState<KitchenOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadKitchenOrders = () => {
    fetch(`${API_BASE_URL}/kitchen-orders`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setOrders(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil pesanan dapur:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadKitchenOrders();
    // Auto-polling antrian dapur setiap 5 detik agar pesanan dari Kasir langsung muncul
    const interval = setInterval(loadKitchenOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const newOrders = orders.filter((o) => o.status === 'Baru');
  const processingOrders = orders.filter((o) => o.status === 'Diproses');
  const readyOrders = orders.filter((o) => o.status === 'Siap Diambil');

  const handleUpdateStatus = async (id: string, nextStatus: KitchenOrder['status']) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );

    try {
      const encodedId = encodeURIComponent(id);
      await fetch(`${API_BASE_URL}/kitchen-orders/${encodedId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      loadKitchenOrders();
    } catch (err) {
      console.error('Gagal update status pesanan dapur:', err);
      loadKitchenOrders();
    }
  };

  const handlePickupOrder = async (id: string) => {
    // Optimistic UI update: hapus dari antrian aktif saat selesai diambil
    setOrders((prev) => prev.filter((o) => o.id !== id));

    try {
      const encodedId = encodeURIComponent(id);
      await fetch(`${API_BASE_URL}/kitchen-orders/${encodedId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Selesai' }),
      });
    } catch (err) {
      console.error('Gagal menandai pesanan selesai:', err);
      loadKitchenOrders();
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedCancelOrder) return;
    const targetId = selectedCancelOrder.id;
    setOrders((prev) => prev.filter((o) => o.id !== targetId));
    setSelectedCancelOrder(null);

    try {
      const encodedId = encodeURIComponent(targetId);
      await fetch(`${API_BASE_URL}/kitchen-orders/${encodedId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
    } catch (err) {
      console.error('Gagal membatalkan pesanan dapur:', err);
      loadKitchenOrders();
    }
  };

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
                  newOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onOpenCancelModal={setSelectedCancelOrder}
                      onPickupOrder={handlePickupOrder}
                    />
                  ))
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
                  processingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onOpenCancelModal={setSelectedCancelOrder}
                      onPickupOrder={handlePickupOrder}
                    />
                  ))
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
                  readyOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onPickupOrder={handlePickupOrder}
                      onOpenCancelModal={setSelectedCancelOrder}
                    />
                  ))
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
