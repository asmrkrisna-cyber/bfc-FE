'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { API_BASE_URL } from '@/utils/api';
import { Transaction } from '@/data/riwayatData';

import TransactionList from './components/TransactionList';
import TransactionDetail from './components/TransactionDetail';
import ReprintModal from './components/ReprintModal';
import VoidModal from './components/VoidModal';

export default function RiwayatPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxId, setSelectedTxId] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data asli dari backend Express MySQL (dengan penyesuaian shift info jika ada)
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`);
      if (res.ok) {
        const data = await res.json();

        const mappedData: Transaction[] = await Promise.all(
          data.map(async (tx: any) => {
            let itemsMapped = [];
            try {
              const resItems = await fetch(`${API_BASE_URL}/transactions/${tx.transaction_id}/items`);
              if (resItems.ok) {
                const itemsData = await resItems.json();
                itemsMapped = itemsData.map((item: any) => ({
                  name: item.product_name || item.name || 'Produk',
                  qty: item.quantity,
                  price: item.price,
                }));
              }
            } catch (err) {
              console.error('Gagal fetch items:', err);
            }

            return {
              id: tx.transaction_id,
              customerName: tx.customer_name || 'Tamu / Umum',
              tableNumber: tx.table_number || '-',
              paymentMethod: tx.payment_method || 'Cash',
              time: new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
              date: new Date(tx.created_at).toLocaleDateString('id-ID'),
              status: tx.status || 'SUKSES',
              total: tx.total || 0,
              subtotal: tx.subtotal || tx.total,
              discount: tx.discount_amount || 0,
              tax: tx.tax || 0,
              cashGiven: tx.cash_given || 0,
              change: tx.change_amount || 0,
              voidReason: tx.void_reason || '',
              items: itemsMapped,
              shiftId: tx.shift_id || null,
            } as any;
          })
        );

        setTransactions(mappedData);
        if (mappedData.length > 0 && !selectedTxId) {
          setSelectedTxId(mappedData[0].id);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data transaksi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const selectedTx = transactions.find((t) => t.id === selectedTxId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col relative">
      <Sidebar />

      <header className="p-4 border-b border-[#EBE6DF] bg-white flex items-center justify-between shadow-xs sticky top-0 z-20 pl-20">
        <div>
          <h1 className="text-lg font-bold text-[#2C221E]">Riwayat & Void Transaksi</h1>
          <p className="text-[11px] text-[#7B6E65]">Daftar transaksi pembayaran sukses serta kelola pembatalan (Void)</p>
        </div>
        <span className="px-3 py-1 bg-[#F5F2EC] text-[#7B6E65] rounded-full text-xs font-semibold border border-[#EBE6DF]">
          Total Transaksi: {transactions.length}
        </span>
      </header>

      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="flex-1 text-center py-12 text-sm text-[#7B6E65]">Memuat data dari MySQL...</div>
        ) : (
          <>
            <TransactionList
              transactions={transactions}
              selectedTxId={selectedTxId}
              onSelectTx={setSelectedTxId}
            />

            <TransactionDetail
              selectedTx={selectedTx}
              onOpenPrintModal={() => setShowPrintModal(true)}
              onOpenVoidModal={() => setShowVoidModal(true)}
            />
          </>
        )}
      </div>

      {showPrintModal && selectedTx && (
        <ReprintModal
          selectedTx={selectedTx}
          onClose={() => setShowPrintModal(false)}
          onPrint={handlePrint}
        />
      )}

      {showVoidModal && selectedTx && (
        <VoidModal
          txId={selectedTx.id}
          onClose={() => setShowVoidModal(false)}
          onSuccess={fetchTransactions}
        />
      )}
    </div>
  );
}