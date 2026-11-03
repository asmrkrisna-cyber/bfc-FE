'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/api';

interface MenuItem {
  name: string;
  href: string;
  icon: ReactNode;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeShiftInfo, setActiveShiftInfo] = useState('Memuat shift...');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [activeShiftName, setActiveShiftName] = useState('');
  const [showMustCloseModal, setShowMustCloseModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const fetchActiveShift = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shifts/active`);
      if (res.ok) {
        const data = await res.json();
        if (data.active && data.shift) {
          const rawStatus = data.shift.shift_status || 'Opening';
          const status = rawStatus.includes('Shift')
            ? rawStatus
            : `Shift ${rawStatus} Aktif`;
          const text = `• ${status} (${data.shift.cashier_name})`;
          setActiveShiftInfo(text);
          setIsShiftActive(true);
          setActiveShiftName(data.shift.cashier_name);
          localStorage.setItem('active_shift_status', text);
          return;
        }
      }
      setActiveShiftInfo('• Belum Ada Shift Aktif');
      setIsShiftActive(false);
      setActiveShiftName('');
      localStorage.removeItem('active_shift_status');
    } catch (err) {
      const savedShift = localStorage.getItem('active_shift_status');
      if (savedShift && !savedShift.includes('Belum Ada')) {
        setActiveShiftInfo(savedShift);
        setIsShiftActive(true);
      } else {
        setActiveShiftInfo('• Belum Ada Shift Aktif');
        setIsShiftActive(false);
      }
    }
  };

  useEffect(() => {
    fetchActiveShift();

    const handleUpdate = () => fetchActiveShift();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('shiftUpdated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('shiftUpdated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchActiveShift();
    }
  }, [isOpen]);

  // Rute menu dengan icon SVG modern
  const menuItems: MenuItem[] = [
    {
      name: 'Input Order (POS)',
      href: '/pos',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      ),
    },
    {
      name: 'Live Tracking Order',
      href: '/dashboard/tracking',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      ),
    },
    {
      name: 'Rekap Shift & Kas',
      href: '/dashboard/rekap-shift',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
    {
      name: 'Riwayat & Void Transaksi',
      href: '/dashboard/riwayat',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5-2.25-1.5L12 21l-2.75-1.5L7 21l-2.25-1.5L3 21V4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5V21l-2-1.5Z" />
        </svg>
      ),
    },
    {
      name: 'Kelola Menu & Harga',
      href: '/dashboard/menu-management',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v1.5m-8.25 10.5h16.5m-16.5 0a9 9 0 0 1 16.5 0m-16.5 0v1.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-1.5M12 6a7.5 7.5 0 0 0-7.464 6.75h14.928A7.5 7.5 0 0 0 12 6Z" />
        </svg>
      ),
    },
    {
      name: 'Kelola Diskon',
      href: '/dashboard/discounts',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      ),
    },
    {
      name: 'Pengaturan Kasir & PIN',
      href: '/dashboard/settings',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
  ];

  const handleLogoutClick = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shifts/active`);
      if (res.ok) {
        const data = await res.json();
        if (data.active && data.shift) {
          setIsShiftActive(true);
          setActiveShiftName(data.shift.cashier_name);
          setShowMustCloseModal(true);
          return;
        } else {
          setIsShiftActive(false);
          setActiveShiftInfo('• Belum Ada Shift Aktif');
          localStorage.removeItem('active_shift_status');
        }
      }
    } catch (err) {
      console.warn('Gagal cek status shift saat logout:', err);
    }

    executeLogout();
  };

  const executeLogout = () => {
    localStorage.removeItem('active_shift_status');
    localStorage.removeItem('isLoggedIn');
    window.dispatchEvent(new Event('shiftUpdated'));
    router.push('/auth/login');
  };

  return (
    <>
      {/* Tombol Hamburger Line Tiga di Kiri Atas */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-30 p-2 bg-white border border-[#EBE6DF] rounded-xl text-[#2C221E] hover:border-[#6E5545] transition-colors shadow-xs cursor-pointer"
        aria-label="Menu Navigasi"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay Backdrop Saat Sidebar Terbuka */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Drawer Navigation Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-[#EBE6DF] z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Sidebar */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#EBE6DF]">
            <div>
              <h2 className="font-bold text-lg text-[#2C221E]">Breakfree POS</h2>
              <p className="text-xs text-[#7B6E65]">Panel Navigasi Kasir</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#7B6E65] hover:text-[#2C221E] hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              aria-label="Tutup Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* List Menu Navigasi */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#6E5545] text-white shadow-xs font-bold'
                      : 'text-[#7B6E65] hover:bg-[#FDFBF7] hover:text-[#2C221E]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#8E7E73]'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar (Info Kasir & Logout) */}
        <div className="pt-4 border-t border-[#EBE6DF] space-y-3">
          <div className="p-2.5 bg-[#FDFBF7] border border-[#EBE6DF] rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-semibold text-[#2C221E]">Kasir Aktif</p>
              <p className="text-[10px] text-[#6E5545] font-medium truncate max-w-[170px]">{activeShiftInfo}</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-[#EBE6DF] text-[#6E5545] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Modal Peringatan: Wajib Tutup Shift Sebelum Log Out */}
      {showMustCloseModal && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#2C221E]">Tidak Bisa Log Out</h3>
                <p className="text-[11px] text-[#7B6E65]">Shift kasir masih aktif</p>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EBE6DF] text-xs space-y-1.5">
              <p className="text-[#2C221E] font-medium leading-relaxed">
                Kasir <span className="font-bold capitalize text-[#6E5545]">{activeShiftName || 'Aktif'}</span> masih memiliki shift yang sedang berjalan.
              </p>
              <p className="text-[11px] text-[#7B6E65] pt-1 border-t border-[#EBE6DF]">
                Harap <strong>tutup shift</strong> terlebih dahulu (perhitungan kas fisik & verifikasi PIN) di menu Rekap Shift & Kas. Setelah shift berhasil ditutup, Anda baru dapat melakukan <strong>Log Out</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowMustCloseModal(false);
                  setIsOpen(false);
                  router.push('/dashboard/rekap-shift');
                }}
                className="w-full py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                <span>Ke Halaman Rekap & Tutup Shift</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMustCloseModal(false)}
                className="w-full py-2 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
