'use server';

import { revalidatePath } from 'next/cache';
import { voidTransactionSchema } from '@/schemas/transaction.schema';
import { API_BASE_URL } from '@/utils/api';
import { ActionResponse } from './auth.action';

/**
 * Server Action untuk Void Transaksi.
 * Menggunakan teknik `.bind(null, txId)` sesuai materi untuk menyisipkan argumen ID secara aman.
 */
export async function voidTransactionAction(
  txId: string,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse<{ txId: string }>> {
  const rawData = {
    txId,
    reason: formData.get('reason'),
  };

  const parsed = voidTransactionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Alasan pembatalan tidak memenuhi syarat.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/transactions/${encodeURIComponent(txId)}/void`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: parsed.data.reason }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Gagal membatalkan transaksi di server.',
      };
    }

    // Revalidasi cache rute riwayat transaksi secara otomatis
    revalidatePath('/dashboard/riwayat');

    return {
      success: true,
      message: 'Transaksi berhasil di-void.',
      data: { txId },
    };
  } catch (err) {
    console.error('Error voidTransactionAction:', err);
    return {
      success: false,
      message: 'Gagal menghubungi server backend.',
    };
  }
}

