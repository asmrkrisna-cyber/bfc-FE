export interface SoldItem {
  name: string;
  qty: number;
  price: number;
}

export interface ShiftHistoryItem {
  id?: number | string;
  shift_status?: string;
  shiftCategory?: string;
  cashier_name?: string;
  cashierName?: string;
  start_time?: string;
  end_time?: string;
  starting_cash?: number | string;
  startingCash?: number;
  total_cash?: number | string;
  totalCash?: number;
  total_qris?: number | string;
  totalQRIS?: number;
  total_shopeefood?: number | string;
  totalShopeeFood?: number;
  total_breakfree_hub?: number | string;
  totalBreakfreeHub?: number;
  count_breakfree_hub?: number | string;
  countBreakfreeHub?: number;
  tax_amount?: number | string;
  tax?: number;
  net_revenue?: number | string;
  netRevenue?: number;
  final_physical_cash?: number | string;
  expected_cash?: number | string;
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
  totalBreakfreeHub: number;
  countBreakfreeHub: number;
  taxAmount: number;
  netRevenue: number;
  finalPhysicalCash: number;
  difference?: number;
  status?: 'SESUAI' | 'SELISIH';
}
