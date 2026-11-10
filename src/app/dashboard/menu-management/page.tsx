'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { CATEGORIES, MenuItem } from '@/data/menuData';
import { API_BASE_URL } from '@/utils/api';

import MenuFilterAndSearch from './components/MenuFilterAndSearch';
import MenuCard from './components/MenuCard';
import MenuFormModal from './components/MenuFormModal';
import DeleteMenuModal from './components/DeleteMenuModal';

export default function MenuManagementPage() {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Espresso Based',
    price: '',
    description: '',
  });

  const loadMenuList = () => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setMenuList(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Gagal memuat produk dari server:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    fetch(`${API_BASE_URL}/products`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setMenuList(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Gagal memuat produk dari server:', err);
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleStatus = async (id: string) => {
    // Optimistic UI update
    setMenuList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );

    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        // Rollback jika gagal
        loadMenuList();
      }
    } catch (err) {
      console.error('Gagal toggle status produk:', err);
      loadMenuList();
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Espresso Based', price: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName || !/^[a-zA-Z\s]+$/.test(trimmedName)) {
      alert('Nama menu hanya boleh berupa huruf alfabet (tidak boleh angka atau simbol).');
      return;
    }

    const numericPrice = Number(formData.price);
    if (!formData.price || isNaN(numericPrice) || numericPrice <= 0) {
      alert('Harga menu harus berupa angka yang valid dan lebih dari 0.');
      return;
    }

    try {
      if (editingItem) {
        const res = await fetch(`${API_BASE_URL}/products/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            category: formData.category,
            price: numericPrice,
            description: formData.description,
            isAvailable: editingItem.isAvailable,
          }),
        });

        if (res.ok) {
          loadMenuList();
          setIsModalOpen(false);
        } else {
          alert('Gagal memperbarui produk di server.');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            category: formData.category,
            price: numericPrice,
            description: formData.description,
          }),
        });

        if (res.ok) {
          loadMenuList();
          setIsModalOpen(false);
        } else {
          alert('Gagal menambahkan produk baru.');
        }
      }
    } catch (err) {
      console.error('Gagal menyimpan menu:', err);
      alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  const confirmDeleteMenu = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/products/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMenuList((prev) => prev.filter((item) => item.id !== deleteId));
      } else {
        alert('Gagal menghapus produk dari server.');
      }
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const dynamicCategories = [
    'Semua',
    ...Array.from(
      new Set([
        ...CATEGORIES.filter((c) => c !== 'Semua'),
        ...menuList.map((m) => m.category),
      ])
    ).filter(Boolean),
  ];

  const filteredMenu = menuList.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-4 md:p-6 pl-14 md:pl-16 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Menu</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola katalog produk, harga, dan atur status <span className="font-semibold text-orange-600">Sold Out</span> secara langsung dari database MySQL.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-fit"
          >
            <span>+</span> Tambah Menu Baru
          </button>
        </header>

        <main className="p-6 md:p-8 space-y-6">
          <MenuFilterAndSearch
            categories={dynamicCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {isLoading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500">Memuat katalog menu dari database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenu.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onToggleStatus={handleToggleStatus}
                  onOpenEditModal={handleOpenEditModal}
                  onDeleteRequest={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredMenu.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500">Tidak ada menu yang ditemukan.</p>
            </div>
          )}
        </main>
      </div>

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        categories={dynamicCategories}
        handleSaveMenu={handleSaveMenu}
      />

      {deleteId && (
        <DeleteMenuModal
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDeleteMenu}
        />
      )}
    </div>
  );
}
