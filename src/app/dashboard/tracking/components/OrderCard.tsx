'use client';
import { KitchenOrder } from '@/data/trackingData';
import { ClockIcon, ChatIcon, AlertIcon } from '@/components/Icons';

interface OrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (id: string, nextStatus: KitchenOrder['status']) => void;
  onOpenCancelModal: (order: KitchenOrder) => void;
  onPickupOrder: (id: string) => void;
}

export default function OrderCard({
  order,
  onUpdateStatus,
  onOpenCancelModal,
  onPickupOrder,
}: OrderCardProps) {
  const isCashOrder =
    order.paymentMethod?.toLowerCase().includes('cash') ||
    order.paymentMethod?.toLowerCase().includes('tunai');
  const isWaitingPayment =
    order.status === 'Menunggu Bayar' ||
    (order.isLiveApp && isCashOrder && order.status === 'Baru');
  const isWaitingCash = isWaitingPayment && isCashOrder;
  const isWaitingOnline = isWaitingPayment && !isCashOrder;

  return (
    <div
      className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 relative transition-all ${
        order.isOverdue
          ? 'border-red-300 ring-1 ring-red-200'
          : isWaitingPayment
          ? 'border-amber-300 ring-1 ring-amber-200'
          : 'border-[#EBE6DF]'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-sm text-[#2C221E]">{order.id}</h3>
            {order.isLiveApp && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                • App Live
              </span>
            )}
          </div>
          <p className="text-xs text-[#2C221E] font-medium">{order.customerName}</p>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            order.isOverdue ? 'bg-red-100 text-red-700' : 'bg-[#F5F2EC] text-[#7B6E65]'
          }`}
        >
          <ClockIcon className="w-3 h-3 shrink-0" />
          <span>{order.timeAgo}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
        {isWaitingCash ? (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            BELUM BAYAR (TUNAI DI KASIR)
          </span>
        ) : isWaitingOnline ? (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-lg flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            MENUNGGU BAYAR ONLINE (MIDTRANS)
          </span>
        ) : (
          <span className="bg-[#F5F2EC] text-[#6E5545] px-2 py-0.5 rounded-lg border border-[#EBE6DF]">
            {order.paymentMethod}
          </span>
        )}
        <span className="bg-[#F5F2EC] text-[#6E5545] px-2 py-0.5 rounded-lg border border-[#EBE6DF]">
          {order.orderType} {order.tableNumber ? `- ${order.tableNumber}` : ''}
        </span>
        {order.isOverdue && (
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-lg border border-red-200 uppercase">
            TERLAMBAT
          </span>
        )}
      </div>

      <div className="border-t border-b border-[#EBE6DF] py-2.5 space-y-1.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="text-xs">
            <p className="font-bold text-[#2C221E]">
              {item.qty}× {item.name}
            </p>
            {item.variant && (
              <p className="text-[10px] text-[#7B6E65] pl-3">• {item.variant}</p>
            )}
          </div>
        ))}
      </div>

      {order.note && (
        <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#EBE6DF] text-[10px] text-[#7B6E65] flex items-center gap-1.5">
          <ChatIcon className="w-3.5 h-3.5 text-[#6E5545] shrink-0" />
          <span>{order.note}</span>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="space-y-1.5 pt-1">
        {isWaitingPayment ? (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, 'Diproses')}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                {isWaitingOnline
                  ? 'Konfirmasi Lunas Manual & Proses'
                  : 'Konfirmasi Bayar Tunai & Mulai Proses'}
              </span>
            </button>
            <button
              onClick={() => onOpenCancelModal(order)}
              className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Batalkan Pesanan</span>
            </button>
          </>
        ) : order.status === 'Baru' ? (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, 'Diproses')}
              className="w-full py-2 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Mulai Proses
            </button>
            <button
              onClick={() => onOpenCancelModal(order)}
              className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Batalkan Pesanan</span>
            </button>
          </>
        ) : null}

        {order.status === 'Diproses' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'Siap Diambil')}
            className="w-full py-2 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tandai Siap
          </button>
        )}

        {order.status === 'Siap Diambil' && (
          <button
            onClick={() => onPickupOrder(order.id)}
            className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[#2C221E] rounded-xl text-xs font-bold border border-[#EBE6DF] transition-colors cursor-pointer"
          >
            Pesanan Diambil
          </button>
        )}
      </div>
    </div>
  );
}
