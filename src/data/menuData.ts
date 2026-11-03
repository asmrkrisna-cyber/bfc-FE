export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isAvailable: boolean;
}

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
];

export const INITIAL_MENU: MenuItem[] = [
  // Espresso Based
  { id: '1', name: 'Ice Kopi Susu', category: 'Espresso Based', price: 18000, description: 'Espresso segar dengan susu pilihan dan gula aren alami.', isAvailable: true },
  { id: '2', name: 'Breakfree Aren Latte', category: 'Espresso Based', price: 22000, description: 'Signature kopi susu gula aren ekstra creamy.', isAvailable: true },
  { id: '3', name: 'Caramel Macchiato', category: 'Espresso Based', price: 24000, description: 'Espresso halus disiram saus karamel manis gurih.', isAvailable: true },
  { id: '4', name: 'Americano', category: 'Espresso Based', price: 18000, description: 'Espresso murni diseduh dengan air hangat/dingin.', isAvailable: true },

  // Hot Coklat
  { id: '5', name: 'Hot Choco Ori', category: 'Hot Coklat', price: 15000, description: 'Coklat hangat pekat rasanya kaya dan menenangkan.', isAvailable: true },
  { id: '6', name: 'Choco Milk', category: 'Hot Coklat', price: 18000, description: 'Perpaduan coklat pekat dan susu segar.', isAvailable: true },
  { id: '7', name: 'Choco Coffre', category: 'Hot Coklat', price: 20000, description: 'Kombinasi coklat hangat dengan sentuhan kopi pilihan.', isAvailable: true },

  // Seneng Teh
  { id: '8', name: 'Seneng Teh Ori', category: 'Seneng Teh', price: 8000, description: 'Teh manis dingin dengan aroma melati yang khas.', isAvailable: true },
  { id: '9', name: 'Leci Tea', category: 'Seneng Teh', price: 15000, description: 'Teh manis dingin rasa buah leci segar dengan topping buah.', isAvailable: true },
  { id: '10', name: 'Lemon Tea', category: 'Seneng Teh', price: 14000, description: 'Teh segar dengan perasan jeruk lemon asli.', isAvailable: true },
  { id: '11', name: 'Milk Tea', category: 'Seneng Teh', price: 16000, description: 'Teh susu lembut manis menyegarkan.', isAvailable: true },

  // Signature
  { id: '12', name: 'Signature Ori', category: 'Signature', price: 20000, description: 'Menu signature khas racikan andalan.', isAvailable: true },
  { id: '13', name: 'Signature Coklat', category: 'Signature', price: 22000, description: 'Signature dengan rasa coklat premium.', isAvailable: true },
  { id: '14', name: 'Signature Taro', category: 'Signature', price: 22000, description: 'Signature rasa taro yang manis dan lembut.', isAvailable: true },
  { id: '15', name: 'Signature Matcha', category: 'Signature', price: 23000, description: 'Signature matcha jepang pilihan.', isAvailable: true },
  { id: '16', name: 'Signature Red Velvet', category: 'Signature', price: 23000, description: 'Signature red velvet creamy dan manis.', isAvailable: true },
  { id: '17', name: 'Signature Moca', category: 'Signature', price: 24000, description: 'Signature perpaduan kopi dan coklat istimewa.', isAvailable: true },

  // Herbal
  { id: '18', name: 'Wedang Jahe', category: 'Herbal', price: 12000, description: 'Minuman jahe hangat tradisional penghangat tubuh.', isAvailable: true },
  { id: '19', name: 'Susu Jahe', category: 'Herbal', price: 15000, description: 'Jahe hangat dipadu dengan susu manis gurih.', isAvailable: true },
  { id: '20', name: 'Wedang Uwuh', category: 'Herbal', price: 14000, description: 'Minuman rempah herbal kaya khasiat.', isAvailable: true },
  { id: '21', name: 'Bramasta', category: 'Herbal', price: 16000, description: 'Racikan herbal spesial khas Nusantara.', isAvailable: true },

  // Hot Coffe
  { id: '22', name: 'Kopi Susu', category: 'Hot Coffe', price: 15000, description: 'Kopi hitam panas dengan tambahan susu.', isAvailable: true },
  { id: '23', name: 'Kopi Hitam', category: 'Hot Coffe', price: 12000, description: 'Kopi hitam tubruk panas klasik.', isAvailable: true },
  { id: '24', name: 'Kopi Ijo', category: 'Hot Coffe', price: 14000, description: 'Kopi tradisional khas berkarakter unik.', isAvailable: true },
  { id: '25', name: 'Kopi Ijo Susu', category: 'Hot Coffe', price: 17000, description: 'Kopi ijo dipadu dengan susu kental manis.', isAvailable: true },
  { id: '26', name: 'Kopi Tulup', category: 'Hot Coffe', price: 14000, description: 'Kopi rempah hangat tradisional.', isAvailable: true },
  { id: '27', name: 'Kopi Tulup Susu', category: 'Hot Coffe', price: 17000, description: 'Kopi tulup hangat dengan tambahan susu.', isAvailable: true },

  // Ice Cube
  { id: '28', name: 'Cube Ori', category: 'Ice Cube', price: 22000, description: 'Es kopi kubus rasa original.', isAvailable: true },
  { id: '29', name: 'Cube Moca', category: 'Ice Cube', price: 24000, description: 'Es kopi kubus rasa moca.', isAvailable: true },
  { id: '30', name: 'Cube Tiramisu', category: 'Ice Cube', price: 25000, description: 'Es kopi kubus rasa tiramisu lezat.', isAvailable: true },

  // Moctails
  { id: '48', name: 'Manggo Orange Twist', category: 'Moctails', price: 17000, description: 'Mocktail segar perpaduan mangga dan jeruk.', isAvailable: true },
  { id: '49', name: 'Grape Fizz', category: 'Moctails', price: 17000, description: 'Minuman soda anggur segar berbuih.', isAvailable: true },

  // Indomie (Nyemek & Goreng jadi satu)
  { id: '31', name: 'Indomie Goreng Spesial', category: 'Indomie', price: 15000, description: 'Indomie goreng lezat dengan topping lengkap.', isAvailable: true },
  { id: '32', name: 'Indomie Nyemek', category: 'Indomie', price: 16000, description: 'Indomie kuah kental gurih khas rumahan.', isAvailable: true },

  // Nasi
  { id: '33', name: 'Nasi Telur Barendo', category: 'Nasi', price: 15000, description: 'Nasi hangat dengan telur dadar barendo renyah.', isAvailable: true },
  { id: '34', name: 'Nasi Goreng', category: 'Nasi', price: 20000, description: 'Nasi goreng spesial lengkap dengan kerupuk.', isAvailable: true },
  { id: '35', name: 'Nasi Ayam Crispy', category: 'Nasi', price: 25000, description: 'Nasi dengan ayam goreng crispy gurih.', isAvailable: true },

  // Paket Hemat
  { id: '36', name: 'Nasi Ayam Paket', category: 'Paket Hemat', price: 22000, description: 'Paket lengkap nasi, ayam, dan teh.', isAvailable: true },
  { id: '37', name: 'Nasi Telur Paket', category: 'Paket Hemat', price: 13000, description: 'Paket ekonomis nasi dan telur.', isAvailable: true },
  { id: '38', name: 'Mie Goreng Paket', category: 'Paket Hemat', price: 18000, description: 'Paket mie goreng komplit.', isAvailable: true },
  { id: '39', name: 'Mie Nyemek Paket', category: 'Paket Hemat', price: 19000, description: 'Paket mie nyemek nikmat.', isAvailable: true },

  // Snack (Cemilan)
  { id: '40', name: 'Mix Platter', category: 'Snack', price: 28000, description: 'Kombinasi kentang goreng, sosis, dan nugget renyah.', isAvailable: true },
  { id: '41', name: 'Mini Pau', category: 'Snack', price: 15000, description: 'Bakpao mini isi lezat.', isAvailable: true },
  { id: '42', name: 'Bakso Tahu', category: 'Snack', price: 16000, description: 'Bakso tahu gurih hangat.', isAvailable: true },
  { id: '43', name: 'Gyoza', category: 'Snack', price: 20000, description: 'Dumpling jepang isi ayam/udang.', isAvailable: true },
  { id: '44', name: 'Cireng', category: 'Snack', price: 12000, description: 'Cireng crispy dengan bumbu rujak.', isAvailable: true },

  // Adds Ons
  { id: '45', name: 'Nasi', category: 'Adds Ons', price: 5000, description: 'Extra porsi nasi putih.', isAvailable: true },
  { id: '46', name: 'Mineral', category: 'Adds Ons', price: 5000, description: 'Air mineral botol.', isAvailable: true },
  { id: '47', name: 'Telur', category: 'Adds Ons', price: 5000, description: 'Extra tambahan telur.', isAvailable: true },
];
