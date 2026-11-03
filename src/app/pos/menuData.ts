export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
}

export interface CartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
  note?: string;
}

export interface SavedDiscount {
  id: string;
  name: string;
  type: 'percent' | 'fixed';
  value: number;
}

export interface TransactionReceipt {
  id: string;
  date: string;
  customerName: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  discountAmount: number;
  discountName?: string;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'QRIS' | 'ShopeeFood';
  cashGiven?: number;
  change?: number;
  isReprint?: boolean;
}

export const SAVED_DISCOUNTS: SavedDiscount[] = [
  { id: 'disc-ktm', name: 'Diskon KTM (10%)', type: 'percent', value: 10 },
  { id: 'disc-jumat', name: 'Promo Jumat Berkah (Rp 5.000)', type: 'fixed', value: 5000 },
  { id: 'disc-vip', name: 'Member VIP (15%)', type: 'percent', value: 15 },
  { id: 'disc-voucher', name: 'Voucher Pelanggan (Rp 2.000)', type: 'fixed', value: 2000 },
];

export const CATEGORIES = [
  'Semua',
  'Espresso Based',
  'Hot Coklat',
  'Seneng Teh',
  'Signature',
  'Herbal',
  'Hot Coffe',
  'Ice Cube',
  'Moctails',
  'Indomie',
  'Nasi',
  'Paket Hemat',
  'Snack',
  'Adds Ons',
  'ShopeeFood',
];

const BASE_MENU: MenuItem[] = [
  { id: 'eb-1', name: 'Ice Kopi Susu', category: 'Espresso Based', price: 18000 },
  { id: 'eb-2', name: 'Breakfree Aren Latte', category: 'Espresso Based', price: 22000 },
  { id: 'eb-3', name: 'Caramel Macchiato', category: 'Espresso Based', price: 24000 },
  { id: 'eb-4', name: 'Americano', category: 'Espresso Based', price: 18000 },
  { id: 'hc-1', name: 'Hot Choco Ori', category: 'Hot Coklat', price: 15000 },
  { id: 'hc-2', name: 'Choco Milk', category: 'Hot Coklat', price: 18000 },
  { id: 'hc-3', name: 'Choco Coffee', category: 'Hot Coklat', price: 20000 },
  { id: 'st-1', name: 'Seneng Teh Ori', category: 'Seneng Teh', price: 8000 },
  { id: 'st-2', name: 'Leci Tea', category: 'Seneng Teh', price: 12000 },
  { id: 'st-3', name: 'Lemon Tea', category: 'Seneng Teh', price: 12000 },
  { id: 'st-4', name: 'Milk Tea', category: 'Seneng Teh', price: 15000 },
  { id: 'sg-1', name: 'Signature Ori', category: 'Signature', price: 22000 },
  { id: 'sg-2', name: 'Signature Coklat', category: 'Signature', price: 24000 },
  { id: 'sg-3', name: 'Signature Taro', category: 'Signature', price: 24000 },
  { id: 'sg-4', name: 'Signature Matcha', category: 'Signature', price: 25000 },
  { id: 'sg-5', name: 'Signature Red Velvet', category: 'Signature', price: 25000 },
  { id: 'sg-6', name: 'Signature Moca', category: 'Signature', price: 25000 },
  { id: 'hr-1', name: 'Wedang Jahe', category: 'Herbal', price: 12000 },
  { id: 'hr-2', name: 'Susu Jahe', category: 'Herbal', price: 15000 },
  { id: 'hr-3', name: 'Wedang Uwuh', category: 'Herbal', price: 12000 },
  { id: 'hr-4', name: 'Bramasta', category: 'Herbal', price: 15000 },
  { id: 'hcf-1', name: 'Kopi Susu', category: 'Hot Coffe', price: 15000 },
  { id: 'hcf-2', name: 'Kopi Hitam', category: 'Hot Coffe', price: 10000 },
  { id: 'hcf-3', name: 'Kopi Ijo', category: 'Hot Coffe', price: 12000 },
  { id: 'hcf-4', name: 'Kopi Ijo Susu', category: 'Hot Coffe', price: 16000 },
  { id: 'hcf-5', name: 'Kopi Tulup', category: 'Hot Coffe', price: 12000 },
  { id: 'hcf-6', name: 'Kopi Tulup Susu', category: 'Hot Coffe', price: 16000 },
  { id: 'ic-1', name: 'Cube Ori', category: 'Ice Cube', price: 20000 },
  { id: 'ic-2', name: 'Cube Moca', category: 'Ice Cube', price: 22000 },
  { id: 'ic-3', name: 'Cube Tiramisu', category: 'Ice Cube', price: 22000 },
  { id: 'moc-1', name: 'Manggo Orange Twist', category: 'Moctails', price: 17000 },
  { id: 'moc-2', name: 'Grape Fizz', category: 'Moctails', price: 17000 },
  { id: 'indo-1', name: 'Indomie Goreng', category: 'Indomie', price: 12000 },
  { id: 'indo-2', name: 'Indomie Nyemek', category: 'Indomie', price: 14000 },
  { id: 'ns-1', name: 'Nasi Telur Barendo', category: 'Nasi', price: 18000 },
  { id: 'ns-2', name: 'Nasi Goreng', category: 'Nasi', price: 20000 },
  { id: 'ns-3', name: 'Nasi Ayam Crispy', category: 'Nasi', price: 25000 },
  { id: 'ph-1', name: 'Nasi Ayam Paket', category: 'Paket Hemat', price: 22000 },
  { id: 'ph-2', name: 'Nasi Telur Paket', category: 'Paket Hemat', price: 15000 },
  { id: 'ph-3', name: 'Mie Goreng Paket', category: 'Paket Hemat', price: 15000 },
  { id: 'ph-4', name: 'Mie Nyemek Paket', category: 'Paket Hemat', price: 17000 },
  { id: 'snk-1', name: 'Mix Platter', category: 'Snack', price: 25000 },
  { id: 'snk-2', name: 'Mini Pau', category: 'Snack', price: 18000 },
  { id: 'snk-3', name: 'Bakso Tahu', category: 'Snack', price: 18000 },
  { id: 'snk-4', name: 'Gyoza', category: 'Snack', price: 22000 },
  { id: 'snk-5', name: 'Cireng', category: 'Snack', price: 15000 },
  { id: 'ao-1', name: 'Nasi', category: 'Adds Ons', price: 5000 },
  { id: 'ao-2', name: 'Mineral', category: 'Adds Ons', price: 5000 },
  { id: 'ao-3', name: 'Telur', category: 'Adds Ons', price: 5000 },
];

const SHOPEEFOOD_MENU: MenuItem[] = BASE_MENU.map((item) => ({
  id: `sf-${item.id}`,
  name: `SF - ${item.name}`,
  category: 'ShopeeFood',
  price: item.price,
}));

export const ALL_MENU = [...BASE_MENU, ...SHOPEEFOOD_MENU];
