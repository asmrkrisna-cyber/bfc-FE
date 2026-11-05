'use server';

import { revalidatePath } from 'next/cache';
import { openShiftSchema, verifyPinSchema } from '@/schemas/shift.schema';
import { API_BASE_URL } from '@/utils/api';
import { ActionResponse } from './auth.action';

export type { ActionResponse };

export interface OpenShiftData {
  cashier: string;
  category: string;
  startingCash: number;
}

export type OpenShiftActionResponse = ActionResponse<OpenShiftData>;

export async function verifyPinAction(
  _prevState: ActionResponse<{ valid: boolean }> | null,
  formData: FormData
): Promise<ActionResponse<{ valid: boolean }>> {
  const rawData = {
    cashierName: formData.get('cashierName'),
    pin: formData.get('pin'),
  };

  const parsed = verifyPinSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: 'PIN tidak valid.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/cashiers/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: parsed.data.cashierName,
        pin: parsed.data.pin,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.valid) {
      return {
        success: false,
        message: data.message || 'PIN yang dimasukkan salah!',
      };
    }

    return {
      success: true,
      message: 'PIN terverifikasi.',
      data: { valid: true },
    };
  } catch (err) {
    console.error('Error in verifyPinAction:', err);
    return {
      success: false,
      message: 'Gagal memverifikasi PIN. Periksa koneksi backend.',
    };
  }
}

export async function openShiftAction(
  _prevState: OpenShiftActionResponse | null,
  formData: FormData
): Promise<OpenShiftActionResponse> {
  const rawData = {
    cashierName: formData.get('cashierName'),
    category: formData.get('category'),
    pin: formData.get('pin'),
    startingCash: formData.get('startingCash'),
  };

  const parsed = openShiftSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Data pembukaan shift tidak valid. Periksa isian form.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // 1. Verifikasi PIN terlebih dahulu
    const pinRes = await fetch(`${API_BASE_URL}/cashiers/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: parsed.data.cashierName,
        pin: parsed.data.pin,
      }),
    });

    const pinData = await pinRes.json();
    if (!pinRes.ok || !pinData.valid) {
      return {
        success: false,
        message: pinData.message || 'PIN kasir yang dimasukkan salah!',
      };
    }

    // 2. Simpan pembukaan shift ke database
    const shiftRes = await fetch(`${API_BASE_URL}/shifts/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cashierName: parsed.data.cashierName,
        shiftStatus: parsed.data.category,
        startingCash: parsed.data.startingCash,
      }),
    });

    if (!shiftRes.ok) {
      const shiftData = await shiftRes.json();
      return {
        success: false,
        message: shiftData.message || 'Gagal memulai shift di database.',
      };
    }

    // 3. Revalidasi cache pada rute yang menggunakan data shift
    revalidatePath('/dashboard/rekap-shift');
    revalidatePath('/pos');

    return {
      success: true,
      message: 'Shift berhasil dibuka!',
      data: {
        cashier: parsed.data.cashierName,
        category: parsed.data.category,
        startingCash: parsed.data.startingCash,
      },
    };
  } catch (err) {
    console.error('Error in openShiftAction:', err);
    return {
      success: false,
      message: 'Gagal membuka shift. Periksa koneksi backend.',
    };
  }
}
