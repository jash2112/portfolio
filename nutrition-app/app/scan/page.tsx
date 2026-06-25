'use client';

import { useState, useRef, useCallback } from 'react';
import BottomNav from '@/components/BottomNav';
import { MacroBar } from '@/components/NutritionRing';
import { storage } from '@/lib/storage';
import { FoodItem, MealLog } from '@/lib/types';

type Mode = 'idle' | 'camera' | 'analyzing' | 'result';

export default function ScanPage() {
  const [mode, setMode] = useState<Mode>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<{ food: FoodItem; tips: string[]; ingredients: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [portionMult, setPortionMult] = useState(1);
  const [logged, setLogged] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setMode('camera');
    } catch {
      setError('Camera not available. Try uploading a photo.');
    }
  };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    analyzeImage(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCapturedImage(dataUrl);
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (dataUrl: string) => {
    setMode('analyzing');
    setError(null);
    setLogged(false);
    try {
      const base64 = dataUrl.split(',')[1];
      const mimeType = dataUrl.split(';')[0].split(':')[1];
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setResult(data);
      setPortionMult(1);
      setMode('result');
    } catch (err) {
      setError('Could not analyze the image. Please try again.');
      setMode('idle');
      console.error(err);
    }
  };

  const logMeal = () => {
    if (!result) return;
    const meal: MealLog = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      food: { ...result.food, imageUrl: capturedImage || undefined },
      portionMultiplier: portionMult,
      timestamp: Date.now(),
    };
    storage.addMeal(meal);
    setLogged(true);
  };

  const reset = () => {
    stopCamera();
    setMode('idle');
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setLogged(false);
  };

  const adj = result
    ? {
        calories: Math.round(result.food.nutrition.calories * portionMult),
        protein: Math.round(result.food.nutrition.protein * portionMult),
        carbs: Math.round(result.food.nutrition.carbs * portionMult),
        fat: Math.round(result.food.nutrition.fat * portionMult),
        fiber: Math.round(result.food.nutrition.fiber * portionMult),
      }
    : null;

  const goals = storage.getGoals();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Scan Food</h1>
        <p className="text-sm text-white/40 mt-0.5">Take a photo to get instant nutrition info</p>
      </div>

      {mode === 'idle' && (
        <div className="px-4 fade-in">
          {error && (
            <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Camera area */}
          <div className="aspect-video rounded-3xl glass-card border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center text-4xl">📷</div>
            <p className="text-white/50 text-sm">Point camera at your meal</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={startCamera}
              className="py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="text-xl">📸</span> Open Camera
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="py-4 rounded-2xl glass-card hover:border-white/20 text-white/70 font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="text-xl">🖼️</span> Upload Photo
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      )}

      {mode === 'camera' && (
        <div className="px-4 fade-in">
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {/* Corner guides */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 relative">
                {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((cls, i) => (
                  <div key={i} className={`absolute w-6 h-6 ${cls} border-white/80 rounded-sm`} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-violet-400/60 scan-line" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={reset} className="flex-1 py-4 rounded-2xl glass-card text-white/60 font-semibold transition-all active:scale-95">
              Cancel
            </button>
            <button
              onClick={capture}
              className="flex-[2] py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <div className="w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white" />
              </div>
              Capture
            </button>
          </div>
        </div>
      )}

      {mode === 'analyzing' && (
        <div className="px-4 fade-in">
          {capturedImage && (
            <div className="rounded-3xl overflow-hidden aspect-video mb-4 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full border-3 border-violet-400 border-t-transparent animate-spin" />
                <p className="text-white font-semibold">Analyzing with AI...</p>
                <p className="text-white/40 text-sm text-center px-8">Identifying dish, calculating nutrition values</p>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'result' && result && adj && (
        <div className="px-4 fade-in">
          {capturedImage && (
            <div className="rounded-3xl overflow-hidden aspect-video mb-4 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="Food" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl">{result.food.emoji}</p>
                    <h2 className="text-xl font-bold text-white">{result.food.name}</h2>
                    <p className="text-white/60 text-sm">{result.food.portionSize}</p>
                  </div>
                  {result.food.confidence && (
                    <div className="glass rounded-xl px-3 py-1.5 text-center">
                      <p className="text-white font-bold">{result.food.confidence}%</p>
                      <p className="text-white/50 text-xs">confidence</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Portion slider */}
          <div className="glass-card rounded-2xl p-4 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/60">Portion size</span>
              <span className="text-sm font-semibold text-violet-400">{portionMult}x</span>
            </div>
            <input
              type="range"
              min={0.25}
              max={3}
              step={0.25}
              value={portionMult}
              onChange={e => setPortionMult(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>¼x</span><span>½x</span><span>1x</span><span>2x</span><span>3x</span>
            </div>
          </div>

          {/* Nutrition */}
          <div className="glass-card rounded-2xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white/80">Nutrition Facts</h3>
              <span className="text-2xl font-bold text-violet-400">{adj.calories} kcal</span>
            </div>
            <div className="space-y-2.5">
              <MacroBar label="Protein" value={adj.protein} max={goals.protein} color="#34d399" />
              <MacroBar label="Carbohydrates" value={adj.carbs} max={goals.carbs} color="#60a5fa" />
              <MacroBar label="Fat" value={adj.fat} max={goals.fat} color="#f59e0b" />
              <MacroBar label="Fiber" value={adj.fiber} max={goals.fiber} color="#fb923c" />
            </div>
            {result.food.description && (
              <p className="text-xs text-white/30 mt-3 leading-relaxed">{result.food.description}</p>
            )}
          </div>

          {/* Tips */}
          {result.tips?.length > 0 && (
            <div className="glass-card rounded-2xl p-4 mb-3">
              <h3 className="font-semibold text-white/80 mb-2 flex items-center gap-2">
                <span>💡</span> Nutrition Tips
              </h3>
              <ul className="space-y-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-white/50 flex gap-2">
                    <span className="text-violet-400 shrink-0">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button onClick={reset} className="flex-1 py-4 rounded-2xl glass-card text-white/60 font-semibold transition-all active:scale-95">
              Rescan
            </button>
            <button
              onClick={logMeal}
              disabled={logged}
              className={`flex-[2] py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                logged
                  ? 'bg-emerald-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-500 text-white'
              }`}
            >
              {logged ? '✓ Logged to diary' : 'Log Meal'}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
