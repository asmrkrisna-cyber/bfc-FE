export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  description: string;
  image: string;
}

export const CATEGORIES = ['Semua', 'Kopi', 'Non-Kopi', 'Makanan', 'Snack'];

export const PRODUCTS: Product[] = [
  // --- KOPI ---
  {
    id: 'k1',
    name: 'Ice Kopi Susu',
    category: 'Kopi',
    subCategory: 'Espresso Based',
    price: 16000,
    description: 'Kopi susu creamy khas Breakfree.',
    image: '',
  },
  {
    id: 'k2',
    name: 'Breakfree Aren Latte',
    category: 'Kopi',
    subCategory: 'Espresso Based',
    price: 18000,
    description: 'Perpaduan espresso dan gula aren asli.',
    image: '',
  },
  {
    id: 'k3',
    name: 'Caramel Macchiato',
    category: 'Kopi',
    subCategory: 'Espresso Based',
    price: 19000,
    description: 'Manis karamel berpadu espresso lembut.',
    image: '',
  },
  {
    id: 'k4',
    name: 'Signature Matcha Coffee',
    category: 'Kopi',
    subCategory: 'Espresso Based',
    price: 20000,
    description: 'Kombinasi unik matcha dan shot espresso.',
    image: '',
  },

  // --- NON-KOPI ---
  {
    id: 'nk1',
    name: 'Hot Coklat Ori',
    category: 'Non-Kopi',
    subCategory: 'Coklat & Herbal',
    price: 10000,
    description: 'Coklat hangat original dengan rasa kakao pekat.',
    image: '',
  },
  {
    id: 'nk2',
    name: 'Hot Coklat Milk',
    category: 'Non-Kopi',
    subCategory: 'Coklat & Herbal',
    price: 12000,
    description: 'Coklat hangat lembut dengan susu yang creamy.',
    image: '',
  },
  {
    id: 'nk3',
    name: 'Wedang Jahe',
    category: 'Non-Kopi',
    subCategory: 'Coklat & Herbal',
    price: 8000,
    description: 'Seduhan jahe hangat dengan aroma rempah alami.',
    image: '',
  },
  {
    id: 'nk4',
    name: 'Seneng Teh Ori',
    category: 'Non-Kopi',
    subCategory: 'Teh & Buah',
    price: 10000,
    description: 'Teh original segar untuk teman santai.',
    image: '',
  },
  {
    id: 'nk5',
    name: 'Lemon Tea',
    category: 'Non-Kopi',
    subCategory: 'Teh & Buah',
    price: 15000,
    description: 'Teh segar dengan rasa lemon yang cerah.',
    image: '',
  },
  {
    id: 'nk6',
    name: 'Signature Ori',
    category: 'Non-Kopi',
    subCategory: 'Signature',
    price: 15000,
    description: 'Racikan creamy khas BreakFree dengan rasa original.',
    image: '',
  },
  {
    id: 'nk7',
    name: 'Signature Coklat',
    category: 'Non-Kopi',
    subCategory: 'Signature',
    price: 18000,
    description: 'Signature creamy dengan coklat yang kaya.',
    image: '',
  },

  // --- MAKANAN ---
  {
    id: 'm1',
    name: 'Indomie Goreng',
    category: 'Makanan',
    subCategory: 'Indomie Goreng',
    price: 12000,
    description: 'Mi goreng gurih klasik dengan taburan bawang.',
    image: '',
  },
  {
    id: 'm2',
    name: 'Indomie Nyemek',
    category: 'Makanan',
    subCategory: 'Indomie Nyemek',
    price: 16000,
    description: 'Mi nyemek gurih dengan kuah kental yang nikmat.',
    image: '',
  },
  {
    id: 'm3',
    name: 'Nasi Telur Barendo',
    category: 'Makanan',
    subCategory: 'Nasi & Paket Hemat',
    price: 13000,
    description: 'Nasi hangat dengan telur barendo renyah.',
    image: '',
  },
  {
    id: 'm4',
    name: 'Nasi Goreng Telur',
    category: 'Makanan',
    subCategory: 'Nasi & Paket Hemat',
    price: 17000,
    description: 'Nasi goreng gurih dengan telur dan acar segar.',
    image: '',
  },
  {
    id: 'm5',
    name: 'Nasi Ayam Krispi + Es Teh',
    category: 'Makanan',
    subCategory: 'Nasi & Paket Hemat',
    price: 22000,
    description: 'Paket nasi ayam krispi lengkap dengan es teh.',
    image: '',
  },

  // --- SNACK & ADD-ONS ---
  {
    id: 's1',
    name: 'Mini Pao',
    category: 'Snack',
    subCategory: 'Camilan Favorit',
    price: 15000,
    description: 'Mini pao lembut, hangat, dan pas untuk santai.',
    image: '',
  },
  {
    id: 's2',
    name: 'French Fries',
    category: 'Snack',
    subCategory: 'Camilan Favorit',
    price: 17000,
    description: 'Kentang goreng renyah dengan saus pilihan.',
    image: '',
  },
  {
    id: 's3',
    name: 'Cireng',
    category: 'Snack',
    subCategory: 'Camilan Favorit',
    price: 17000,
    description: 'Cireng gurih renyah dengan cocolan pedas manis.',
    image: '',
  },
  {
    id: 'a1',
    name: 'Telur (Add-on)',
    category: 'Snack',
    subCategory: 'Add-ons',
    price: 3000,
    description: 'Tambahan lauk telur.',
    image: '',
  },
  {
    id: 'a2',
    name: 'Nasi (Add-on)',
    category: 'Snack',
    subCategory: 'Add-ons',
    price: 5000,
    description: 'Tambahan porsi nasi putih.',
    image: '',
  },
];