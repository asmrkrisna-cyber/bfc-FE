'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MenuList from '@/app/pos/MenuList';
import CartPanel from '@/app/pos/CartPanel';
import PaymentModal from '@/app/pos/PaymentModal';
import ReceiptModal from '@/app/pos/ReceiptModal';
import ShiftModal from '@/app/pos/ShiftModal';
import { SAVED_DISCOUNTS, MenuItem, CartItem, TransactionReceipt, SavedDiscount, ALL_MENU } from '@/app/pos/menuData';
import { API_BASE_URL } from '@/utils/api';

export default function POSPage() {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // State Shift & Kas Masuk Tambahan
  const [activeShiftInfo, setActiveShiftInfo] = useState<string>('Memuat shift...');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);
  const [selectedKasir, setSelectedKasir] = useState<string>('');
  const [selectedShiftType, setSelectedShiftType] = useState<string>('Shift Opening Aktif');
  const [cashInAddition, setCashInAddition] = useState<string>('');

  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(false);

  // Fetch menu dari backend Express MySQL (dengan auto-sync real-time dari Menu Management)
  const fetchProducts = async () => {
    try {
      setIsLoadingMenu(true);
      const res = await fetch(`${API_BASE_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMenuList(data);
        } else {
          setMenuList(ALL_MENU);
        }
      } else {
        setMenuList(ALL_MENU);
      }
    } catch (err) {
      console.warn('Backend API tidak merespon, memuat menu lokal:', err);
      setMenuList(ALL_MENU);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Sinkronisasi otomatis saat kasir kembali fokus ke tab POS
    const handleFocus = () => fetchProducts();
    window.addEventListener('focus', handleFocus);

    // Sinkronisasi polling berkala setiap 8 detik agar perubahan Sold Out / Edit / Tambah / Hapus di Menu Management langsung realtime berubah di POS
    const interval = setInterval(fetchProducts, 8000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const [savedDiscounts, setSavedDiscounts] = useState<SavedDiscount[]>(SAVED_DISCOUNTS);

  // Fetch diskon aktif dari database
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/discounts`);
        if (res.ok) {
          const data = await res.json();
          const activeOnly = data
            .filter((d: any) => d.isActive)
            .map((d: any) => ({
              id: d.id,
              name: `${d.name} (${d.type === 'PERCENTAGE' ? d.value + '%' : 'Rp ' + Number(d.value).toLocaleString('id-ID')})`,
              type: d.type === 'PERCENTAGE' ? 'percent' : 'fixed',
              value: Number(d.value),
            }));
          if (activeOnly.length > 0) {
            setSavedDiscounts(activeOnly);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat diskon dari API:', err);
      }
    };

    fetchDiscounts();
  }, []);

  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/shifts/active`);
        if (res.ok) {
          const data = await res.json();
          if (data.active && data.shift) {
            const rawStatus = data.shift.shift_status || 'Opening';
            const status = rawStatus.includes('Shift') ? rawStatus : `Shift ${rawStatus} Aktif`;
            const text = `• ${status} (${data.shift.cashier_name})`;
            setActiveShiftInfo(text);
            setSelectedKasir(data.shift.cashier_name);
            setSelectedShiftType(status);
            localStorage.setItem('active_shift_status', text);
            setIsShiftModalOpen(false);
            return;
          }
        }
        // Jika tidak ada shift aktif di database
        setActiveShiftInfo('• Shift Belum Aktif');
        localStorage.removeItem('active_shift_status');
        setIsShiftModalOpen(true);
      } catch (err) {
        const savedShift = localStorage.getItem('active_shift_status');
        if (savedShift) {
          setActiveShiftInfo(savedShift);
        } else {
          setIsShiftModalOpen(true);
        }
      }
    };

    checkActiveShift();

    const handleShiftUpdated = () => checkActiveShift();
    window.addEventListener('shiftUpdated', handleShiftUpdated);
    window.addEventListener('storage', handleShiftUpdated);

    return () => {
      window.removeEventListener('shiftUpdated', handleShiftUpdated);
      window.removeEventListener('storage', handleShiftUpdated);
    };
  }, []);

  // Menyimpan data Shift ke Backend Express
  const handleSaveShift = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shifts/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cashierName: selectedKasir || 'Kasir',
          shiftStatus: selectedShiftType,
          startingCash: Number(cashInAddition) || 0,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan shift ke database');
      }

      const data = await res.json();
      console.log('Shift berhasil disimpan di MySQL:', data);

      const newShiftText = `• ${selectedShiftType} (${selectedKasir})`;
      setActiveShiftInfo(newShiftText);
      localStorage.setItem('active_shift_status', newShiftText);
      window.dispatchEvent(new Event('shiftUpdated'));
      setIsShiftModalOpen(false);
    } catch (err) {
      console.error('Error simpan shift:', err);
      alert('Gagal menyimpan data shift ke database server.');
    }
  };

  const [discountMode, setDiscountMode] = useState<'preset' | 'custom'>('custom');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('fixed');
  const [discountInput, setDiscountInput] = useState<string>('');
  
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'QRIS' | 'ShopeeFood'>('Cash');
  const [cashGiven, setCashGiven] = useState<string>('');
  const [completedReceipt, setCompletedReceipt] = useState<TransactionReceipt | null>(null);

  const isShopeeFoodCart = cart.some((item: CartItem) => item.category === 'ShopeeFood');
  
  const dynamicCategories = [
    'Semua',
    ...Array.from(new Set(menuList.map((m: MenuItem) => m.category))).filter(Boolean),
  ];

  const filteredMenu = menuList.filter((item: MenuItem) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (menu: MenuItem) => {
    if (menu.isAvailable === false) {
      alert(`Menu "${menu.name}" sedang Sold Out (Habis).`);
      return;
    }

    setCart((prevCart: CartItem[]) => {
      const existing = prevCart.find((item: CartItem) => item.id === menu.id && !item.note);
      if (existing) {
        return prevCart.map((item: CartItem) =>
          item.cartItemId === existing.cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          ...menu,
          cartItemId: `${menu.id}-${Date.now()}`,
          quantity: 1,
          note: '',
        },
      ];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prevCart: CartItem[]) =>
      prevCart
        .map((item: CartItem) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const updateNote = (cartItemId: string, note: string) => {
    setCart((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) =>
        item.cartItemId === cartItemId ? { ...item, note } : item
      )
    );
  };

  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  let activeDiscountType: 'percent' | 'fixed' = discountType;
  let activeDiscountVal = 0;
  let activeDiscountName = '';
  if (subtotal > 0) {
    if (discountMode === 'preset') {
      const selectedPreset = savedDiscounts.find((d: SavedDiscount) => d.id === selectedPresetId);
      if (selectedPreset) {
        activeDiscountType = selectedPreset.type;
        activeDiscountVal = selectedPreset.value;
        activeDiscountName = selectedPreset.name;
        if (selectedPreset.type === 'percent') {
          discountAmount = Math.round((subtotal * Math.min(selectedPreset.value, 100)) / 100);
        } else {
          discountAmount = Math.min(subtotal, selectedPreset.value);
        }
      }
    } else {
      const numVal = Number(discountInput) || 0;
      activeDiscountType = discountType;
      activeDiscountVal = numVal;
      if (numVal > 0) {
        if (discountType === 'percent') {
          discountAmount = Math.round((subtotal * Math.min(numVal, 100)) / 100);
        } else {
          discountAmount = Math.min(subtotal, numVal);
        }
      }
    }
  }

  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const tax = isShopeeFoodCart ? 0 : Math.round(totalAfterDiscount * 0.1);
  const total = totalAfterDiscount + tax;
  const numericCash = Number(cashGiven) || 0;
  const changeAmount = numericCash - total;

  const handleStartProcess = () => {
    if (isShopeeFoodCart) {
      handleProcessPayment('ShopeeFood');
    } else {
      setPaymentMethod('Cash');
      setIsPaymentOpen(true);
    }
  };

  const handleProcessPayment = async (methodOverride?: 'Cash' | 'QRIS' | 'ShopeeFood' | React.MouseEvent) => {
    const finalMethod = typeof methodOverride === 'string' ? methodOverride : paymentMethod;
    const transactionId = 'TRX-' + Math.floor(100000 + Math.random() * 900000);

    const receiptData: TransactionReceipt = {
      id: transactionId,
      date: new Date().toLocaleString('id-ID'),
      customerName:
        finalMethod === 'ShopeeFood'
          ? customerName || 'Driver ShopeeFood'
          : customerName || 'Tamu / Umum',
      tableNumber: finalMethod === 'ShopeeFood' ? 'Shopee' : tableNumber || '-',
      items: [...cart],
      subtotal,
      discountType: activeDiscountType,
      discountValue: activeDiscountVal,
      discountAmount,
      discountName: activeDiscountName,
      tax,
      total,
      paymentMethod: finalMethod,
      cashGiven: finalMethod === 'Cash' ? numericCash : undefined,
      change: finalMethod === 'Cash' ? changeAmount : undefined,
      isReprint: false,
    };

    try {
      // Kirim data transaksi ke backend Express
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: receiptData.id,
          customerName: receiptData.customerName,
          tableNumber: receiptData.tableNumber,
          subtotal: receiptData.subtotal,
          discountAmount: receiptData.discountAmount,
          tax: receiptData.tax,
          total: receiptData.total,
          paymentMethod: receiptData.paymentMethod,
          cashGiven: receiptData.cashGiven || 0,
          change: receiptData.change || 0,
          items: receiptData.items,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan transaksi ke server');
      }

      setCompletedReceipt(receiptData);
      setIsPaymentOpen(false);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan transaksi ke database.');
    }
  };

  const handleReprintReceipt = () => {
    if (!completedReceipt) return;
    setCompletedReceipt({ ...completedReceipt, isReprint: true });
    window.print();
  };

  const handleResetTransaction = () => {
    setCart([]);
    setCustomerName('');
    setTableNumber('');
    setDiscountInput('');
    setSelectedPresetId('');
    setCompletedReceipt(null);
    setCashGiven('');
  };

  return (
    <div className="h-screen bg-[#FDFBF7] text-[#2C221E] flex overflow-hidden relative">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="p-4 pl-16 md:pl-20 border-b border-[#EBE6DF] bg-white flex items-center justify-between shadow-xs z-20 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-[#2C221E]">BreakFree POS</h1>
            <p className="text-[11px] text-[#7B6E65]">Malang, Indonesia • Kelola Transaksi Kasir</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-[#E6F4EA] text-[#137333] rounded-full text-xs font-semibold border border-[#CEEAD6] select-none cursor-default">
              {activeShiftInfo}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <MenuList
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredMenu={filteredMenu}
            addToCart={addToCart}
            categories={dynamicCategories}
            onRefresh={fetchProducts}
            isLoading={isLoadingMenu}
          />

          <CartPanel
            cart={cart}
            isShopeeFoodCart={isShopeeFoodCart}
            customerName={customerName}
            setCustomerName={setCustomerName}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            updateQuantity={updateQuantity}
            updateNote={updateNote}
            discountMode={discountMode}
            setDiscountMode={setDiscountMode}
            selectedPresetId={selectedPresetId}
            setSelectedPresetId={setSelectedPresetId}
            discountType={discountType}
            setDiscountType={setDiscountType}
            discountInput={discountInput}
            setDiscountInput={setDiscountInput}
            subtotal={subtotal}
            discountAmount={discountAmount}
            activeDiscountName={activeDiscountName}
            activeDiscountType={activeDiscountType}
            activeDiscountVal={activeDiscountVal}
            tax={tax}
            total={total}
            savedDiscounts={savedDiscounts}
            handleStartProcess={handleStartProcess}
          />
        </div>
      </div>

      {isShiftModalOpen && (
        <ShiftModal
          selectedShiftType={selectedShiftType}
          setSelectedShiftType={setSelectedShiftType}
          selectedKasir={selectedKasir}
          setSelectedKasir={setSelectedKasir}
          cashInAddition={cashInAddition}
          setCashInAddition={setCashInAddition}
          handleSaveShift={handleSaveShift}
        />
      )}

      {isPaymentOpen && (
        <PaymentModal
          total={total}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cashGiven={cashGiven}
          setCashGiven={setCashGiven}
          changeAmount={changeAmount}
          setIsPaymentOpen={setIsPaymentOpen}
          handleProcessPayment={handleProcessPayment}
        />
      )}

      {completedReceipt && (
        <ReceiptModal
          completedReceipt={completedReceipt}
          handleReprintReceipt={handleReprintReceipt}
          handleResetTransaction={handleResetTransaction}
        />
      )}
    </div>
  );
}