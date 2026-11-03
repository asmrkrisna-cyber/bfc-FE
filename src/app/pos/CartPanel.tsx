import { CartItem, SAVED_DISCOUNTS, SavedDiscount } from './menuData';
import { TagIcon, NoteIcon } from '@/components/Icons';

interface CartPanelProps {
  cart: CartItem[];
  isShopeeFoodCart: boolean;
  customerName: string;
  setCustomerName: (name: string) => void;
  tableNumber: string;
  setTableNumber: (no: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateNote: (id: string, note: string) => void;
  discountMode: 'preset' | 'custom';
  setDiscountMode: (mode: 'preset' | 'custom') => void;
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  discountType: 'percent' | 'fixed';
  setDiscountType: (type: 'percent' | 'fixed') => void;
  discountInput: string;
  setDiscountInput: (val: string) => void;
  subtotal: number;
  discountAmount: number;
  activeDiscountName: string;
  activeDiscountType: string;
  activeDiscountVal: number;
  tax: number;
  total: number;
  savedDiscounts?: SavedDiscount[];
  handleStartProcess: () => void;
}

export default function CartPanel({
  cart,
  isShopeeFoodCart,
  customerName,
  setCustomerName,
  tableNumber,
  setTableNumber,
  updateQuantity,
  updateNote,
  discountMode,
  setDiscountMode,
  selectedPresetId,
  setSelectedPresetId,
  discountType,
  setDiscountType,
  discountInput,
  setDiscountInput,
  subtotal,
  discountAmount,
  activeDiscountName,
  activeDiscountType,
  activeDiscountVal,
  tax,
  total,
  savedDiscounts,
  handleStartProcess,
}: CartPanelProps) {
  return (
    <aside className="w-full lg:w-96 bg-white border-l border-[#EBE6DF] flex flex-col h-full shadow-xs shrink-0">
      <div className="p-4 border-b border-[#EBE6DF] space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#2C221E]">Keranjang Pesanan</h2>
          {isShopeeFoodCart && (
            <span className="text-[10px] font-bold bg-[#F5F2EC] text-[#6E5545] px-2.5 py-0.5 rounded-full border border-[#EBE6DF]">
              ShopeeFood Order
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 bg-[#FDFBF7] p-2 rounded-xl border border-[#EBE6DF]">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-[#7B6E65] mb-1">
              {isShopeeFoodCart ? 'Nama Driver / Order ID' : 'Nama Pelanggan'}
            </label>
            <input
              type="text"
              placeholder={isShopeeFoodCart ? 'Contoh: Driver Budi' : 'Nama'}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-2.5 py-1 bg-white border border-[#EBE6DF] rounded-lg text-xs text-[#2C221E] focus:outline-none focus:border-[#6E5545]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#7B6E65] mb-1">No. Meja</label>
            <input
              type="text"
              disabled={isShopeeFoodCart}
              placeholder={isShopeeFoodCart ? 'Shopee' : '01'}
              value={isShopeeFoodCart ? 'Shopee' : tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className={`w-full px-2 py-1 border rounded-lg text-xs text-center focus:outline-none ${
                isShopeeFoodCart
                  ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-[#2C221E] border-[#EBE6DF] focus:border-[#6E5545]'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#7B6E65]">Belum ada menu dipilih</div>
        ) : (
          cart.map((item: CartItem) => (
            <div key={item.cartItemId} className="p-3 border rounded-xl text-xs space-y-2 bg-[#FDFBF7] border-[#EBE6DF]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C221E]">{item.name}</p>
                  <p className="text-[10px] text-[#7B6E65]">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-6 h-6 flex items-center justify-center bg-white border border-[#EBE6DF] rounded-lg text-xs font-bold hover:bg-gray-100 cursor-pointer">-</button>
                  <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-[#EBE6DF] rounded-lg text-xs font-bold hover:bg-gray-100 cursor-pointer">+</button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Catatan pesanan..."
                  value={item.note || ''}
                  onChange={(e) => updateNote(item.cartItemId, e.target.value)}
                  className="w-full pl-7 pr-2.5 py-1 bg-white border border-[#EBE6DF] rounded-lg text-[11px] text-[#2C221E] placeholder:text-[#A89F91] focus:outline-none focus:border-[#6E5545]"
                />
                <NoteIcon className="w-3.5 h-3.5 text-[#A89F91] absolute left-2 top-1.5 pointer-events-none" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-[#EBE6DF] space-y-3 bg-white shrink-0">
        <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#EBE6DF] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#7B6E65] flex items-center gap-1.5">
              <TagIcon className="w-3.5 h-3.5 text-[#6E5545]" />
              <span>Mode Diskon</span>
            </label>
            <div className="flex bg-[#F5F2EC] p-0.5 rounded-lg border border-[#EBE6DF]">
              <button
                type="button"
                onClick={() => { setDiscountMode('preset'); setDiscountInput(''); }}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${discountMode === 'preset' ? 'bg-[#6E5545] text-white' : 'text-[#7B6E65]'}`}
              >
                Tersimpan
              </button>
              <button
                type="button"
                onClick={() => { setDiscountMode('custom'); setSelectedPresetId(''); }}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${discountMode === 'custom' ? 'bg-[#6E5545] text-white' : 'text-[#7B6E65]'}`}
              >
                Custom
              </button>
            </div>
          </div>
          {discountMode === 'preset' && (
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] focus:outline-none focus:border-[#6E5545]"
            >
              <option value="">-- Pilih Diskon Tersimpan --</option>
              {(savedDiscounts && savedDiscounts.length > 0 ? savedDiscounts : SAVED_DISCOUNTS).map((disc) => (
                <option key={disc.id} value={disc.id}>{disc.name}</option>
              ))}
            </select>
          )}
          {discountMode === 'custom' && (
            <div className="flex items-center gap-1.5">
              <div className="flex bg-[#F5F2EC] rounded-xl p-1 border border-[#EBE6DF]">
                <button type="button" onClick={() => setDiscountType('fixed')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${discountType === 'fixed' ? 'bg-[#6E5545] text-white' : 'text-[#7B6E65]'}`}>Rp</button>
                <button type="button" onClick={() => setDiscountType('percent')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${discountType === 'percent' ? 'bg-[#6E5545] text-white' : 'text-[#7B6E65]'}`}>%</button>
              </div>
              <input
                type="number"
                placeholder={discountType === 'percent' ? 'Contoh: 10' : 'Contoh: 5000'}
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545]"
              />
            </div>
          )}
        </div>
        <div className="flex justify-between text-xs text-[#7B6E65]">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-xs text-red-600 font-bold">
            <span>Diskon {discountMode === 'preset' ? `(${activeDiscountName})` : activeDiscountType === 'percent' ? `(${activeDiscountVal}%)` : '(Potongan Direct)'}</span>
            <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-[#7B6E65]">
          <span>Pajak (10%){isShopeeFoodCart ? ' - Bebas Pajak' : ''}</span>
          <span>Rp {tax.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-[#2C221E] pt-2 border-t border-[#EBE6DF]">
          <span>Total Akhir</span>
          <span>Rp {total.toLocaleString('id-ID')}</span>
        </div>
        <button
          disabled={cart.length === 0}
          onClick={handleStartProcess}
          className={`w-full py-3 rounded-xl text-xs font-bold transition-colors ${cart.length > 0 ? 'bg-[#6E5545] hover:bg-[#584336] text-white cursor-pointer' : 'bg-[#EBE6DF] text-[#7B6E65] cursor-not-allowed'}`}
        >
          {isShopeeFoodCart ? 'Cetak Resi ShopeeFood' : 'Proses Pembayaran'}
        </button>
      </div>
    </aside>
  );
}
