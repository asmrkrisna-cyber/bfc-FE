import { z } from 'zod';

export const openShiftSchema = z.object({
  cashierName: z
    .string()
    .min(1, 'Nama kasir tidak boleh kosong')
    .trim(),
  category: z.enum(['Opening', 'Closing'] as const),
  pin: z
    .string()
    .regex(/^\d{4,6}$/, 'PIN kasir harus berupa 4 hingga 6 digit angka'),
  startingCash: z.coerce
    .number()
    .min(0, 'Modal kas awal tidak boleh bernilai negatif'),
});

export const verifyPinSchema = z.object({
  cashierName: z
    .string()
    .min(1, 'Nama kasir tidak boleh kosong')
    .trim(),
  pin: z
    .string()
    .regex(/^\d{4,6}$/, 'PIN kasir harus berupa 4 hingga 6 digit angka'),
});

export type OpenShiftInput = z.infer<typeof openShiftSchema>;
export type VerifyPinInput = z.infer<typeof verifyPinSchema>;
