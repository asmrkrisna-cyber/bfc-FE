import { z } from 'zod';

export const voidTransactionSchema = z.object({
  txId: z.string().min(1, 'ID Transaksi wajib ada'),
  reason: z
    .string()
    .trim()
    .min(3, 'Alasan pembatalan minimal 3 karakter'),
});

export type VoidTransactionInput = z.infer<typeof voidTransactionSchema>;
