'use client';
import { useState, useEffect, useRef } from 'react';
import { CreditCardIcon, CloseIcon, CashIcon, QrisIcon } from '@/components/Icons';
import { API_BASE_URL } from '@/utils/api';
import { CartItem } from '@/app/pos/menuData';

interface PaymentModalProps {
  total: number;
  cart?: CartItem[];
  customerName?: string;
  paymentMethod: 'Cash' | 'QRIS' | 'ShopeeFood';
  setPaymentMethod: (method: 'Cash' | 'QRIS' | 'ShopeeFood') => void;
  cashGiven: string;
  setCashGiven: (cash: string) => void;
  changeAmount: number;
  setIsPaymentOpen: (open: boolean) => void;
  handleProcessPayment: (methodOverride?: 'Cash' | 'QRIS' | 'ShopeeFood') => void;
}

export default function PaymentModal({
  total,
  cart = [],
  customerName = '',
  paymentMethod,
  setPaymentMethod,
  cashGiven,
  setCashGiven,
  changeAmount,
  setIsPaymentOpen,
  handleProcessPayment,
}: PaymentModalProps) {
  const [midtransOrderId, setMidtransOrderId] = useState<string | null>(null);
  const [snapUrl, setSnapUrl] = useState<string | null>(null);
  const [midtransLoading, setMidtransLoading] = useState(false);
  const [midtransMessage, setMidtransMessage] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settledRef = useRef(false);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const checkMidtransStatus = async (targetId: string, silent = false) => {
    if (settledRef.current) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/payments/midtrans/status/${encodeURIComponent(targetId)}`
      );
      const data = await res.json();
      if (data.isPaid) {
        settledRef.current = true;
        if (pollingRef.current) clearInterval(pollingRef.current);
        setMidtransMessage('Pembayaran Midtrans lunas! Menyimpan transaksi...');
        handleProcessPayment('QRIS');
      } else if (data.isFailed) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setMidtransMessage(data.message || 'Pembayaran Midtrans dibatalkan/kedaluwarsa.');
      } else if (!silent) {
        setMidtransMessage(
          data.message || 'Status masih pending. Selesaikan pembayaran di halaman Midtrans.'
        );
      }
    } catch {
      if (!silent) {
        setMidtransMessage('Gagal mengecek status pembayaran ke server.');
      }
    }
  };

  const handleGenerateMidtransSnap = async () => {
    setMidtransLoading(true);
    setMidtransMessage(null);
    settledRef.current = false;
    try {
      const posOrderId = `#POS-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch(`${API_BASE_URL}/payments/midtrans/snap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: posOrderId,
          grossAmount: total,
          customerName: customerName || 'Pelanggan POS',
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.redirectUrl) {
        throw new Error(data.message || 'Gagal membuat link Midtrans.');
      }

      const trackingId = data.midtransOrderId || posOrderId;
      setMidtransOrderId(trackingId);
      setSnapUrl(data.redirectUrl);
      setMidtransMessage('Link Midtrans siap. Menunggu pembayaran pelanggan...');

      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(() => {
        checkMidtransStatus(trackingId, true);
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung ke Midtrans.';
      setMidtransMessage(msg);
    } finally {
      setMidtransLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-[#EBE6DF]">
        <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3">
          <h3 className="font-bold text-sm text-[#2C221E] flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4 text-[#6E5545]" />
            Pilih Metode Pembayaran
          </h3>
          <button
            onClick={() => setIsPaymentOpen(false)}
            className="text-[#7B6E65] hover:text-[#2C221E] p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE6DF] space-y-1">
          <p className="text-xs text-[#7B6E65]">Total Tagihan</p>
          <p className="text-xl font-bold text-[#6E5545]">Rp {total.toLocaleString('id-ID')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('Cash')}
            className={`py-3 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              paymentMethod === 'Cash' ? 'bg-[#6E5545] text-white border-[#6E5545]' : 'bg-white text-[#7B6E65] border-[#EBE6DF]'
            }`}
          >
            <CashIcon className="w-4 h-4" /> Cash (Tunai)
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('QRIS')}
            className={`py-3 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              paymentMethod === 'QRIS' ? 'bg-[#6E5545] text-white border-[#6E5545]' : 'bg-white text-[#7B6E65] border-[#EBE6DF]'
            }`}
          >
            <QrisIcon className="w-4 h-4" /> QRIS (E-Wallet)
          </button>
        </div>
        {paymentMethod === 'Cash' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#7B6E65] mb-1">Uang Diterima dari Pelanggan</label>
              <input
                type="number"
                placeholder="Contoh: 60000"
                value={cashGiven}
                onChange={(e) => setCashGiven(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545]"
              />
            </div>
            <div className="p-3 bg-[#F5F2EC] rounded-xl flex justify-between items-center text-xs">
              <span className="font-bold text-[#7B6E65]">Uang Kembalian:</span>
              <span className={`font-bold ${changeAmount >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {changeAmount >= 0 ? `Rp ${changeAmount.toLocaleString('id-ID')}` : 'Uang Kurang'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#FDFBF7] border border-[#EBE6DF] rounded-xl text-center space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#2C221E]">Pembayaran Online Midtrans (QRIS / E-Wallet / VA)</p>
              {!snapUrl ? (
                <button
                  type="button"
                  disabled={midtransLoading || total < 100}
                  onClick={handleGenerateMidtransSnap}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {midtransLoading ? 'Membuat Tagihan Midtrans...' : 'Buat Link Bayar Midtrans Sandbox'}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-medium">
                    Order ID Midtrans: <span className="font-bold">{midtransOrderId}</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={snapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors text-center"
                    >
                      Buka Halaman Midtrans
                    </a>
                    <button
                      type="button"
                      onClick={() => midtransOrderId && checkMidtransStatus(midtransOrderId, false)}
                      className="px-3 py-2 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cek Status
                    </button>
                  </div>
                </div>
              )}
              {midtransMessage && (
                <p className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                  {midtransMessage}
                </p>
              )}
            </div>
            <p className="text-[11px] text-[#7B6E65] pt-1 border-t border-[#EBE6DF]">
              Atau gunakan EDC QRIS kasir lalu klik <span className="font-bold">Selesai &amp; Cetak Resi</span> di bawah.
            </p>
          </div>
        )}
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsPaymentOpen(false)}
            className="px-4 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={paymentMethod === 'Cash' && changeAmount < 0}
            onClick={() => handleProcessPayment()}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors ${
              paymentMethod === 'Cash' && changeAmount < 0
                ? 'bg-[#EBE6DF] text-[#7B6E65] cursor-not-allowed'
                : 'bg-[#6E5545] hover:bg-[#584336] cursor-pointer'
            }`}
          >
            Selesai & Cetak Resi
          </button>
        </div>
      </div>
    </div>
  );
}
