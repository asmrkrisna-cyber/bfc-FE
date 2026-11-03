'use server';

import { cookies } from 'next/headers';
import { loginSchema } from '@/schemas/auth.schema';
import { API_BASE_URL } from '@/utils/api';

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

export async function loginAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse<{ token: string; user: { id: number; username: string; role?: string } }>> {
  const rawData = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validasi gagal. Silakan periksa kolom input Anda.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Username atau password salah!',
      };
    }

    // Pasang HTTP-only Cookie untuk keamanan session server-side
    const cookieStore = await cookies();
    cookieStore.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return {
      success: true,
      message: 'Login berhasil!',
      data: {
        token: data.token,
        user: data.user,
      },
    };
  } catch (error: any) {
    console.error('Error saat loginAction:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server backend. Pastikan backend aktif.',
    };
  }
}

