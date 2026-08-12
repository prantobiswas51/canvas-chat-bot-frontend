import React, { useState } from 'react';
import { MOCK_INVENTORY } from '@/services/inventoryService';
import { Product } from '@/types/inventory';
import Table, { Column } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Search, Plus } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Acrylic Paints', 'Watercolors', 'Oil Paints', 'Brushes & Tools', 'Canvases & Surfaces'];

  const filteredProducts = MOCK_INVENTORY.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.sku.toLowerCase().includes(search.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const columns: Column<Product>[] = [
    {
      header: 'SKU Code',
      accessorKey: 'sku',
      cell: (item) => <span className="font-mono text-xs text-indigo-500 dark:text-indigo-400 font-semibold">{item.sku}</span>,
    },
    {
      header: 'Product Name & Category',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
            />
          )}
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block text-sm">{item.name}</span>
            <span className="text-xs text-slate-500">{item.category}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Price (BDT)',
      cell: (item) => <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{item.price}</span>,
    },
    {
      header: 'Stock Status',
      cell: (item) => (
        <Badge variant={item.stock > 25 ? 'success' : item.stock > 0 ? 'warning' : 'danger'} size="sm" dot>
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
        </Badge>
      ),
    },
    {
      header: 'Recommended Medium',
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.mediumRecommended?.map((med) => (
            <span key={med} className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
              {med}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Canvas Inventory Database</h1>
          <p className="text-xs text-slate-500">
            Real-time stock levels synced directly with Canvas AI Customer Service chatbot
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Add Product SKU
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/60 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search SKU, product name, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <Table columns={columns} data={filteredProducts} keyExtractor={(item) => item.id} />
    </div>
  );
};

export default InventoryPage;
