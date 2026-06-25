'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { storage, getTodayNutrition } from '@/lib/storage';
import { Suggestion, DailyGoals } from '@/lib/types';
import { MacroBar } from '@/components/NutritionRing';

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<DailyGoals>(storage.getGoals());
  const [consumed, setConsumed] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const [editGoals, setEditGoals] = useState(false);
  const [goalDraft, setGoalDraft] = useState(goals);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const meals = storage.getTodayMeals();
    setConsumed(getTodayNutrition(meals));
    setGoals(storage.getGoals());
  }, []);

  const remaining = {
    calories: Math.max(0, goals.calories - consumed.calories),
    protein: Math.max(0, goals.protein - consumed.protein),
    carbs: Math.max(0, goals.carbs - consumed.carbs),
    fat: Math.max(0, goals.fat - consumed.fat),
    fiber: Math.max(0, goals.fiber - consumed.fiber),
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const pantryItems = storage.getPantry();
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consumed,
          goals,
          pantryItems,
          remainingCalories: remaining.calories,
        }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = () => {
    storage.saveGoals(goalDraft);
    setGoals(goalDraft);
    setEditGoals(false);
  };

  const prot_pct = Math.round((consumed.protein / goals.protein) * 100);
  const cal_pct = Math.round((consumed.calories / goals.calories) * 100);
  const isProteinLow = prot_pct < 60;
  const isCalLow = cal_pct < 60;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Tips</h1>
          <p className="text-sm text-white/40 mt-0.5">Personalized nutrition suggestions</p>
        </div>
        <button
          onClick={() => { setGoalDraft(goals); setEditGoals(true); }}
          className="glass-card px-3 py-2 rounded-xl text-xs text-white/60 font-medium hover:border-white/20 transition-all"
        >
          Goals ⚙️
        </button>
      </div>

      <div className="px-4">
        {/* Today's summary */}
        <div className="glass-card rounded-3xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Today&apos;s Progress</h2>
          <div className="space-y-3">
            <MacroBar label="Calories" value={consumed.calories} max={goals.calories} color="#a78bfa" unit=" kcal" />
            <MacroBar label="Protein" value={consumed.protein} max={goals.protein} color="#34d399" />
            <MacroBar label="Carbs" value={consumed.carbs} max={goals.carbs} color="#60a5fa" />
            <MacroBar label="Fat" value={consumed.fat} max={goals.fat} color="#f59e0b" />
            <MacroBar label="Fiber" value={consumed.fiber} max={goals.fiber} color="#fb923c" />
          </div>
        </div>

        {/* Gap alerts */}
        <div className="space-y-2 mb-4">
          {isProteinLow && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <span className="text-xl">💪</span>
              <div>
                <p className="text-sm font-semibold text-emerald-400">Protein gap</p>
                <p className="text-xs text-white/50">Still need {Math.round(remaining.protein)}g more protein today</p>
              </div>
            </div>
          )}
          {isCalLow && (
            <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-sm font-semibold text-violet-400">Calorie gap</p>
                <p className="text-xs text-white/50">{Math.round(remaining.calories)} kcal remaining to reach your goal</p>
              </div>
            </div>
          )}
          {remaining.fiber > 10 && (
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
              <span className="text-xl">🌿</span>
              <div>
                <p className="text-sm font-semibold text-orange-400">Fiber gap</p>
                <p className="text-xs text-white/50">Need {Math.round(remaining.fiber)}g more fiber — try veggies or legumes</p>
              </div>
            </div>
          )}
        </div>

        {/* Remaining breakdown */}
        <div className="glass-card rounded-2xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-white/60 mb-3">Remaining for Today</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Calories', value: remaining.calories, unit: 'kcal', color: 'text-violet-400' },
              { label: 'Protein', value: remaining.protein, unit: 'g', color: 'text-emerald-400' },
              { label: 'Carbs', value: remaining.carbs, unit: 'g', color: 'text-blue-400' },
              { label: 'Fiber', value: remaining.fiber, unit: 'g', color: 'text-orange-400' },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="bg-white/[0.03] rounded-xl p-3">
                <p className={`text-lg font-bold ${color}`}>{Math.round(value)}<span className="text-xs font-normal text-white/30 ml-1">{unit}</span></p>
                <p className="text-xs text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Get suggestions button */}
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 mb-4"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Generating suggestions...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Get AI Suggestions</span>
            </>
          )}
        </button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Recommended for You</h2>
            {suggestions.map((s, i) => (
              <SuggestionCard
                key={i}
                suggestion={s}
                isOpen={expanded === s.name}
                onToggle={() => setExpanded(expanded === s.name ? null : s.name)}
              />
            ))}
          </div>
        )}

        {suggestions.length === 0 && !loading && (
          <div className="text-center py-8 text-white/20">
            <p className="text-4xl mb-2">✨</p>
            <p className="text-sm">Tap the button above for personalized meal suggestions based on your remaining nutritional needs</p>
          </div>
        )}
      </div>

      {/* Goals modal */}
      {editGoals && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-4">
          <div className="w-full max-w-lg glass rounded-3xl p-5 slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-lg">Daily Goals</h3>
              <button onClick={() => setEditGoals(false)} className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-white/50">×</button>
            </div>
            <div className="space-y-3">
              {([
                { key: 'calories', label: 'Calories (kcal)', min: 1000, max: 5000, step: 50 },
                { key: 'protein', label: 'Protein (g)', min: 40, max: 300, step: 5 },
                { key: 'carbs', label: 'Carbohydrates (g)', min: 50, max: 500, step: 10 },
                { key: 'fat', label: 'Fat (g)', min: 20, max: 200, step: 5 },
                { key: 'fiber', label: 'Fiber (g)', min: 10, max: 60, step: 1 },
              ] as const).map(({ key, label, min, max, step }) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-white/60">{label}</label>
                    <span className="text-xs text-violet-400 font-semibold">{goalDraft[key]}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={goalDraft[key]}
                    onChange={e => setGoalDraft(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full accent-violet-500"
                  />
                </div>
              ))}
              <button onClick={saveGoals} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold mt-2 transition-all">
                Save Goals
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function SuggestionCard({ suggestion, isOpen, onToggle }: { suggestion: Suggestion; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all fade-in">
      <button className="w-full p-4 text-left" onClick={onToggle}>
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">{suggestion.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white/90 leading-tight">{suggestion.name}</h3>
            <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{suggestion.description}</p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs text-violet-400 font-semibold">{suggestion.nutrition.calories} kcal</span>
              <span className="text-xs text-emerald-400">{suggestion.nutrition.protein}g protein</span>
              <span className="text-xs text-white/30">⏱ {suggestion.prepTime}</span>
            </div>
          </div>
          <span className={`text-white/30 text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 fade-in border-t border-white/5 pt-3 space-y-3">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-xs text-violet-400 font-medium mb-1">Why this?</p>
            <p className="text-xs text-white/60 leading-relaxed">{suggestion.reason}</p>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Protein', v: suggestion.nutrition.protein, c: '#34d399' },
              { label: 'Carbs', v: suggestion.nutrition.carbs, c: '#60a5fa' },
              { label: 'Fat', v: suggestion.nutrition.fat, c: '#f59e0b' },
              { label: 'Fiber', v: suggestion.nutrition.fiber, c: '#fb923c' },
            ].map(({ label, v, c }) => (
              <div key={label} className="bg-white/[0.03] rounded-lg p-2 text-center">
                <p className="text-sm font-bold" style={{ color: c }}>{v}g</p>
                <p className="text-xs text-white/30">{label}</p>
              </div>
            ))}
          </div>

          {suggestion.ingredients?.length > 0 && (
            <div>
              <p className="text-xs text-white/40 font-semibold uppercase mb-2">Ingredients</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestion.ingredients.map((ing, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/50">{ing}</span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              const meal = {
                id: `meal-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                food: {
                  id: `food-${Date.now()}`,
                  name: suggestion.name,
                  emoji: suggestion.emoji,
                  portionSize: '1 serving',
                  nutrition: suggestion.nutrition,
                },
                portionMultiplier: 1,
                timestamp: Date.now(),
              };
              storage.addMeal(meal);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-sm transition-all"
          >
            Log this meal
          </button>
        </div>
      )}
    </div>
  );
}
