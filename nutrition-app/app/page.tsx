'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { NutritionRing, MacroBar } from '@/components/NutritionRing';
import { storage, getTodayNutrition } from '@/lib/storage';
import { MealLog, USUAL_FOODS, FoodItem } from '@/lib/types';

export default function HomePage() {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [goals, setGoals] = useState(storage.getGoals());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setMeals(storage.getTodayMeals());
    setGoals(storage.getGoals());
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const consumed = getTodayNutrition(meals);
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const calPct = Math.min((consumed.calories / goals.calories) * 100, 100);

  function logUsual(food: FoodItem) {
    const meal: MealLog = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      food,
      portionMultiplier: 1,
      timestamp: Date.now(),
    };
    storage.addMeal(meal);
    setMeals(storage.getTodayMeals());
  }

  function removeMeal(id: string) {
    storage.removeMeal(id);
    setMeals(storage.getTodayMeals());
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <p className="text-sm text-white/40 font-medium">{greeting}</p>
        <h1 className="text-2xl font-bold gradient-text mt-0.5">NutriAI</h1>
      </div>

      {/* Calorie Ring + Summary */}
      <div className="mx-4 glass-card rounded-3xl p-5 mb-4 fade-in">
        <div className="flex items-center gap-6">
          <NutritionRing
            value={consumed.calories}
            max={goals.calories}
            color="#a78bfa"
            size={110}
            strokeWidth={10}
            unit="kcal"
          />
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Today&apos;s Calories</p>
              <p className="text-xs text-white/30">{Math.round(calPct)}%</p>
            </div>
            <p className="text-3xl font-bold text-white mb-0.5">{Math.round(consumed.calories)}</p>
            <p className="text-sm text-white/30">of {goals.calories} kcal</p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              <MacroBar label="Protein" value={consumed.protein} max={goals.protein} color="#34d399" />
              <MacroBar label="Carbs" value={consumed.carbs} max={goals.carbs} color="#60a5fa" />
              <MacroBar label="Fat" value={consumed.fat} max={goals.fat} color="#f59e0b" />
              <MacroBar label="Fiber" value={consumed.fiber} max={goals.fiber} color="#fb923c" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <Link href="/scan" className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-violet-500/30 transition-all active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-xl">📷</div>
            <span className="text-xs text-white/60 font-medium text-center">Scan Food</span>
          </Link>
          <Link href="/groceries" className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500/30 transition-all active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">🛒</div>
            <span className="text-xs text-white/60 font-medium text-center">Groceries</span>
          </Link>
          <Link href="/suggestions" className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-emerald-500/30 transition-all active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">✨</div>
            <span className="text-xs text-white/60 font-medium text-center">Get Tips</span>
          </Link>
        </div>
      </div>

      {/* Today's Meals */}
      {meals.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Today&apos;s Meals</h2>
          <div className="space-y-2">
            {meals.map(meal => (
              <div key={meal.id} className="glass-card rounded-2xl p-4 flex items-center gap-3 fade-in">
                <span className="text-2xl">{meal.food.emoji || '🍽️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white/90 text-sm truncate">{meal.food.name}</p>
                  <p className="text-xs text-white/40">{meal.food.portionSize}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-violet-400">{Math.round(meal.food.nutrition.calories * meal.portionMultiplier)} kcal</p>
                  <p className="text-xs text-white/30">{Math.round(meal.food.nutrition.protein * meal.portionMultiplier)}g protein</p>
                </div>
                <button
                  onClick={() => removeMeal(meal.id)}
                  className="ml-1 w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/30 hover:text-red-400 transition-all shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usuals */}
      <div className="px-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Quick Add — Usuals</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {USUAL_FOODS.map(food => (
            <button
              key={food.id}
              onClick={() => logUsual(food)}
              className="glass-card rounded-2xl p-4 text-left hover:border-white/20 transition-all active:scale-95 group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{food.emoji}</span>
                <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-violet-500/20 flex items-center justify-center text-white/30 group-hover:text-violet-400 transition-all text-xs">+</div>
              </div>
              <p className="text-sm font-medium text-white/80 leading-tight">{food.name}</p>
              <p className="text-xs text-white/30 mt-0.5">{food.portionSize}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs text-violet-400 font-semibold">{food.nutrition.calories} kcal</span>
                <span className="text-xs text-emerald-400">{food.nutrition.protein}g P</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
