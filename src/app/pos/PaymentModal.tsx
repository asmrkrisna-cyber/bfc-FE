import { CreditCardIcon, CloseIcon, CashIcon, QrisIcon } from '@/components/Icons';

interface PaymentModalProps {
  total: number;
  paymentMethod: 'Cash' | 'QRIS' | 'ShopeeFood';
  setPaymentMethod: (method: 'Cash' | 'QRIS' | 'ShopeeFood') => void;
  cashGiven: string;
  setCashGiven: (cash: string) => void;
  changeAmount: number;
  setIsPaymentOpen: (open: boolean) => void;
  handleProcessPayment: () => void;
}

export default function PaymentModal({
  total,
  paymentMethod,
  setPaymentMethod,
  cashGiven,
  setCashGiven,
  changeAmount,
  setIsPaymentOpen,
  handleProcessPayment,
}: PaymentModalProps) {
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
            <div className="w-36 h-36 bg-white mx-auto border border-[#EBE6DF] rounded-lg flex items-center justify-center shadow-xs">
              <span className="text-xs font-bold text-[#7B6E65]">QRIS Barcode</span>
            </div>
            <p className="text-[11px] text-[#7B6E65]">Minta pelanggan scan QRIS. Pastikan saldo masuk sebelum klik Selesai.</p>
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
            onClick={handleProcessPayment}
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
