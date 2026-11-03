import type { Metadata } from 'next';
import './globals.css';

// Tambahkan v=2 (atau angka acak apa saja) untuk memaksa browser mengunduh ikon baru
export const metadata: Metadata = {
  title: 'BreakFree POS',
  description: 'Web POS Portal - Breakfree Coffee',
  icons: {
    icon: '/logo.png?v=2',        // Tambahkan query string versi
    shortcut: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}