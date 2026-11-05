'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { API_BASE_URL } from '@/utils/api';
import { KeyIcon, TrashIcon, CloseIcon, LockIcon, AlertIcon, EyeIcon, EyeOffIcon } from '@/components/Icons';

interface CashierItem {
  id: number;
  name: string;
  is_active: number;
  created_at: string;
}

export default function SettingsPage() {
  const [cashiers, setCashiers] = useState<CashierItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetPinModalOpen, setIsResetPinModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCashier, setSelectedCashier] = useState<CashierItem | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [resetPin, setResetPin] = useState('');
  const [confirmResetPin, setConfirmResetPin] = useState('');

  // Delete states with PIN verification
  const [deletePin, setDeletePin] = useState('');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePin, setShowDeletePin] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const loadCashiers = () => {
    fetch(`${API_BASE_URL}/cashiers`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setCashiers(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil daftar kasir:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    fetch(`${API_BASE_URL}/cashiers`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setCashiers(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil daftar kasir:', err);
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenAddModal = () => {
    setNewName('');
    setNewPin('');
    setConfirmPin('');
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const handleOpenResetPinModal = (cashier: CashierItem) => {
    setSelectedCashier(cashier);
    setResetPin('');
    setConfirmResetPin('');
    setErrorMsg('');
    setIsResetPinModalOpen(true);
  };

  const handleOpenDeleteModal = (cashier: CashierItem) => {
    setSelectedCashier(cashier);
    setDeletePin('');
    setDeleteErrorMsg('');
    setIsDeleting(false);
    setShowDeletePin(false);
    setIsDeleteModalOpen(true);
  };

  // Submit Tambah Kasir
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newName.trim()) {
      setErrorMsg('Nama kasir wajib diisi');
      return;
    }

    if (newPin.length < 4) {
      setErrorMsg('PIN minimal harus 4 digit angka');
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg('Konfirmasi PIN tidak cocok');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cashiers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          pin: newPin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan kasir');
      }

      loadCashiers();
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server';
      setErrorMsg(message);
    }
  };

  // Submit Ubah PIN
  const handleSubmitResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCashier) return;
    setErrorMsg('');

    if (resetPin.length < 4) {
      setErrorMsg('PIN baru minimal harus 4 digit angka');
      return;
    }

    if (resetPin !== confirmResetPin) {
      setErrorMsg('Konfirmasi PIN baru tidak cocok');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cashiers/${selectedCashier.id}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPin: resetPin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengubah PIN kasir');
      }

      alert(`PIN kasir "${selectedCashier.name}" berhasil diperbarui!`);
      setIsResetPinModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server';
      setErrorMsg(message);
    }
  };

  // Submit Hapus Kasir (Wajib Masukkan PIN Verifikasi)
  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCashier) return;
    setDeleteErrorMsg('');

    if (!deletePin || deletePin.trim().length < 4) {
      setDeleteErrorMsg('Masukkan minimal 4 digit PIN verifikasi kasir.');
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch(`${API_BASE_URL}/cashiers/${selectedCashier.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: deletePin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus kasir');
      }

      alert(`Kasir "${selectedCashier.name}" berhasil dihapus.`);
      loadCashiers();
      setIsDeleteModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus kasir';
      setDeleteErrorMsg(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col relative">
      <Sidebar />

      <header className="p-4 border-b border-[#EBE6DF] bg-white flex items-center justify-between shadow-xs sticky top-0 z-20 pl-20">
        <div>
          <h1 className="text-lg font-bold text-[#2C221E]">Pengaturan Kasir & Keamanan PIN</h1>
          <p className="text-[11px] text-[#7B6E65]">
            Kelola nama kasir dan atur PIN masing-masing untuk otentikasi Buka & Tutup Shift
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <span>+</span> Tambah Kasir Baru
        </button>
      </header>

      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EBE6DF]">
            <div>
              <h2 className="font-bold text-sm text-[#2C221E]">Daftar Kasir Terdaftar</h2>
              <p className="text-xs text-[#7B6E65]">Setiap kasir memiliki PIN unik untuk validasi tanggung jawab shift</p>
            </div>
            <span className="px-3 py-1 bg-[#F5F2EC] text-[#7B6E65] rounded-full text-xs font-bold border border-[#EBE6DF]">
              Total: {cashiers.length} Kasir
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-xs text-[#7B6E65]">
              Memuat data kasir dari database...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cashiers.map((cashier) => (
                <div
                  key={cashier.id}
                  className="bg-[#FDFBF7] border border-[#EBE6DF] rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-[#6E5545] transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#6E5545] text-white font-bold text-xs flex items-center justify-center uppercase">
                          {cashier.name.slice(0, 2)}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm text-[#2C221E] capitalize">
                            {cashier.name}
                          </h3>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                            Kasir Aktif
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7B6E65] space-y-0.5 border-t border-[#EBE6DF] pt-2">
                    <p>
                      <span className="font-semibold text-[#2C221E]">PIN Keamanan:</span> •••• (Tersimpan aman)
                    </p>
                    <p>
                      <span className="font-semibold text-[#2C221E]">Terdaftar:</span>{' '}
                      {new Date(cashier.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#EBE6DF]">
                    <button
                      onClick={() => handleOpenResetPinModal(cashier)}
                      className="flex-1 py-2 bg-white hover:bg-gray-100 text-[#2C221E] border border-[#EBE6DF] rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <KeyIcon className="w-3.5 h-3.5 text-[#6E5545]" />
                      <span>Ubah PIN</span>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(cashier)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                      title="Hapus kasir ini"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && cashiers.length === 0 && (
            <div className="text-center py-16 text-xs text-[#7B6E65]">
              Belum ada kasir yang terdaftar. Silakan klik tombol &quot;+ Tambah Kasir Baru&quot;.
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Tambah Kasir Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3">
              <h3 className="font-bold text-sm text-[#2C221E]">Tambah Kasir Baru</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#7B6E65] hover:text-[#2C221E] p-1 rounded-lg cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitAdd} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#7B6E65] mb-1">
                  Nama Kasir:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: dimas / rara"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7B6E65] mb-1">
                  PIN Shift (4–6 Angka):
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] tracking-widest font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7B6E65] mb-1">
                  Konfirmasi PIN:
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] tracking-widest font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Simpan Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Ubah / Reset PIN */}
      {isResetPinModalOpen && selectedCashier && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3">
              <h3 className="font-bold text-sm text-[#2C221E]">
                Ubah PIN Kasir: <span className="capitalize text-[#6E5545]">{selectedCashier.name}</span>
              </h3>
              <button
                onClick={() => setIsResetPinModalOpen(false)}
                className="text-[#7B6E65] hover:text-[#2C221E] p-1 rounded-lg cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitResetPin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#7B6E65] mb-1">
                  PIN Baru (4–6 Angka):
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••"
                  value={resetPin}
                  onChange={(e) => setResetPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] tracking-widest font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7B6E65] mb-1">
                  Konfirmasi PIN Baru:
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••"
                  value={confirmResetPin}
                  onChange={(e) => setConfirmResetPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] tracking-widest font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetPinModalOpen(false)}
                  className="flex-1 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Perbarui PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Konfirmasi Hapus Kasir dengan Verifikasi PIN Keamanan */}
      {isDeleteModalOpen && selectedCashier && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
            <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                  <LockIcon className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#2C221E]">Verifikasi PIN Hapus Kasir</h3>
                  <p className="text-[10px] text-[#7B6E65]">Keamanan otorisasi kasir</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-[#7B6E65] hover:text-[#2C221E] p-1 rounded-lg cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-red-50/70 border border-red-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#6E5545] text-white font-bold text-xs flex items-center justify-center uppercase shrink-0">
                  {selectedCashier.name.slice(0, 2)}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#2C221E] capitalize">{selectedCashier.name}</h4>
                  <p className="text-[10px] text-red-700 font-medium">Akun kasir akan dihapus permanen</p>
                </div>
              </div>
              <p className="text-[11px] text-[#7B6E65] leading-relaxed">
                Untuk keamanan, masukkan <strong>PIN Keamanan</strong> yang dibuat saat awal pendaftaran kasir ini untuk memverifikasi penghapusan.
              </p>
            </div>

            {deleteErrorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertIcon className="w-4 h-4 text-red-500 shrink-0" />
                <span>{deleteErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDelete} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#7B6E65] mb-1.5">
                  Masukkan PIN Kasir (4–6 Angka):
                </label>
                <div className="relative">
                  <input
                    type={showDeletePin ? 'text' : 'password'}
                    maxLength={6}
                    autoFocus
                    required
                    inputMode="numeric"
                    placeholder="••••"
                    value={deletePin}
                    onChange={(e) => {
                      setDeletePin(e.target.value.replace(/\D/g, ''));
                      if (deleteErrorMsg) setDeleteErrorMsg('');
                    }}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-center text-sm text-[#2C221E] outline-none focus:border-red-500 tracking-[0.3em] font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePin(!showDeletePin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7B6E65] hover:text-[#2C221E] cursor-pointer p-1"
                    title={showDeletePin ? 'Sembunyikan PIN' : 'Lihat PIN'}
                  >
                    {showDeletePin ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={deletePin.length < 4 || isDeleting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>Verifikasi & Hapus</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
