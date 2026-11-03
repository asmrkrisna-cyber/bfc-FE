export interface DiscountItem {
  id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase: number;
  isActive: boolean;
}

export const INITIAL_DISCOUNTS: DiscountItem[] = [
  {
    id: '1',
    code: 'PROMOJUMAT',
    name: 'Diskon Berkah Jumat',
    type: 'PERCENTAGE',
    value: 10,
    minPurchase: 30000,
    isActive: true,
  },
  {
    id: '2',
    code: 'HEMAT5BUBUK',
    name: 'Potongan Langsung Menu Baru',
    type: 'FIXED',
    value: 5000,
    minPurchase: 25000,
    isActive: true,
  },
  {
    id: '3',
    code: 'MAHASISWA',
    name: 'Diskon Special Pelajar/Mahasiswa',
    type: 'PERCENTAGE',
    value: 15,
    minPurchase: 20000,
    isActive: false,
  },
];