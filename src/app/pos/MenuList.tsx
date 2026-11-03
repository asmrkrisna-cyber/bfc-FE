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
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* KATEGORI SCROLL HORIZONTAL & SEARCH SEJAJAR */}
      <div className="flex flex-row items-start justify-between gap-3 w-full">
        {/* Kategori Pills dengan Bar Geser (Scrollbar) */}
        <div 
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto scroll-smooth pb-1.5"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 px-4 flex items-center justify-center rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#2C221E] text-white border-[#2C221E] shadow-xs'
                  : 'bg-white border-[#EBE6DF] text-[#7B6E65] hover:bg-[#FAF7F2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input & Refresh Button */}
        <div className="flex items-center gap-2 shrink-0 w-64 md:w-72 lg:w-80 pt-0.5">
          <div className="relative flex-1 min-w-0">
            <SearchIcon className="w-3.5 h-3.5 text-[#A89F91] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder={selectedCategory === 'Semua' ? 'Cari semua menu...' : `Cari di ${selectedCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#EBE6DF] rounded-xl text-xs text-[#2C221E] outline-none focus:border-[#6E5545] shadow-xs placeholder:text-gray-400"
            />
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Perbarui data menu dari server"
              disabled={isLoading}
              className="h-9 px-3.5 bg-white hover:bg-[#F5F2EC] border border-[#EBE6DF] rounded-xl text-xs font-bold text-[#6E5545] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshIcon className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
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