export interface OrderItem {
  name: string;
  qty: number;
  variant?: string;
}

export interface KitchenOrder {
  id: string;
  customerName: string;
  source: 'Kasir' | 'App BreakFree';
  isLiveApp?: boolean;
  orderType: 'Dine-in' | 'Takeaway' | 'Pickup App';
  tableNumber?: string;
  paymentMethod: 'Cash' | 'QRIS' | 'App BreakFree';
  timeAgo: string;
  status: 'Baru' | 'Diproses' | 'Siap Diambil';
  isOverdue?: boolean;
  note?: string;
  items: OrderItem[];
  cancelReason?: string;
}

export const INITIAL_KITCHEN_ORDERS: KitchenOrder[] = [
  {
    id: '#BF-031B',
    customerName: 'Alya P.',
    source: 'App BreakFree',
    isLiveApp: true,
    orderType: 'Takeaway',
    paymentMethod: 'QRIS',
    timeAgo: '18 mnt',
    status: 'Baru',
    isOverdue: true,
    note: 'Tanpa sedotan. Pisahkan minuman dan pastry.',
    items: [
      { name: 'Kopi Susu Gula Aren', qty: 2, variant: 'Regular - Less sugar - Oatmilk' },
      { name: 'Croissant Almond', qty: 1, variant: 'Hangatkan' },
    ],
  },
  {
    id: '#BF-0321',
    customerName: 'Kadir',
    source: 'Kasir',
    orderType: 'Dine-in',
    tableNumber: 'M02',
    paymentMethod: 'Cash',
    timeAgo: '4 mnt',
    status: 'Baru',
    items: [{ name: 'Caramel Macchiato', qty: 1, variant: 'Hot' }],
  },
  {
    id: '#BF-0314',
    customerName: 'Ricky',
    source: 'App BreakFree',
    isLiveApp: true,
    orderType: 'Pickup App',
    paymentMethod: 'App BreakFree',
    timeAgo: '12 mnt',
    status: 'Diproses',
    note: 'Cek segel dan label nama sebelum diserahkan.',
    items: [
      { name: 'Signature Matcha', qty: 1, variant: 'Regular - No sugar' },
      { name: 'Kopi Hitam Sarijan', qty: 2, variant: 'Panas - tanpa gula' },
    ],
  },
  {
    id: '#BF-0316',
    customerName: 'Nadia',
    source: 'Kasir',
    orderType: 'Dine-in',
    tableNumber: 'M10',
    paymentMethod: 'QRIS',
    timeAgo: '8 mnt',
    status: 'Diproses',
    items: [
      { name: 'Ice Kopi Susu', qty: 2, variant: 'Regular - normal sugar' },
      { name: 'Banana Bread', qty: 1, variant: 'Hangatkan 30 detik' },
    ],
  },
  {
    id: '#BF-0311',
    customerName: 'Dimas',
    source: 'Kasir',
    orderType: 'Takeaway',
    paymentMethod: 'Cash',
    timeAgo: '3 mnt',
    status: 'Siap Diambil',
    items: [
      { name: 'Kopi Ijo Susu', qty: 1, variant: 'Regular - Less sugar' },
      { name: 'Butter Croissant', qty: 1, variant: 'Hangatkan' },
    ],
  },
  {
    id: '#BF-0312',
    customerName: 'Nadia',
    source: 'App BreakFree',
    isLiveApp: true,
    orderType: 'Pickup App',
    paymentMethod: 'App BreakFree',
    timeAgo: '6 mnt',
    status: 'Siap Diambil',
    items: [{ name: 'BreakFree Aren Latte', qty: 2, variant: 'Large - Oatmilk' }],
  },
];