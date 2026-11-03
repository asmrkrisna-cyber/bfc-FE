# BreakFree POS - Frontend (bfc-FE)

Aplikasi kasir modern berbasis Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, dan Zod.

## Prasyarat
- **Node.js**: v18 atau v20+
- **Backend API**: Berjalan di `http://localhost:5000` (opsional saat awal karena frontend dilengkapi mekanisme offline/mock fallback).

---

## Panduan Instalasi & Menjalankan

### 1. Clone Repositori & Masuk Direktori
```bash
git clone https://github.com/asmrkrisna-cyber/bfc-FE.git
cd bfc-FE
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (Opsional)
Secara default, aplikasi langsung terhubung ke `http://localhost:5000/api/v1`. Jika URL backend Anda berbeda, buat file `.env.local`:
```bash
cp .env.example .env.local
```
Isi dengan:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 4. Jalankan Aplikasi
- **Mode Development:**
  ```bash
  npm run dev
  ```
- **Mode Production:**
  ```bash
  npm run build
  npm start
  ```

Buka peramban di `http://localhost:3000`.
