'use client';

import { useState, useEffect, useRef } from 'react';
import BottomNav from '@/components/BottomNav';
import { storage } from '@/lib/storage';
import { PantryItem } from '@/lib/types';

const UNITS = ['g', 'kg', 'oz', 'lbs', 'cup', 'tbsp', 'tsp', 'ml', 'L', 'count', 'piece'];
const CATEGORIES = ['Protein', 'Produce', 'Dairy', 'Grains', 'Pantry', 'Spices', 'Other'];
const CAT_EMOJI: Record<string, string> = {
  Protein: '🥩', Produce: '🥬', Dairy: '🥛', Grains: '🌾',
  Pantry: '🥫', Spices: '🧂', Other: '📦',
};

type AnalysisState = 'idle' | 'capturing' | 'analyzing' | 'done';

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [analysisResult, setAnalysisResult] = useState<{
    identifiedDish?: string;
    usedIngredients: string[];
    remainingIngredients: { name: string; estimatedAmount: string }[];
    observations?: string;
  } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'g', category: 'Other', expiryDate: '' });
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setItems(storage.getPantry());
  }, []);

  const refresh = () => setItems(storage.getPantry());

  const addItem = () => {
    if (!newItem.name.trim()) return;
    const item: PantryItem = {
      id: `p-${Date.now()}`,
      name: newItem.name.trim(),
      quantity: newItem.quantity,
      unit: newItem.unit,
      category: newItem.category,
      expiryDate: newItem.expiryDate || undefined,
    };
    storage.addPantryItem(item);
    setNewItem({ name: '', quantity: 1, unit: 'g', category: 'Other', expiryDate: '' });
    setShowAdd(false);
    refresh();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setAnalysisState('capturing');
    } catch {
      fileRef.current?.click();
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.8);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCapturedImage(dataUrl);
    analyzePantry(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setCapturedImage(url);
      analyzePantry(url);
    };
    reader.readAsDataURL(file);
  };

  const analyzePantry = async (dataUrl?: string) => {
    setAnalysisState('analyzing');
    try {
      const body: Record<string, unknown> = { pantryItems: items };
      if (dataUrl) {
        body.imageBase64 = dataUrl.split(',')[1];
        body.mimeType = dataUrl.split(';')[0].split(':')[1];
      }
      const res = await fetch('/api/analyze-pantry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setAnalysisResult(data);
      setAnalysisState('done');

      if (data.remainingIngredients?.length > 0 && dataUrl) {
        data.remainingIngredients.forEach((ri: { name: string; estimatedAmount: string }) => {
          const existing = items.find(i => i.name.toLowerCase().includes(ri.name.toLowerCase()));
          if (!existing) {
            const amtMatch = ri.estimatedAmount.match(/([\d.]+)\s*(\w+)/);
            storage.addPantryItem({
              id: `p-auto-${Date.now()}-${Math.random()}`,
              name: ri.name,
              quantity: amtMatch ? parseFloat(amtMatch[1]) : 1,
              unit: amtMatch ? amtMatch[2] : 'unit',
              category: 'Other',
            });
          }
        });
        refresh();
      }
    } catch {
      setAnalysisState('idle');
    }
  };

  const categorized = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat);
    return acc;
  }, {} as Record<string, PantryItem[]>);

  const isExpiringSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const diff = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Pantry</h1>
        <p className="text-sm text-white/40 mt-0.5">Track ingredients & analyze what you have</p>
      </div>

      <div className="px-4">
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setShowAdd(true)}
            className="py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>+</span> Add Ingredient
          </button>
          <button
            onClick={startCamera}
            className="py-3 rounded-xl glass-card hover:border-white/20 text-white/70 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>🔍</span> AI Analyze
          </button>
        </div>

        {/* Camera capture */}
        {analysisState === 'capturing' && (
          <div className="mb-4 fade-in">
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-black mb-3">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); setAnalysisState('idle'); }} className="flex-1 py-3 rounded-xl glass-card text-white/60 font-semibold">Cancel</button>
              <button onClick={capture} className="flex-[2] py-3 rounded-xl bg-violet-600 text-white font-bold">Capture Pantry</button>
            </div>
          </div>
        )}

        {analysisState === 'analyzing' && (
          <div className="glass-card rounded-3xl p-6 mb-4 text-center fade-in">
            <div className="w-12 h-12 rounded-full border-3 border-violet-400 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-white font-semibold">Analyzing pantry...</p>
            <p className="text-white/40 text-sm mt-1">AI is identifying ingredients and remaining amounts</p>
          </div>
        )}

        {analysisState === 'done' && analysisResult && (
          <div className="glass-card rounded-3xl p-4 mb-4 fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white flex items-center gap-2"><span>🤖</span> AI Analysis</h3>
              <button onClick={() => setAnalysisState('idle')} className="text-white/30 hover:text-white text-xl">×</button>
            </div>
            {analysisResult.identifiedDish && (
              <div className="mb-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs text-violet-400 font-medium">Identified Dish</p>
                <p className="text-white font-semibold mt-0.5">{analysisResult.identifiedDish}</p>
              </div>
            )}
            {analysisResult.usedIngredients?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-white/40 font-semibold uppercase mb-2">Used Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.usedIngredients.map((ing, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">{ing}</span>
                  ))}
                </div>
              </div>
            )}
            {analysisResult.remainingIngredients?.length > 0 && (
              <div>
                <p className="text-xs text-white/40 font-semibold uppercase mb-2">Remaining</p>
                <div className="space-y-1.5">
                  {analysisResult.remainingIngredients.map((ri, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">{ri.name}</span>
                      <span className="text-emerald-400">{ri.estimatedAmount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analysisResult.observations && (
              <p className="text-xs text-white/30 mt-3 leading-relaxed">{analysisResult.observations}</p>
            )}
          </div>
        )}

        {/* Stats */}
        {items.length > 0 && (
          <div className="glass-card rounded-2xl p-3 mb-4 flex gap-4 text-center">
            <div className="flex-1">
              <p className="text-xl font-bold text-white">{items.length}</p>
              <p className="text-xs text-white/40">ingredients</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1">
              <p className="text-xl font-bold text-amber-400">{items.filter(i => isExpiringSoon(i.expiryDate)).length}</p>
              <p className="text-xs text-white/40">expiring soon</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1">
              <p className="text-xl font-bold text-blue-400">{CATEGORIES.filter(c => categorized[c]?.length > 0).length}</p>
              <p className="text-xs text-white/40">categories</p>
            </div>
          </div>
        )}

        {/* Items by category */}
        {items.length === 0 && analysisState === 'idle' && (
          <div className="text-center py-16 text-white/30">
            <p className="text-4xl mb-3">🥫</p>
            <p>Pantry is empty</p>
            <p className="text-sm mt-1">Add ingredients or use AI to scan your pantry</p>
          </div>
        )}

        <div className="space-y-4">
          {CATEGORIES.map(cat => {
            const catItems = categorized[cat];
            if (!catItems?.length) return null;
            return (
              <div key={cat}>
                <h3 className="text-xs text-white/40 uppercase font-semibold tracking-wider mb-2 flex items-center gap-2">
                  <span>{CAT_EMOJI[cat]}</span> {cat}
                </h3>
                <div className="space-y-2">
                  {catItems.map(item => (
                    <PantryRow key={item.id} item={item} isExpiring={isExpiringSoon(item.expiryDate)}
                      onDelete={() => { storage.removePantryItem(item.id); refresh(); }}
                      onUpdate={(qty) => { storage.updatePantryItem(item.id, { quantity: qty }); refresh(); }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-4">
          <div className="w-full max-w-lg glass rounded-3xl p-5 slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-lg">Add Ingredient</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-white/50">×</button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Ingredient name"
                value={newItem.name}
                onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-violet-500/50"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={e => setNewItem(p => ({ ...p, quantity: Number(e.target.value) }))}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50"
                />
                <select
                  value={newItem.unit}
                  onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50"
                >
                  {UNITS.map(u => <option key={u} value={u} className="bg-zinc-900">{u}</option>)}
                </select>
              </div>
              <select
                value={newItem.category}
                onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
              </select>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={e => setNewItem(p => ({ ...p, expiryDate: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50"
                />
              </div>
              <button onClick={addItem} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all">
                Add to Pantry
              </button>
            </div>
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      <BottomNav />
    </div>
  );
}

function PantryRow({ item, isExpiring, onDelete, onUpdate }: {
  item: PantryItem;
  isExpiring: boolean;
  onDelete: () => void;
  onUpdate: (qty: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [qty, setQty] = useState(item.quantity);

  return (
    <div className={`glass-card rounded-xl p-3 flex items-center gap-3 ${isExpiring ? 'border-amber-500/30' : ''}`}>
      <span className="text-xl shrink-0">{CAT_EMOJI[item.category] || '📦'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90">{item.name}</p>
        {item.expiryDate && (
          <p className={`text-xs ${isExpiring ? 'text-amber-400' : 'text-white/30'}`}>
            {isExpiring ? '⚠️ Expires ' : 'Expires '}{item.expiryDate}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-16 bg-white/10 rounded-lg px-2 py-1 text-white text-sm outline-none text-center"
            />
            <button onClick={() => { onUpdate(qty); setEditing(false); }} className="text-emerald-400 text-xs px-2 py-1 rounded-lg bg-emerald-500/10">✓</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-xs text-white/50 hover:text-white/80 px-2 py-1 rounded-lg hover:bg-white/5 font-medium">
            {item.quantity} {item.unit}
          </button>
        )}
        <button onClick={onDelete} className="w-6 h-6 rounded-full hover:bg-red-500/20 flex items-center justify-center text-white/20 hover:text-red-400 transition-all text-xs">×</button>
      </div>
    </div>
  );
}
