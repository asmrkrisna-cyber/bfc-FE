'use client';

import { useActionState, useEffect } from 'react';
import { verifyPinAction, ActionResponse } from '@/actions/shift.action';
import { LockIcon, CloseIcon, AlertIcon, SpinnerIcon } from '@/components/Icons';

interface CloseShiftModalProps {
  cashierName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CloseShiftModal({ cashierName, onClose, onConfirm }: CloseShiftModalProps) {
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    verifyPinAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      onConfirm();
    }
  }, [state, onConfirm]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
        <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3">
          <div className="flex items-center gap-2">
            <LockIcon className="w-4 h-4 text-[#6E5545]" />
            <h3 className="font-bold text-sm text-[#2C221E]">Konfirmasi Tutup Shift</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-[#7B6E65] hover:text-[#2C221E] p-1 rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
            aria-label="Tutup"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EBE6DF] text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-[#7B6E65]">Kasir Bertanggung Jawab:</span>
            <span className="font-bold text-[#2C221E] capitalize">{cashierName || 'Kasir'}</span>
          </div>
          <p className="text-[11px] text-[#7B6E65] pt-1 border-t border-[#EBE6DF]/60">
            Masukkan PIN kasir Anda untuk verifikasi serah terima dan penutupan shift.
          </p>
        </div>

        {state?.message && !state.success && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-center gap-2 font-medium">
            <AlertIcon className="w-4 h-4 text-red-600 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="cashierName" value={cashierName} />

          <div>
            <label className="block text-[11px] font-bold text-[#7B6E65] mb-1">
              PIN Kasir (4–6 Angka):
            </label>
            <input
              type="password"
              name="pin"
              maxLength={6}
              inputMode="numeric"
              required
              autoFocus
              disabled={isPending}
              placeholder="••••"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] tracking-widest font-mono text-center text-sm font-bold placeholder:tracking-normal placeholder:font-normal disabled:opacity-50"
            />
            {state?.errors?.pin && (
              <p className="text-red-500 text-[10px] mt-1 text-center">{state.errors.pin[0]}</p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-[#6E5545] hover:bg-[#584336] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isPending ? (
                <>
                  <SpinnerIcon className="w-4 h-4 text-white" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                'Verifikasi & Tutup'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
