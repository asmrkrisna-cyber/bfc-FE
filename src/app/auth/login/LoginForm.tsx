'use client';

import { useActionState, useEffect, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction, AuthActionResponse } from '@/actions/auth.action';
import { AlertIcon, SpinnerIcon } from '@/components/Icons';

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AuthActionResponse | null, FormData>(
    loginAction,
    null
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientErrors, setClientErrors] = useState<{ username?: string; password?: string }>({});

  // Reset error field saat kasir mengetik ulang
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (clientErrors.username) {
      setClientErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (clientErrors.password) {
      setClientErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi Kustom Client-side (Tanpa Popup Bawaan Browser)
    const errors: { username?: string; password?: string } = {};

    const trimmedEmail = username.trim();
    if (!trimmedEmail) {
      errors.username = 'Email kasir wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.username = 'Format email tidak valid';
    } else if (!trimmedEmail.toLowerCase().endsWith('@gmail.com')) {
      errors.username = 'Email harus menggunakan domain @gmail.com';
    }

    if (!password) {
      errors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
    const formData = new FormData();
    formData.append('username', trimmedEmail);
    formData.append('password', password);

    startTransition(() => {
      formAction(formData);
    });
  };

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

  // Gabungkan error dari client dan error dari server action
  const emailError = clientErrors.username || state?.errors?.username?.[0];
  const passwordError = clientErrors.password || state?.errors?.password?.[0];
  const isCredentialError = state?.message && !state.success;

  return (
    <div className="w-full space-y-4">
      {/* Alert Error Global dari Server Action (Kredensial Salah / Server Error) */}
      {isCredentialError && (
        <div className="p-3.5 bg-red-950/60 border border-red-700/60 text-red-200 text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm">
          <AlertIcon className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
        {/* Input Email Gmail */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
            EMAIL GMAIL KASIR
          </label>
          <div className="relative">
            <input
              type="email"
              name="username"
              placeholder="kasirbreakfree@gmail.com"
              value={username}
              onChange={handleUsernameChange}
              disabled={isPending}
              suppressHydrationWarning
              autoComplete="email"
              className={`w-full px-4 py-3 bg-[#121212] border rounded-xl text-xs text-white outline-none transition-all placeholder-[#48484A] disabled:opacity-50 ${
                emailError || (isCredentialError && !clientErrors.username)
                  ? 'border-red-500/80 bg-red-950/10 focus:border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]'
                  : 'border-[#2A2A2D] focus:border-[#D97706]'
              }`}
            />
          </div>
          {emailError && (
            <p className="text-red-400 text-[10px] pl-1 font-medium flex items-center gap-1">
              <span>•</span> {emailError}
            </p>
          )}
        </div>

        {/* Input Password */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
            PASSWORD (MINIMAL 6 KARAKTER)
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              disabled={isPending}
              suppressHydrationWarning
              autoComplete="current-password"
              className={`w-full px-4 py-3 bg-[#121212] border rounded-xl text-xs text-white outline-none transition-all placeholder-[#48484A] disabled:opacity-50 ${
                passwordError || (isCredentialError && !clientErrors.password)
                  ? 'border-red-500/80 bg-red-950/10 focus:border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]'
                  : 'border-[#2A2A2D] focus:border-[#D97706]'
              }`}
            />
          </div>
          {passwordError && (
            <p className="text-red-400 text-[10px] pl-1 font-medium flex items-center gap-1">
              <span>•</span> {passwordError}
            </p>
          )}
        </div>

        {/* Tombol Submit dengan Proteksi Double-Submit via isPending */}
        <button
          type="submit"
          disabled={isPending}
          suppressHydrationWarning
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
