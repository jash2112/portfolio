export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  nutrition: Nutrition;
  portionSize: string;
  confidence?: number;
  imageUrl?: string;
}

export interface MealLog {
  id: string;
  date: string;
  food: FoodItem;
  portionMultiplier: number;
  timestamp: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price?: number;
  source?: 'walmart' | 'doordash' | 'manual';
  purchased: boolean;
  dateAdded: string;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
  estimatedCaloriesPer100g?: number;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Receipt {
  id: string;
  source: 'walmart' | 'doordash' | 'manual';
  date: string;
  items: GroceryItem[];
  total: number;
  storeName?: string;
}

export interface Suggestion {
  name: string;
  description: string;
  emoji: string;
  reason: string;
  nutrition: Nutrition;
  ingredients: string[];
  prepTime: string;
}

export interface FoodAnalysisResult {
  food: FoodItem;
  suggestions?: string[];
  tips?: string[];
}

export interface PantryAnalysis {
  identifiedDish?: string;
  usedIngredients: string[];
  remainingIngredients: { name: string; estimatedAmount: string }[];
  suggestions: Suggestion[];
}

export const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
  fiber: 28,
};

export const USUAL_FOODS: FoodItem[] = [
  {
    id: 'usual-1',
    name: 'Chicken & Rice Bowl',
    emoji: '🍚',
    portionSize: '1 bowl (450g)',
    nutrition: { calories: 520, protein: 42, carbs: 58, fat: 10, fiber: 3 },
  },
  {
    id: 'usual-2',
    name: 'Greek Yogurt Parfait',
    emoji: '🥣',
    portionSize: '1 cup (245g)',
    nutrition: { calories: 210, protein: 18, carbs: 28, fat: 3, fiber: 2 },
  },
  {
    id: 'usual-3',
    name: 'Protein Shake',
    emoji: '🥤',
    portionSize: '1 scoop (300ml)',
    nutrition: { calories: 180, protein: 30, carbs: 8, fat: 3, fiber: 1 },
  },
  {
    id: 'usual-4',
    name: 'Avocado Toast',
    emoji: '🥑',
    portionSize: '2 slices',
    nutrition: { calories: 340, protein: 12, carbs: 36, fat: 18, fiber: 8 },
  },
  {
    id: 'usual-5',
    name: 'Caesar Salad',
    emoji: '🥗',
    portionSize: '1 large (350g)',
    nutrition: { calories: 290, protein: 22, carbs: 15, fat: 18, fiber: 4 },
  },
  {
    id: 'usual-6',
    name: 'Oatmeal',
    emoji: '🥞',
    portionSize: '1 cup cooked',
    nutrition: { calories: 158, protein: 6, carbs: 27, fat: 3, fiber: 4 },
  },
];
