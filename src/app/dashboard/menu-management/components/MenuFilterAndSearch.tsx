'use client';

interface MenuFilterAndSearchProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function MenuFilterAndSearch({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: MenuFilterAndSearchProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white font-bold shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="w-full md:w-64">
        <input
          type="text"
          placeholder="Cari nama menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-gray-900 rounded-xl text-xs text-gray-800 outline-none transition-all shadow-sm"
        />
      </div>
    </div>
  );
}