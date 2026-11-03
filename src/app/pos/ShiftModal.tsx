'use client';

import { useState, useEffect, useActionState } from 'react';
import { API_BASE_URL } from '@/utils/api';
import { verifyPinAction, ActionResponse } from '@/actions/shift.action';
import { ClockIcon, AlertIcon, SpinnerIcon } from '@/components/Icons';

interface CashierOption {
  id: number;
  name: string;
}

interface ShiftModalProps {
  selectedShiftType: string;
  setSelectedShiftType: (type: string) => void;
  selectedKasir: string;
  setSelectedKasir: (name: string) => void;
  cashInAddition: string;
  setCashInAddition: (val: string) => void;
  handleSaveShift: () => void;
}

export default function ShiftModal({
  selectedShiftType,
  setSelectedShiftType,
  selectedKasir,
  setSelectedKasir,
  cashInAddition,
  setCashInAddition,
  handleSaveShift,
}: ShiftModalProps) {
  const [cashierList, setCashierList] = useState<CashierOption[]>([]);
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    verifyPinAction,
    null
  );

  useEffect(() => {
    const fetchCashiers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cashiers`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCashierList(data);
            if (!selectedKasir || !data.some((c: CashierOption) => c.name.toLowerCase() === selectedKasir.toLowerCase())) {
              setSelectedKasir(data[0].name);
            }
          }
        }
      } catch (err) {
        console.warn('Gagal memuat kasir dari API:', err);
      }
    };

    fetchCashiers();
  }, [selectedKasir, setSelectedKasir]);

  useEffect(() => {
    if (state?.success) {
      handleSaveShift();
    }
  }, [state, handleSaveShift]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
        <div className="text-center space-y-1 border-b border-dashed border-[#EBE6DF] pb-3">
          <h3 className="font-bold text-sm text-[#2C221E] flex items-center justify-center gap-1.5">
            <ClockIcon className="w-4 h-4 text-[#6E5545]" />
            Buka Shift & Verifikasi PIN
          </h3>
          <p className="text-[11px] text-[#7B6E65]">
            Pilih shift dan masukkan PIN kasir sebagai tanda tanggung jawab shift
          </p>
        </div>

        {state?.message && !state.success && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-medium animate-shake flex items-center justify-center gap-1.5">
            <AlertIcon className="w-4 h-4 text-red-600 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <form action={formAction} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#7B6E65] mb-1">Status Shift</label>
            <select
              name="category"
              value={selectedShiftType}
              onChange={(e) => setSelectedShiftType(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] focus:outline-none focus:border-[#6E5545] disabled:opacity-50"
            >
              <option value="Shift Opening Aktif">Shift Opening Aktif</option>
              <option value="Shift Closing Aktif">Shift Closing Aktif</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#7B6E65] mb-1">Nama Kasir</label>
            {cashierList.length > 0 ? (
              <select
                name="cashierName"
                value={selectedKasir}
                onChange={(e) => setSelectedKasir(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] focus:outline-none focus:border-[#6E5545] capitalize disabled:opacity-50"
              >
                {cashierList.map((cashier) => (
                  <option key={cashier.id} value={cashier.name}>
                    {cashier.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="cashierName"
                placeholder="Contoh: pasha"
                value={selectedKasir}
                onChange={(e) => setSelectedKasir(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] focus:outline-none focus:border-[#6E5545] disabled:opacity-50"
              />
            )}
            {state?.errors?.cashierName && (
              <p className="text-red-500 text-[10px] mt-1">{state.errors.cashierName[0]}</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-[#7B6E65] mb-1">
              PIN Kasir (4–6 Angka)
            </label>
            <input
              type="password"
              name="pin"
              maxLength={6}
              inputMode="numeric"
              required
              disabled={isPending}
              placeholder="••••"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] focus:outline-none focus:border-[#6E5545] tracking-widest font-mono text-center text-sm font-bold placeholder:tracking-normal disabled:opacity-50"
            />
            {state?.errors?.pin && (
              <p className="text-red-500 text-[10px] mt-1 text-center">{state.errors.pin[0]}</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-[#7B6E65] mb-1">Kas Masuk Tambahan / Kas Awal</label>
            <input
              type="number"
              name="cashInAddition"
              placeholder="Contoh: 100000"
              value={cashInAddition}
              onChange={(e) => setCashInAddition(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] focus:outline-none focus:border-[#6E5545] disabled:opacity-50"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer bg-[#6E5545] hover:bg-[#584336] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isPending && <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />}
              <span>{isPending ? 'Memverifikasi PIN...' : 'Verifikasi & Mulai Shift'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
