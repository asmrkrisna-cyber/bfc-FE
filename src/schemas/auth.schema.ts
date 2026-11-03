import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .trim()
    .email('Format email tidak valid')
    .refine(
      (email) => email.toLowerCase().endsWith('@gmail.com'),
      { message: 'Email harus menggunakan domain @gmail.com' }
    ),
  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
    .min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;
