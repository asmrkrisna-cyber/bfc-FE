'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { DiscountItem } from '@/data/discountData';
import { API_BASE_URL } from '@/utils/api';
import DiscountCard from './components/DiscountCard';
import AddDiscountForm from './components/AddDiscountForm';

export default function DiscountPage() {
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDiscounts = () => {
    fetch(`${API_BASE_URL}/discounts`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setDiscounts(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil data diskon dari server:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    fetch(`${API_BASE_URL}/discounts`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setDiscounts(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil data diskon dari server:', err);
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleActive = async (id: string) => {
    // Optimistic UI update
    setDiscounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );

    try {
      const res = await fetch(`${API_BASE_URL}/discounts/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        loadDiscounts();
      }
    } catch (err) {
      console.error('Gagal mengubah status diskon:', err);
      loadDiscounts();
    }
  };

  const handleAddDiscount = async (formData: {
    code: string;
    name: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: string;
    minPurchase: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/discounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          name: formData.name,
          type: formData.type,
          value: Number(formData.value),
          minPurchase: Number(formData.minPurchase) || 0,
        }),
      });

      if (res.ok) {
        loadDiscounts();
        setIsModalOpen(false);
      } else {
        alert('Gagal menambahkan diskon baru.');
      }
    } catch (err) {
      console.error('Gagal menambah diskon:', err);
      alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/discounts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDiscounts((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Gagal menghapus diskon dari server.');
      }
    } catch (err) {
      console.error('Gagal menghapus diskon:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col relative">
      <Sidebar />

      <header className="p-4 border-b border-[#EBE6DF] bg-white flex items-center justify-between shadow-xs sticky top-0 z-20 pl-20">
        <div>
          <h1 className="text-lg font-bold text-[#2C221E]">Manajemen Diskon & Voucher</h1>
          <p className="text-[11px] text-[#7B6E65]">Kelola kode promo, diskon persentase, atau potongan harga langsung yang tersimpan di MySQL</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <span>+</span> Buat Diskon Baru
        </button>
      </header>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EBE6DF] shadow-xs">
            <p className="text-sm text-[#7B6E65]">Memuat data voucher & promo dari database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discounts.map((item) => (
              <DiscountCard
                key={item.id}
                item={item}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && discounts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EBE6DF] shadow-xs">
            <p className="text-sm text-[#7B6E65]">Belum ada diskon atau voucher yang terdaftar.</p>
          </div>
        )}
      </div>

      <AddDiscountForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddDiscount}
      />
    </div>
  );
}