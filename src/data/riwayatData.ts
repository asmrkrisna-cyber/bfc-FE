export interface TransactionItem {
  name: string;
  qty: number;
  price: number;
}

export interface Transaction {
  id: string;
  customerName?: string;
  tableNumber?: string;
  paymentMethod: string;
  time: string;
  date?: string;
  status: 'SUKSES' | 'VOID / BATAL' | string;
  items: TransactionItem[];
  total: number;
  subtotal?: number;
  discount?: number;
  tax?: number;
  cashGiven?: number;
  change?: number;
  voidReason?: string;
}