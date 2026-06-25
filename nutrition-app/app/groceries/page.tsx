'use client';

import { useState, useEffect, useRef } from 'react';
import BottomNav from '@/components/BottomNav';
import { storage } from '@/lib/storage';
import { GroceryItem, Receipt } from '@/lib/types';

type Tab = 'list' | 'receipts';
type Source = 'walmart' | 'doordash' | 'manual';

const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Grains', 'Frozen', 'Beverages', 'Snacks', 'Other'];
const CATEGORY_EMOJI: Record<string, string> = {
  Produce: '🥬', Protein: '🥩', Dairy: '🥛', Grains: '🌾',
  Frozen: '🧊', Beverages: '🧃', Snacks: '🍪', Other: '🛍️',
};

const MOCK_WALMART_ITEMS: Partial<GroceryItem>[] = [
  { name: 'Chicken Breast', quantity: 2, unit: 'lbs', category: 'Protein', price: 9.48, source: 'walmart' },
  { name: 'Broccoli', quantity: 1, unit: 'head', category: 'Produce', price: 1.98, source: 'walmart' },
  { name: 'Brown Rice', quantity: 1, unit: 'bag', category: 'Grains', price: 3.48, source: 'walmart' },
  { name: 'Greek Yogurt', quantity: 2, unit: 'containers', category: 'Dairy', price: 5.96, source: 'walmart' },
  { name: 'Eggs', quantity: 12, unit: 'count', category: 'Dairy', price: 4.28, source: 'walmart' },
  { name: 'Spinach', quantity: 1, unit: 'bag', category: 'Produce', price: 3.47, source: 'walmart' },
  { name: 'Oats', quantity: 1, unit: 'container', category: 'Grains', price: 4.18, source: 'walmart' },
  { name: 'Almonds', quantity: 1, unit: 'bag', category: 'Snacks', price: 7.98, source: 'walmart' },
];

const MOCK_DOORDASH_ITEMS: Partial<GroceryItem>[] = [
  { name: 'Avocados', quantity: 3, unit: 'count', category: 'Produce', price: 4.99, source: 'doordash' },
  { name: 'Salmon Fillet', quantity: 1, unit: 'lb', category: 'Protein', price: 12.99, source: 'doordash' },
  { name: 'Whole Milk', quantity: 1, unit: 'gallon', category: 'Dairy', price: 5.49, source: 'doordash' },
  { name: 'Sweet Potatoes', quantity: 2, unit: 'lbs', category: 'Produce', price: 3.99, source: 'doordash' },
];

export default function GroceriesPage() {
  const [tab, setTab] = useState<Tab>('list');
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importSource, setImportSource] = useState<Source>('walmart');
  const [filter, setFilter] = useState<string>('All');
  const [receiptText, setReceiptText] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'item', category: 'Other' });

  useEffect(() => {
    setItems(storage.getGroceries());
    setReceipts(storage.getReceipts());
  }, []);

  const refresh = () => {
    setItems(storage.getGroceries());
    setReceipts(storage.getReceipts());
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    const item: GroceryItem = {
      id: `g-${Date.now()}`,
      name: newItem.name.trim(),
      quantity: newItem.quantity,
      unit: newItem.unit,
      category: newItem.category,
      source: 'manual',
      purchased: false,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    storage.addGrocery(item);
    setNewItem({ name: '', quantity: 1, unit: 'item', category: 'Other' });
    setShowAdd(false);
    refresh();
  };

  const importFromStore = (source: Source) => {
    const mockItems = source === 'walmart' ? MOCK_WALMART_ITEMS : MOCK_DOORDASH_ITEMS;
    const date = new Date().toISOString().split('T')[0];
    const receiptItems: GroceryItem[] = mockItems.map((item, i) => ({
      id: `g-${Date.now()}-${i}`,
      name: item.name!,
      quantity: item.quantity!,
      unit: item.unit!,
      category: item.category!,
      price: item.price,
      source,
      purchased: true,
      dateAdded: date,
    }));

    const receipt: Receipt = {
      id: `r-${Date.now()}`,
      source,
      date,
      items: receiptItems,
      total: receiptItems.reduce((s, i) => s + (i.price || 0), 0),
      storeName: source === 'walmart' ? 'Walmart Supercenter' : 'DoorDash Grocery',
    };

    storage.addReceipt(receipt);
    receiptItems.forEach(item => storage.addGrocery(item));
    setShowImport(false);
    refresh();
  };

  const parseReceiptText = () => {
    if (!receiptText.trim()) return;
    const lines = receiptText.split('\n').filter(l => l.trim());
    const parsed: GroceryItem[] = [];
    const date = new Date().toISOString().split('T')[0];

    lines.forEach((line, i) => {
      const priceMatch = line.match(/\$?([\d.]+)$/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : undefined;
      const name = line.replace(/\$?[\d.]+$/, '').trim();
      if (name.length > 2) {
        parsed.push({
          id: `g-${Date.now()}-${i}`,
          name,
          quantity: 1,
          unit: 'item',
          category: 'Other',
          price,
          source: importSource,
          purchased: true,
          dateAdded: date,
        });
      }
    });

    if (parsed.length > 0) {
      const receipt: Receipt = {
        id: `r-${Date.now()}`,
        source: importSource,
        date,
        items: parsed,
        total: parsed.reduce((s, i) => s + (i.price || 0), 0),
        storeName: `${importSource.charAt(0).toUpperCase() + importSource.slice(1)} Receipt`,
      };
      storage.addReceipt(receipt);
      parsed.forEach(item => storage.addGrocery(item));
    }

    setReceiptText('');
    setShowImport(false);
    refresh();
  };

  const categories = ['All', ...CATEGORIES];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);
  const unpurchased = filtered.filter(i => !i.purchased);
  const purchased = filtered.filter(i => i.purchased);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Groceries</h1>
        <p className="text-sm text-white/40 mt-0.5">Track your shopping & receipts</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 p-1 glass-card rounded-2xl">
          {(['list', 'receipts'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t ? 'bg-violet-600 text-white' : 'text-white/40'
              }`}
            >
              {t === 'list' ? '📋 List' : '🧾 Receipts'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'list' && (
        <div className="px-4">
          {/* Action bar */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowAdd(true)}
              className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>+</span> Add Item
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="flex-1 py-3 rounded-xl glass-card hover:border-white/20 text-white/70 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>🛒</span> Import Receipt
            </button>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === cat ? 'bg-violet-600 text-white' : 'glass-card text-white/50'
                }`}
              >
                {cat !== 'All' ? CATEGORY_EMOJI[cat] : ''} {cat}
              </button>
            ))}
          </div>

          {/* Summary bar */}
          {items.length > 0 && (
            <div className="glass-card rounded-2xl p-3 mb-4 flex gap-4 text-center">
              <div className="flex-1">
                <p className="text-xl font-bold text-white">{unpurchased.length}</p>
                <p className="text-xs text-white/40">to buy</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex-1">
                <p className="text-xl font-bold text-emerald-400">{purchased.length}</p>
                <p className="text-xs text-white/40">purchased</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex-1">
                <p className="text-xl font-bold text-blue-400">
                  ${items.reduce((s, i) => s + (i.price || 0), 0).toFixed(2)}
                </p>
                <p className="text-xs text-white/40">total</p>
              </div>
            </div>
          )}

          {/* Lists */}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <p className="text-4xl mb-3">🛒</p>
              <p>No items yet</p>
              <p className="text-sm mt-1">Add items or import a receipt</p>
            </div>
          )}

          {unpurchased.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs text-white/40 uppercase font-semibold tracking-wider mb-2">To Buy</h3>
              <div className="space-y-2">
                {unpurchased.map(item => (
                  <GroceryRow key={item.id} item={item} onToggle={() => { storage.toggleGrocery(item.id); refresh(); }} onDelete={() => { storage.removeGrocery(item.id); refresh(); }} />
                ))}
              </div>
            </div>
          )}

          {purchased.length > 0 && (
            <div>
              <h3 className="text-xs text-white/40 uppercase font-semibold tracking-wider mb-2">Purchased</h3>
              <div className="space-y-2">
                {purchased.map(item => (
                  <GroceryRow key={item.id} item={item} onToggle={() => { storage.toggleGrocery(item.id); refresh(); }} onDelete={() => { storage.removeGrocery(item.id); refresh(); }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'receipts' && (
        <div className="px-4">
          {receipts.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <p className="text-4xl mb-3">🧾</p>
              <p>No receipts yet</p>
              <p className="text-sm mt-1">Import from Walmart or DoorDash</p>
              <button
                onClick={() => { setTab('list'); setShowImport(true); }}
                className="mt-4 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm"
              >
                Import Receipt
              </button>
            </div>
          )}
          <div className="space-y-3">
            {receipts.map(receipt => (
              <div key={receipt.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${receipt.source === 'walmart' ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                      {receipt.source === 'walmart' ? '🏪' : '🚗'}
                    </div>
                    <div>
                      <p className="font-semibold text-white/90">{receipt.storeName}</p>
                      <p className="text-xs text-white/40">{receipt.date}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-white">${receipt.total.toFixed(2)}</p>
                </div>
                <div className="space-y-1.5">
                  {receipt.items.slice(0, 4).map(item => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-white/60">{item.quantity} {item.unit} {item.name}</span>
                      {item.price && <span className="text-white/40">${item.price.toFixed(2)}</span>}
                    </div>
                  ))}
                  {receipt.items.length > 4 && (
                    <p className="text-xs text-violet-400">+{receipt.items.length - 4} more items</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAdd && (
        <Modal title="Add Item" onClose={() => setShowAdd(false)}>
          <div className="space-y-3">
            <input
              placeholder="Item name"
              value={newItem.name}
              onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-violet-500/50"
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Qty"
                value={newItem.quantity}
                onChange={e => setNewItem(p => ({ ...p, quantity: Number(e.target.value) }))}
                className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50"
              />
              <input
                placeholder="Unit (lbs, cups…)"
                value={newItem.unit}
                onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-violet-500/50"
              />
            </div>
            <select
              value={newItem.category}
              onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50"
            >
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
            </select>
            <button onClick={addItem} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all">
              Add to List
            </button>
          </div>
        </Modal>
      )}

      {/* Import Modal */}
      {showImport && (
        <Modal title="Import Receipt" onClose={() => setShowImport(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(['walmart', 'doordash'] as Source[]).map(s => (
                <button
                  key={s}
                  onClick={() => setImportSource(s)}
                  className={`py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    importSource === s ? (s === 'walmart' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white') : 'glass-card text-white/50'
                  }`}
                >
                  {s === 'walmart' ? '🏪 Walmart' : '🚗 DoorDash'}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-white/50">Paste receipt text (item name + price per line)</p>
              <textarea
                placeholder={`Chicken Breast 9.48\nBroccoli 1.98\nBrown Rice 3.48`}
                value={receiptText}
                onChange={e => setReceiptText(e.target.value)}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-violet-500/50 resize-none"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={parseReceiptText}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all"
              >
                Import from Text
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">or use demo data</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button
                onClick={() => importFromStore(importSource)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  importSource === 'walmart'
                    ? 'bg-blue-600/80 hover:bg-blue-600 text-white'
                    : 'bg-red-600/80 hover:bg-red-600 text-white'
                }`}
              >
                Load Demo {importSource === 'walmart' ? 'Walmart' : 'DoorDash'} Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
}

function GroceryRow({ item, onToggle, onDelete }: { item: GroceryItem; onToggle: () => void; onDelete: () => void }) {
  const sourceColor = item.source === 'walmart' ? 'bg-blue-500/20 text-blue-400' : item.source === 'doordash' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/30';
  return (
    <div className={`glass-card rounded-xl p-3 flex items-center gap-3 transition-all ${item.purchased ? 'opacity-50' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          item.purchased ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-white/40'
        }`}
      >
        {item.purchased && <span className="text-white text-xs">✓</span>}
      </button>
      <span className="text-lg shrink-0">{CATEGORY_EMOJI[item.category] || '🛍️'}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${item.purchased ? 'line-through text-white/40' : 'text-white/90'}`}>{item.name}</p>
        <p className="text-xs text-white/30">{item.quantity} {item.unit}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.price && <span className="text-xs text-white/40">${item.price.toFixed(2)}</span>}
        {item.source && item.source !== 'manual' && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${sourceColor}`}>
            {item.source}
          </span>
        )}
        <button onClick={onDelete} className="w-6 h-6 rounded-full hover:bg-red-500/20 flex items-center justify-center text-white/20 hover:text-red-400 transition-all text-xs">
          ×
        </button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-4">
      <div className="w-full max-w-lg glass rounded-3xl p-5 slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-white/50 hover:text-white">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
