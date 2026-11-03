'use client';

import { useState, useEffect, useActionState } from 'react';
import { API_BASE_URL } from '@/utils/api';
import { openShiftAction, ActionResponse } from '@/actions/shift.action';
import { AlertIcon, SpinnerIcon, GreenCircleIcon } from '@/components/Icons';

interface CashierOption {
  id: number;
  name: string;
}

interface OpenShiftFormProps {
  onStartShift: (cashier: string, category: 'Opening' | 'Closing', cash: number) => void;
}

export default function OpenShiftForm({ onStartShift }: OpenShiftFormProps) {
  const [cashierList, setCashierList] = useState<CashierOption[]>([]);
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    openShiftAction,
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
          }
        }
      } catch (err) {
        console.warn('Gagal memuat kasir di OpenShiftForm:', err);
      }
    };

    fetchCashiers();
  }, []);

  // Notifikasi sukses dari Server Action
  useEffect(() => {
    if (state?.success && state.data) {
      onStartShift(
        state.data.cashier,
        state.data.category as 'Opening' | 'Closing',
        state.data.startingCash
      );
    }
  }, [state, onStartShift]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EBE6DF] shadow-xs max-w-xl mx-auto space-y-4">
      <div className="border-b border-[#EBE6DF] pb-3">
        <h2 className="text-sm font-bold text-[#2C221E] flex items-center gap-2">
          <GreenCircleIcon className="w-2.5 h-2.5" />
          <span>Buka Shift Baru & Verifikasi PIN</span>
        </h2>
        <p className="text-[11px] text-[#7B6E65] mt-0.5">
          Pilih shift dan masukkan PIN kasir sebagai bentuk tanggung jawab antar shift
        </p>
      </div>

      {state?.message && !state.success && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-center gap-2 font-medium">
          <AlertIcon className="w-4 h-4 text-red-600 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Kategori Shift */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#7B6E65]">Kategori Shift</label>
          <select
            name="category"
            defaultValue="Opening"
            disabled={isPending}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] font-medium outline-none focus:border-[#6E5545] disabled:opacity-50"
          >
            <option value="Opening">Opening</option>
            <option value="Closing">Closing</option>
          </select>
          {state?.errors?.category && (
            <p className="text-red-500 text-[10px]">{state.errors.category[0]}</p>
          )}
        </div>

        {/* Nama Kasir */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#7B6E65]">Nama Kasir</label>
          {cashierList.length > 0 ? (
            <select
              name="cashierName"
              defaultValue={cashierList[0]?.name}
              disabled={isPending}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] font-medium outline-none focus:border-[#6E5545] capitalize disabled:opacity-50"
            >
              {cashierList.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="cashierName"
              required
              placeholder="Masukkan nama kasir"
              disabled={isPending}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] font-medium outline-none focus:border-[#6E5545] placeholder:text-gray-400 disabled:opacity-50"
            />
          )}
          {state?.errors?.cashierName && (
            <p className="text-red-500 text-[10px]">{state.errors.cashierName[0]}</p>
          )}
        </div>

        {/* PIN Kasir */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#7B6E65]">
            PIN Kasir (4–6 Angka)
          </label>
          <input
            type="password"
            name="pin"
            maxLength={6}
            inputMode="numeric"
            required
            placeholder="••••"
            disabled={isPending}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] font-mono tracking-widest font-bold text-center outline-none focus:border-[#6E5545] placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-normal disabled:opacity-50"
          />
          {state?.errors?.pin && (
            <p className="text-red-500 text-[10px] text-center">{state.errors.pin[0]}</p>
          )}
        </div>

        {/* Modal Kas Awal */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#7B6E65]">Modal Kas Awal di Laci (Rp)</label>
          <input
            type="number"
            name="startingCash"
            required
            defaultValue="500000"
            disabled={isPending}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] font-medium outline-none focus:border-[#6E5545] placeholder:text-gray-400 disabled:opacity-50"
            placeholder="500000"
          />
          {state?.errors?.startingCash && (
            <p className="text-red-500 text-[10px]">{state.errors.startingCash[0]}</p>
          )}
        </div>

        {/* Tombol Submit dengan Proteksi Double Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-[#2C221E] hover:bg-[#42352E] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <SpinnerIcon className="w-4 h-4 text-white" />
              <span>Memvalidasi & Membuka Shift...</span>
            </>
          ) : (
            'Verifikasi & Mulai Shift Sekarang'
          )}
        </button>
      </form>
    </div>
  );
}
