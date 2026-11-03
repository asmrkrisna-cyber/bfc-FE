'use client';

import { useActionState, useEffect } from 'react';
import { voidTransactionAction } from '@/actions/transaction.action';
import { ActionResponse } from '@/actions/auth.action';
import { AlertIcon, CloseIcon, SpinnerIcon } from '@/components/Icons';

interface VoidModalProps {
  txId: string;
  onClose: () => void;
  onSubmitVoid?: (reason: string) => void;
  onSuccess?: () => void;
}

export default function VoidModal({ txId, onClose, onSubmitVoid, onSuccess }: VoidModalProps) {
  // Bind txId ke Server Action sesuai kaidah Next.js mutation
  const boundAction = voidTransactionAction.bind(null, txId);
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    boundAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      if (onSuccess) onSuccess();
      if (onSubmitVoid) onSubmitVoid('Void via server action');
      onClose();
    }
  }, [state, onSuccess, onSubmitVoid, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#EBE6DF]">
        <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertIcon className="w-4 h-4 shrink-0" />
            <h3 className="font-bold text-sm">Konfirmasi Pembatalan (Void)</h3>
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

        <p className="text-xs text-[#7B6E65]">
          Anda akan membatalkan transaksi <span className="font-bold text-[#2C221E]">{txId}</span>. Masukkan alasan pembatalan di bawah ini untuk keperluan audit:
        </p>

        {state?.message && !state.success && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-center gap-2 font-medium">
            <AlertIcon className="w-4 h-4 text-red-600 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <div>
            <textarea
              name="reason"
              required
              rows={3}
              disabled={isPending}
              placeholder="Contoh: Salah input pesanan / Pelanggan batal bayar"
              className="w-full p-3 bg-[#FAF7F2] border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] disabled:opacity-50"
            />
            {state?.errors?.reason && (
              <p className="text-red-500 text-[10px] mt-1">{state.errors.reason[0]}</p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 bg-white border border-[#EBE6DF] hover:bg-gray-100 text-[#7B6E65] rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isPending ? (
                <>
                  <SpinnerIcon className="w-4 h-4 text-white" />
                  <span>Membatalkan...</span>
                </>
              ) : (
                'Ya, Void Transaksi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
