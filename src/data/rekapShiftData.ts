export interface SoldItem {
  name: string;
  qty: number;
  price: number;
}

export interface ShiftRecord {
  id: string;
  shiftCategory: string;
  cashierName: string;
  timeRange: string;
  startingCash: number;
  totalCash: number;
  totalQRIS: number;
  totalShopeeFood: number;
  taxAmount: number;
  netRevenue: number;
  finalPhysicalCash: number;
  difference?: number;
  status?: 'SESUAI' | 'SELISIH';
}

export const INITIAL_SHIFT_HISTORY: ShiftRecord[] = [
  {
    id: 'rec-1',
    shiftCategory: 'Closing',
    cashierName: 'Budi',
    timeRange: '15:00 WIB - 23:00 WIB (Kemarin)',
    startingCash: 500000,
    totalCash: 2100000,
    totalQRIS: 3200000,
    totalShopeeFood: 1500000,
    taxAmount: 530000,
    netRevenue: 6270000,
    finalPhysicalCash: 2515000,
    difference: 0,
    status: 'SESUAI',
  },
];

export const INITIAL_SOLD_ITEMS: SoldItem[] = [
  { name: 'Ice Kopi Susu', qty: 25, price: 18000 },
  { name: 'Breakfree Aren Latte', qty: 18, price: 22000 },
  { name: 'Americano', qty: 10, price: 18000 },
  { name: 'Seneng Teh Ori', qty: 15, price: 8000 },
  { name: 'Nasi Goreng', qty: 12, price: 20000 },
  { name: 'Mix Platter', qty: 8, price: 25000 },
  { name: 'SF - Ice Kopi Susu', qty: 10, price: 18000 },
];