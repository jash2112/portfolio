'use client';

import { MealLog, GroceryItem, PantryItem, DailyGoals, Receipt, DEFAULT_GOALS } from './types';

const KEYS = {
  MEALS: 'nutri_meals',
  GROCERIES: 'nutri_groceries',
  PANTRY: 'nutri_pantry',
  GOALS: 'nutri_goals',
  RECEIPTS: 'nutri_receipts',
};

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getMeals: (): MealLog[] => get<MealLog[]>(KEYS.MEALS, []),
  saveMeals: (meals: MealLog[]) => set(KEYS.MEALS, meals),

  addMeal: (meal: MealLog) => {
    const meals = storage.getMeals();
    set(KEYS.MEALS, [meal, ...meals]);
  },

  removeMeal: (id: string) => {
    const meals = storage.getMeals().filter(m => m.id !== id);
    set(KEYS.MEALS, meals);
  },

  getTodayMeals: (): MealLog[] => {
    const today = new Date().toISOString().split('T')[0];
    return storage.getMeals().filter(m => m.date === today);
  },

  getGroceries: (): GroceryItem[] => get<GroceryItem[]>(KEYS.GROCERIES, []),
  saveGroceries: (items: GroceryItem[]) => set(KEYS.GROCERIES, items),

  addGrocery: (item: GroceryItem) => {
    const items = storage.getGroceries();
    set(KEYS.GROCERIES, [item, ...items]);
  },

  toggleGrocery: (id: string) => {
    const items = storage.getGroceries().map(i =>
      i.id === id ? { ...i, purchased: !i.purchased } : i
    );
    set(KEYS.GROCERIES, items);
  },

  removeGrocery: (id: string) => {
    const items = storage.getGroceries().filter(i => i.id !== id);
    set(KEYS.GROCERIES, items);
  },

  getPantry: (): PantryItem[] => get<PantryItem[]>(KEYS.PANTRY, []),
  savePantry: (items: PantryItem[]) => set(KEYS.PANTRY, items),

  addPantryItem: (item: PantryItem) => {
    const items = storage.getPantry();
    set(KEYS.PANTRY, [item, ...items]);
  },

  updatePantryItem: (id: string, updates: Partial<PantryItem>) => {
    const items = storage.getPantry().map(i => i.id === id ? { ...i, ...updates } : i);
    set(KEYS.PANTRY, items);
  },

  removePantryItem: (id: string) => {
    const items = storage.getPantry().filter(i => i.id !== id);
    set(KEYS.PANTRY, items);
  },

  getGoals: (): DailyGoals => get<DailyGoals>(KEYS.GOALS, DEFAULT_GOALS),
  saveGoals: (goals: DailyGoals) => set(KEYS.GOALS, goals),

  getReceipts: (): Receipt[] => get<Receipt[]>(KEYS.RECEIPTS, []),
  addReceipt: (receipt: Receipt) => {
    const receipts = storage.getReceipts();
    set(KEYS.RECEIPTS, [receipt, ...receipts]);
  },
};

export function getTodayNutrition(meals: MealLog[]) {
  return meals.reduce(
    (acc, meal) => {
      const m = meal.portionMultiplier;
      return {
        calories: acc.calories + meal.food.nutrition.calories * m,
        protein: acc.protein + meal.food.nutrition.protein * m,
        carbs: acc.carbs + meal.food.nutrition.carbs * m,
        fat: acc.fat + meal.food.nutrition.fat * m,
        fiber: acc.fiber + meal.food.nutrition.fiber * m,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}
