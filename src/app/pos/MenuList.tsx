'use client';
import { CATEGORIES as DEFAULT_CATEGORIES, MenuItem } from './menuData';
import { SearchIcon, RefreshIcon } from '@/components/Icons';

interface MenuListProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredMenu: MenuItem[];
  addToCart: (item: MenuItem) => void;
  categories?: string[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function MenuList({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  filteredMenu,
  addToCart,
  categories = DEFAULT_CATEGORIES,
  onRefresh,
  isLoading,
}: MenuListProps) {
  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-5">
      {/* HEADER KONTROL: SEARCH BAR & REFRESH */}
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Search Input Luas */}
        <div className="relative flex-1">
          <SearchIcon className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder={selectedCategory === 'Semua' ? 'Cari nama produk / minuman...' : `Cari di kategori ${selectedCategory}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] shadow-xs placeholder:text-gray-400 transition-colors"
          />
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Perbarui data menu dari server"
            disabled={isLoading}
            className="h-10 px-4 bg-white hover:bg-[#F5F2EC] border border-[#EBE6DF] rounded-xl text-xs font-bold text-[#6E5545] flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshIcon className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Menu</span>
          </button>
        )}
      </div>

      {/* NAVIGASI KATEGORI WRAP (LANGSUNG TAMPIL SEMUA TANPA GESER/SCROLL) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-[#7B6E65] uppercase">
            Pilih Kategori Menu
          </span>
          <span className="text-[11px] text-[#A89F91]">
            {categories.length} Kategori Tersedia
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-3.5 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
                  isSelected
                    ? 'bg-[#2C221E] text-white border-[#2C221E] shadow-sm ring-2 ring-[#2C221E]/10'
                    : 'bg-white border-[#EBE6DF] text-[#7B6E65] hover:bg-[#FAF7F2] hover:text-[#2C221E] hover:border-[#D7CEC7]'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-sm text-[#2C221E]">
            {selectedCategory}{' '}
            <span className="text-xs font-normal text-[#7B6E65]">
              ({filteredMenu.length} menu {isLoading ? 'memuat...' : 'ditemukan'})
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMenu.map((item) => {
            const isSoldOut = item.isAvailable === false;
            return (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-2xl shadow-xs border transition-all flex flex-col justify-between space-y-3 relative ${
                  isSoldOut
                    ? 'border-red-200 bg-stone-50/80 opacity-75'
                    : 'border-[#EBE6DF] hover:border-[#6E5545]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-bold text-xs ${
                        isSoldOut ? 'text-gray-500 line-through' : 'text-[#2C221E]'
                      }`}
                    >
                      {item.name}
                    </h3>
                    {isSoldOut && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-red-100 text-red-700 border border-red-200 shrink-0">
                        Sold Out
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] mt-0.5 font-semibold text-[#7B6E65]">{item.category}</p>
                  {item.description && (
                    <p className="text-[10px] text-[#A89F91] mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#EBE6DF]">
                  <span
                    className={`font-bold text-xs ${
                      isSoldOut ? 'text-gray-400' : 'text-[#2C221E]'
                    }`}
                  >
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => !isSoldOut && addToCart(item)}
                    disabled={isSoldOut}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                      isSoldOut
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-[#F5F2EC] hover:bg-[#6E5545] hover:text-white text-[#2C221E] border-[#EBE6DF] cursor-pointer'
                    }`}
                  >
                    {isSoldOut ? 'Habis' : '+ Tambah'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {filteredMenu.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EBE6DF] text-xs text-[#7B6E65]">
            {isLoading ? 'Memuat katalog menu dari database...' : 'Menu tidak ditemukan di kategori ini.'}
          </div>
        )}
      </div>
    </main>
  );
}