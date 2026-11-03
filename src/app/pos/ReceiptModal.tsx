import { TransactionReceipt } from './menuData';
import { AlertIcon, PrinterIcon } from '@/components/Icons';

interface ReceiptModalProps {
  completedReceipt: TransactionReceipt;
  handleReprintReceipt: () => void;
  handleResetTransaction: () => void;
}

export default function ReceiptModal({
  completedReceipt,
  handleReprintReceipt,
  handleResetTransaction,
}: ReceiptModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF] print-receipt-area">
        {completedReceipt.paymentMethod === 'ShopeeFood' && (
          <div className="bg-[#F5F2EC] border border-[#EBE6DF] text-[#6E5545] text-[10px] font-bold text-center py-1.5 rounded-lg uppercase tracking-wider">
            RESI ORDER - SHOPEEFOOD
          </div>
        )}
        {completedReceipt.isReprint && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold text-center py-1 rounded-lg uppercase tracking-wider flex items-center justify-center gap-1.5">
            <AlertIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>DUPLIKAT / CHECKER DARI SYSTEM</span>
          </div>
        )}
        <div className="text-center space-y-1 border-b border-dashed border-[#EBE6DF] pb-4">
          <h3 className="font-bold text-sm text-[#2C221E]">BREAKFREE COFFEE</h3>
          <p className="text-[10px] text-[#7B6E65]">Malang, Indonesia</p>
          <p className="text-[10px] text-[#7B6E65]">{completedReceipt.date}</p>
        </div>
        
        <div className="text-[11px] text-[#7B6E65] space-y-0.5 border-b border-dashed border-[#EBE6DF] pb-3">
          <p><span className="font-bold text-[#2C221E]">No. Transaksi:</span> {completedReceipt.id}</p>
          <p><span className="font-bold text-[#2C221E]">Pelanggan:</span> {completedReceipt.customerName}</p>
          <p><span className="font-bold text-[#2C221E]">No. Meja:</span> <span className="font-bold text-[#6E5545]">{completedReceipt.tableNumber}</span></p>
          <p><span className="font-bold text-[#2C221E]">Metode Bayar:</span> <span className="font-bold text-[#6E5545]">{completedReceipt.paymentMethod}</span></p>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto text-xs border-b border-dashed border-[#EBE6DF] pb-3">
          {completedReceipt.items.map((item) => (
            <div key={item.cartItemId} className="space-y-0.5">
              <div className="flex justify-between font-medium">
                <span>{item.name} x{item.quantity}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
              {item.note && (
                <p className="text-[10px] text-[#7B6E65] bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#EBE6DF] font-medium italic">
                  Catatan: {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-xs space-y-1 text-[#7B6E65] border-b border-dashed border-[#EBE6DF] pb-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {completedReceipt.subtotal.toLocaleString('id-ID')}</span>
          </div>
          {completedReceipt.discountAmount > 0 && (
            <div className="flex justify-between text-red-600 font-medium">
              <span>Diskon {completedReceipt.discountName ? `(${completedReceipt.discountName})` : ''}</span>
              <span>- Rp {completedReceipt.discountAmount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Pajak ({completedReceipt.paymentMethod === 'ShopeeFood' ? '0%' : '10%'})</span>
            <span>Rp {completedReceipt.tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#2C221E] pt-1">
            <span>Total Omset</span>
            <span>Rp {completedReceipt.total.toLocaleString('id-ID')}</span>
          </div>
          {completedReceipt.paymentMethod === 'Cash' && (
            <>
              <div className="flex justify-between pt-1">
                <span>Tunai</span>
                <span>Rp {(completedReceipt.cashGiven || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Kembalian</span>
                <span>Rp {(completedReceipt.change || 0).toLocaleString('id-ID')}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-2 pt-1 no-print">
          <button
            onClick={handleReprintReceipt}
            className="w-full py-2 bg-[#F5F2EC] hover:bg-[#EBE6DF] text-[#2C221E] rounded-xl text-xs font-bold border border-[#EBE6DF] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>Cetak Checker / Struk Ulang</span>
          </button>
          <button
            onClick={handleResetTransaction}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer bg-[#6E5545] hover:bg-[#584336]"
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
}
