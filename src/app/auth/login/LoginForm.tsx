'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction, ActionResponse } from '@/actions/auth.action';
import { AlertIcon, SpinnerIcon } from '@/components/Icons';

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    loginAction,
    null
  );

  // Jika login berhasil di Server Action, simpan kompatibilitas client state dan arahkan ke POS
  useEffect(() => {
    if (state?.success && state.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', state.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('cashierName', state.data.user.username);
      }
      router.push('/pos');
    }
  }, [state, router]);

  return (
    <div className="w-full space-y-4">
      {/* Alert Error Global dari Server Action */}
      {state?.message && !state.success && (
        <div className="p-3 bg-red-900/40 border border-red-700/50 text-red-200 text-xs rounded-xl flex items-center justify-center gap-2">
          <AlertIcon className="w-4 h-4 text-red-400 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Input Email Gmail */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
            EMAIL GMAIL KASIR
          </label>
          <input
            type="email"
            name="username"
            placeholder="kasirbreakfree@gmail.com"
            required
            disabled={isPending}
            className="w-full px-4 py-3 bg-[#121212] border border-[#2A2A2D] focus:border-[#D97706] rounded-xl text-xs text-white outline-none transition-all placeholder-[#48484A] disabled:opacity-50"
          />
          {state?.errors?.username && (
            <p className="text-red-400 text-[10px] pl-1 font-medium">{state.errors.username[0]}</p>
          )}
        </div>

        {/* Input Password */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
            PASSWORD (MINIMAL 6 KARAKTER)
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={6}
            disabled={isPending}
            className="w-full px-4 py-3 bg-[#121212] border border-[#2A2A2D] focus:border-[#D97706] rounded-xl text-xs text-white outline-none transition-all placeholder-[#48484A] disabled:opacity-50"
          />
          {state?.errors?.password && (
            <p className="text-red-400 text-[10px] pl-1 font-medium">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Tombol Submit dengan Proteksi Double-Submit via isPending */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-[#E65100] hover:bg-[#D84315] text-white rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <SpinnerIcon className="w-4 h-4 text-white" />
              <span>Memvalidasi & Memverifikasi...</span>
            </>
          ) : (
            'Masuk Dashboard Kasir'
          )}
        </button>
      </form>
    </div>
  );
}
