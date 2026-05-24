"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { supabase, isSupabaseSupported } from "@/lib/supabase";
import {
  Activity,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingDown,
  User,
  BookOpen,
  Apple,
  Download,
  Printer,
  Scale,
  Calendar,
  Save,
  Check,
  Droplet,
  FlaskConical,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

// Clinical nutrition conditions configuration
interface ConditionConfig {
  id: string;
  name: string;
  desc: string;
  calorieMultiplier: number;
  proteinPerKg: number; // grams of protein per kg of body weight
  sodiumLimitMg: number; // max sodium in mg
  prohibitedFoods: string[];
  allowedFoods: string[];
  clinicalTips: string[];
}

const CONDITIONS: Record<string, ConditionConfig> = {
  general: {
    id: "general",
    name: "General Wellness",
    desc: "Optimalkan kesehatan tubuh melalui pola makan gizi seimbang harian.",
    calorieMultiplier: 30, // kcal/kg
    proteinPerKg: 1.0, // 1g per kg
    sodiumLimitMg: 2000,
    allowedFoods: [
      "Buah & Sayur Segar",
      "Nasi Merah",
      "Dada Ayam Panggang",
      "Ikan Segar",
      "Tahu & Tempe Kukus",
    ],
    prohibitedFoods: [
      "Gula Berlebih",
      "Gorengan",
      "Mie Instan",
      "Minuman Bersoda",
    ],
    clinicalTips: [
      "Konsumsi minimal 5 porsi buah dan sayur per hari untuk memenuhi mikronutrien.",
      "Pilih sumber protein rendah lemak seperti ikan, ayam tanpa kulit, dan protein nabati.",
      "Batasi konsumsi gula tambahan maksimal 4 sendok makan per hari.",
    ],
  },
  kidney: {
    id: "kidney",
    name: "Chronic Kidney Disease (CKD)",
    desc: "Rencana asuhan gizi rendah protein untuk mengurangi beban kerja ginjal.",
    calorieMultiplier: 35, // High calorie requirement to prevent catabolism
    proteinPerKg: 0.6, // Strictly restricted protein (0.6g/kg)
    sodiumLimitMg: 1800,
    allowedFoods: [
      "Nasi Putih",
      "Putih Telur",
      "Apel & Pir",
      "Minyak Zaitun",
      "Tahu Rebus (porsi kecil)",
    ],
    prohibitedFoods: [
      "Daging Merah",
      "Keju & Susu",
      "Makanan Instan/Kaleng",
      "Pisang, Alpukat, Bayam (Tinggi Kalium)",
    ],
    clinicalTips: [
      "Batasi asupan protein hewani ketat sesuai target untuk mencegah penumpukan ureum.",
      "Waspadai makanan tinggi Kalium (seperti pisang, alpukat, kentang) dan Fosfor (susu, keju, jeroan).",
      "Monitor asupan cairan harian Anda sesuai dengan urine output atau petunjuk dokter.",
    ],
  },
  hypertension: {
    id: "hypertension",
    name: "Hypertension (DASH Diet)",
    desc: "Diet rendah garam untuk membantu menurunkan dan menstabilkan tekanan darah.",
    calorieMultiplier: 28,
    proteinPerKg: 1.0,
    sodiumLimitMg: 1400, // Strict sodium limit (<1500mg)
    allowedFoods: [
      "Pisang & Alpukat (Kaya Kalium)",
      "Sayuran Hijau",
      "Ikan Kembung (Omega-3)",
      "Oatmeal",
      "Yogurt Rendah Lemak",
    ],
    prohibitedFoods: [
      "Mie Instan & Keripik Asin",
      "Makanan Kaleng/Asin",
      "Bakso & Kecap Asin",
      "Margarin",
    ],
    clinicalTips: [
      "Konsumsi makanan kaya kalium (pisang, jeruk, sayuran) untuk membantu sekresi natrium.",
      "Ganti garam dapur dengan rempah-rempah alami (bawang putih, jahe, ketumbar) untuk menambah cita rasa.",
      "Periksa label kemasan makanan: pilih produk dengan sodium < 120mg per porsi.",
    ],
  },
  gout: {
    id: "gout",
    name: "Gout & Asam Urat",
    desc: "Pencegahan serangan radang sendi dengan membatasi asupan purin tinggi.",
    calorieMultiplier: 28,
    proteinPerKg: 0.9,
    sodiumLimitMg: 2000,
    allowedFoods: [
      "Telur & Susu Rendah Lemak",
      "Ceri & Stroberi",
      "Tahu & Tempe (porsi sedang)",
      "Gandum Utuh",
      "Air Putih Melimpah",
    ],
    prohibitedFoods: [
      "Jeroan & Daging Merah",
      "Kerang, Udang, Kepiting",
      "Sayur Bayam, Kol, Jamur",
      "Alkohol & Sirup Fruktosa",
    ],
    clinicalTips: [
      "Hindari konsumsi seafood cangkang keras (udang, kerang) dan daging merah berlemak.",
      "Minum air putih minimal 2.5 - 3 liter sehari untuk membantu membuang asam urat melalui urin.",
      "Buah ceri dan vitamin C terbukti membantu menurunkan kadar asam urat darah.",
    ],
  },
};

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  servingSize: string;
  servingWeightGrams: number;
  isFatSecret?: boolean;
}

const FOOD_DATABASE: FoodItem[] = [
  {
    id: "1",
    name: "Nasi Putih",
    category: "Karbohidrat",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    sodium: 1,
    servingSize: "1 mangkok",
    servingWeightGrams: 100,
  },
  {
    id: "2",
    name: "Nasi Merah",
    category: "Karbohidrat",
    calories: 110,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    sodium: 1,
    servingSize: "1 mangkok",
    servingWeightGrams: 100,
  },
  {
    id: "3",
    name: "Dada Ayam Panggang",
    category: "Protein",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    sodium: 74,
    servingSize: "1 potong sedang",
    servingWeightGrams: 100,
  },
  {
    id: "4",
    name: "Daging Sapi Slice (Goreng)",
    category: "Protein",
    calories: 252,
    protein: 26,
    carbs: 0,
    fat: 15,
    sodium: 82,
    servingSize: "1 porsi",
    servingWeightGrams: 100,
  },
  {
    id: "5",
    name: "Telur Rebus",
    category: "Protein",
    calories: 155,
    protein: 12.6,
    carbs: 1.1,
    fat: 10.6,
    sodium: 124,
    servingSize: "1 butir",
    servingWeightGrams: 50,
  },
  {
    id: "6",
    name: "Putih Telur Rebus",
    category: "Protein",
    calories: 52,
    protein: 11,
    carbs: 0.7,
    fat: 0.2,
    sodium: 166,
    servingSize: "2 butir",
    servingWeightGrams: 60,
  },
  {
    id: "7",
    name: "Tahu Rebus",
    category: "Protein",
    calories: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    sodium: 7,
    servingSize: "1 potong besar",
    servingWeightGrams: 100,
  },
  {
    id: "8",
    name: "Tempe Goreng",
    category: "Protein",
    calories: 193,
    protein: 19,
    carbs: 9,
    fat: 11,
    sodium: 9,
    servingSize: "1 potong sedang",
    servingWeightGrams: 50,
  },
  {
    id: "9",
    name: "Ikan Tongkol Balado",
    category: "Protein",
    calories: 210,
    protein: 24,
    carbs: 2.1,
    fat: 12,
    sodium: 450,
    servingSize: "1 potong sedang",
    servingWeightGrams: 80,
  },
  {
    id: "10",
    name: "Mie Instan Kuah",
    brand: "Indomie",
    category: "Makanan Siap Saji",
    calories: 380,
    protein: 8,
    carbs: 53,
    fat: 14,
    sodium: 1070,
    servingSize: "1 bungkus",
    servingWeightGrams: 85,
  },
  {
    id: "11",
    name: "Keripik Kentang Asin",
    brand: "Lay's",
    category: "Cemilan",
    calories: 536,
    protein: 7,
    carbs: 53,
    fat: 35,
    sodium: 480,
    servingSize: "1 bungkus kecil",
    servingWeightGrams: 50,
  },
  {
    id: "12",
    name: "Pisang Cavendish",
    category: "Buah",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    sodium: 1,
    servingSize: "1 buah sedang",
    servingWeightGrams: 118,
  },
  {
    id: "13",
    name: "Alpukat Butter",
    category: "Buah",
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    sodium: 7,
    servingSize: "1/2 buah",
    servingWeightGrams: 100,
  },
  {
    id: "14",
    name: "Apel Fuji",
    category: "Buah",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    sodium: 1,
    servingSize: "1 buah sedang",
    servingWeightGrams: 150,
  },
  {
    id: "15",
    name: "Sayur Bayam Rebus",
    category: "Sayuran",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    sodium: 79,
    servingSize: "1 mangkok kecil",
    servingWeightGrams: 100,
  },
  {
    id: "16",
    name: "Oatmeal Instan",
    brand: "Quaker",
    category: "Karbohidrat",
    calories: 379,
    protein: 13.5,
    carbs: 67,
    fat: 6.5,
    sodium: 5,
    servingSize: "4 sendok makan",
    servingWeightGrams: 40,
  },
  {
    id: "17",
    name: "Susu Sapi UHT Full Cream",
    brand: "Ultra Milk",
    category: "Minuman",
    calories: 150,
    protein: 8,
    carbs: 12,
    fat: 8,
    sodium: 110,
    servingSize: "1 kotak",
    servingWeightGrams: 200,
  },
  {
    id: "18",
    name: "Bakso Sapi Kuah Komplit",
    category: "Makanan Siap Saji",
    calories: 420,
    protein: 19,
    carbs: 32,
    fat: 23,
    sodium: 1150,
    servingSize: "1 porsi",
    servingWeightGrams: 300,
  },
  {
    id: "19",
    name: "Brokoli Kukus",
    category: "Sayuran",
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    sodium: 33,
    servingSize: "1 mangkok",
    servingWeightGrams: 100,
  },
  {
    id: "20",
    name: "Bubur Ayam Jakarta",
    category: "Sarapan",
    calories: 290,
    protein: 12,
    carbs: 45,
    fat: 6,
    sodium: 620,
    servingSize: "1 porsi",
    servingWeightGrams: 250,
  },
  {
    id: "21",
    name: "Udang Goreng Tepung",
    category: "Protein",
    calories: 280,
    protein: 18,
    carbs: 12,
    fat: 16,
    sodium: 490,
    servingSize: "5 ekor",
    servingWeightGrams: 100,
  },
  {
    id: "22",
    name: "Kentang Rebus",
    category: "Karbohidrat",
    calories: 87,
    protein: 1.9,
    carbs: 20,
    fat: 0.1,
    sodium: 4,
    servingSize: "1 buah sedang",
    servingWeightGrams: 100,
  },
  {
    id: "23",
    name: "Pepaya Segar",
    category: "Buah",
    calories: 43,
    protein: 0.5,
    carbs: 11,
    fat: 0.3,
    sodium: 8,
    servingSize: "1 potong sedang",
    servingWeightGrams: 100,
  },
  {
    id: "24",
    name: "Buah Ceri Segar",
    category: "Buah",
    calories: 50,
    protein: 1,
    carbs: 12,
    fat: 0.3,
    sodium: 0,
    servingSize: "10 buah",
    servingWeightGrams: 100,
  },
  {
    id: "25",
    name: "Emping Melinjo",
    category: "Cemilan",
    calories: 350,
    protein: 4.8,
    carbs: 71,
    fat: 5,
    sodium: 180,
    servingSize: "1 porsi",
    servingWeightGrams: 100,
  },
  {
    id: "26",
    name: "Sayur Kol Rebus",
    category: "Sayuran",
    calories: 25,
    protein: 1.3,
    carbs: 5.8,
    fat: 0.1,
    sodium: 18,
    servingSize: "1 mangkok",
    servingWeightGrams: 100,
  },
  {
    id: "27",
    name: "Teri Asin Goreng",
    category: "Protein",
    calories: 213,
    protein: 32,
    carbs: 0,
    fat: 8.5,
    sodium: 1400,
    servingSize: "1 piring kecil",
    servingWeightGrams: 50,
  },
  {
    id: "28",
    name: "Hati Sapi Panggang",
    category: "Protein",
    calories: 175,
    protein: 27,
    carbs: 3.9,
    fat: 4.7,
    sodium: 79,
    servingSize: "1 potong sedang",
    servingWeightGrams: 100,
  },
  {
    id: "29",
    name: "Minyak Zaitun (Extra Virgin)",
    category: "Lemak",
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    sodium: 2,
    servingSize: "1 sendok makan",
    servingWeightGrams: 14,
  },
  {
    id: "30",
    name: "Roti Gandum Utuh",
    category: "Karbohidrat",
    calories: 247,
    protein: 13,
    carbs: 41,
    fat: 3.4,
    sodium: 400,
    servingSize: "2 lembar",
    servingWeightGrams: 50,
  },
  {
    id: "31",
    name: "Susu Almond (Tawar)",
    brand: "Almond Breeze",
    category: "Minuman",
    calories: 30,
    protein: 1,
    carbs: 1,
    fat: 2.5,
    sodium: 150,
    servingSize: "1 gelas",
    servingWeightGrams: 240,
  },
  {
    id: "32",
    name: "Ikan Kembung Bakar",
    category: "Protein",
    calories: 180,
    protein: 22,
    carbs: 0,
    fat: 10,
    sodium: 90,
    servingSize: "1 ekor sedang",
    servingWeightGrams: 100,
  },
  {
    id: "33",
    name: "Melon Hijau",
    category: "Buah",
    calories: 36,
    protein: 0.5,
    carbs: 9,
    fat: 0.1,
    sodium: 18,
    servingSize: "1 potong sedang",
    servingWeightGrams: 100,
  },
  {
    id: "34",
    name: "Bir / Minuman Beralkohol",
    category: "Minuman",
    calories: 43,
    protein: 0.5,
    carbs: 3.6,
    fat: 0,
    sodium: 4,
    servingSize: "1 gelas kecil",
    servingWeightGrams: 100,
  },
  {
    id: "35",
    name: "Bubur Sumsum Santan",
    category: "Makanan Siap Saji",
    calories: 180,
    protein: 1.2,
    carbs: 28,
    fat: 6.8,
    sodium: 320,
    servingSize: "1 mangkok",
    servingWeightGrams: 150,
  },
  {
    id: "36",
    name: "Kecap Asin",
    category: "Bumbu",
    calories: 53,
    protein: 5.5,
    carbs: 4.9,
    fat: 0.1,
    sodium: 5500,
    servingSize: "1 sendok makan",
    servingWeightGrams: 15,
  },
  {
    id: "37",
    name: "Jus Alpukat Manis",
    category: "Minuman",
    calories: 220,
    protein: 1.5,
    carbs: 28,
    fat: 12,
    sodium: 22,
    servingSize: "1 gelas",
    servingWeightGrams: 200,
  },
  {
    id: "38",
    name: "Kerang Dara Kukus",
    category: "Protein",
    calories: 95,
    protein: 15,
    carbs: 2.5,
    fat: 2,
    sodium: 290,
    servingSize: "10 biji",
    servingWeightGrams: 80,
  },
];

interface LoggedMeal {
  loggedId: string;
  foodId: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  multiplier: number;
  loggedGrams: number;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

interface WeightLog {
  date: string;
  weight: number;
}

interface LabData {
  uricAcid?: number;
  ureum?: number;
  creatinine?: number;
  potassium?: number;
  sodium?: number;
  phosphorus?: number;
  lastUpdated?: string;
}

interface DbMeal {
  logged_id: string;
  food_id: string;
  name: string;
  brand?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  multiplier: number;
  logged_grams: number;
  meal_type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

const mapDbMealToClient = (m: DbMeal): LoggedMeal => ({
  loggedId: m.logged_id,
  foodId: m.food_id,
  name: m.name,
  brand: m.brand || undefined,
  calories: Number(m.calories),
  protein: Number(m.protein),
  carbs: Number(m.carbs),
  fat: Number(m.fat),
  sodium: Number(m.sodium),
  multiplier: Number(m.multiplier),
  loggedGrams: Number(m.logged_grams),
  mealType: m.meal_type,
});

const mapClientMealToDb = (
  m: LoggedMeal,
  userId: string,
  userEmail: string,
) => ({
  logged_id: m.loggedId,
  user_id: userId,
  user_email: userEmail,
  food_id: m.foodId,
  name: m.name,
  brand: m.brand || null,
  calories: m.calories,
  protein: m.protein,
  carbs: m.carbs,
  fat: m.fat,
  sodium: m.sodium,
  multiplier: m.multiplier,
  logged_grams: m.loggedGrams,
  meal_type: m.mealType,
});

interface ChecklistItem {
  id: string;
  text: string;
}

const CHECKLIST_ITEMS: Record<string, ChecklistItem[]> = {
  general: [
    { id: "gen_fruit", text: "Makan minimal 5 porsi buah & sayuran segar" },
    { id: "gen_water", text: "Minum minimal 2 liter air putih (8 gelas)" },
    {
      id: "gen_whole",
      text: "Pilih karbohidrat kompleks (beras merah/oatmeal)",
    },
    { id: "gen_sleep", text: "Tidur cukup 7-8 jam semalam" },
    {
      id: "gen_exercise",
      text: "Latihan fisik / berjalan kaki selama 30 menit",
    },
  ],
  kidney: [
    {
      id: "kid_protein",
      text: "Batasi asupan protein ketat (maksimal target harian)",
    },
    {
      id: "kid_potassium",
      text: "Hindari makanan tinggi kalium (pisang, alpukat, bayam)",
    },
    {
      id: "kid_fluid",
      text: "Pantau asupan cairan harian (hindari kelebihan cairan)",
    },
    {
      id: "kid_binder",
      text: "Konsumsi obat pengikat fosfat bersama makanan utama",
    },
    {
      id: "kid_edema",
      text: "Periksa bengkak pada mata kaki, wajah, atau tangan",
    },
  ],
  hypertension: [
    {
      id: "hyp_salt",
      text: "Batasi penggunaan garam tambahan saat makan / memasak",
    },
    {
      id: "hyp_label",
      text: "Cek label makanan kemasan: pilih sodium < 120mg",
    },
    {
      id: "hyp_potassium",
      text: "Konsumsi pisang/alpukat/melon untuk kalium alami",
    },
    { id: "hyp_bp", text: "Ukur tekanan darah (tensi) pagi dan sore" },
    {
      id: "hyp_exercise",
      text: "Aktivitas fisik sedang (aerobik/jalan cepat) 30 menit",
    },
  ],
  gout: [
    {
      id: "gout_purine",
      text: "Hindari jeroan, emping melinjo, kerang, & daging merah",
    },
    {
      id: "gout_water",
      text: "Minum air putih melimpah (minimal 2.5 - 3 liter)",
    },
    {
      id: "gout_sugar",
      text: "Hindari minuman kaleng manis, sirup fruktosa, & alkohol",
    },
    {
      id: "gout_cherry",
      text: "Konsumsi buah ceri / buah kaya Vitamin C alami",
    },
    {
      id: "gout_joint",
      text: "Pantau nyeri sendi (jempol kaki, lutut, atau pergelangan)",
    },
  ],
};

// Helper date function (hoisted to top-level to avoid eslint hoisting errors)
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export default function Home() {
  // --- Hydration Safety ---
  const [mounted, setMounted] = useState(false);

  // --- Supabase Refs ---
  const todayFluidIdRef = useRef<string | null>(null);

  // --- FatSecret Search State ---
  const [apiSearchResults, setApiSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  // --- Current Offline User State ---
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    email: string;
    name: string;
    conditionId: string;
  } | null>(null);

  // --- User Profile & Bio State ---
  const [weight, setWeight] = useState<number>(65);
  const [height, setHeight] = useState<number>(165);
  const [age, setAge] = useState<number>(34);
  const [waist, setWaist] = useState<number>(75);
  const [gender, setGender] = useState<"male" | "female">("female");
  const [activity, setActivity] = useState<number>(1.2);
  const [conditionId, setConditionId] = useState<string>("general");

  // --- Daily Log State ---
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);

  // --- Weight History Logging ---
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
  const [newWeightInput, setNewWeightInput] = useState("");
  const [newWeightDate, setNewWeightDate] = useState("");

  // --- Fluid Intake Tracker State ---
  const [fluidIntake, setFluidIntake] = useState<number>(0);

  // --- Interactive Daily Checklist State ---
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // --- Biochemical Lab Data State ---
  const [labData, setLabData] = useState<LabData>({});

  // --- UI Layouts ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<
    "Breakfast" | "Lunch" | "Dinner" | "Snack"
  >("Breakfast");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<"diary" | "profile" | "guide">(
    "diary",
  );

  // Custom manual entry states
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");
  const [manualSodium, setManualSodium] = useState("");
  const [manualWeight, setManualWeight] = useState("100");

  const [selectedSearchFood, setSelectedSearchFood] = useState<FoodItem | null>(
    null,
  );
  const [selectedPortionWeight, setSelectedPortionWeight] =
    useState<number>(100);

  // Status notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- Load localStorage and Supabase on Mount (SSR Safe) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);

      // Set standard default date input to today
      const todayStr = new Date().toISOString().split("T")[0];
      setNewWeightDate(todayStr);

      const loadAllData = async () => {
        try {
          const storedUser = localStorage.getItem("nourishlab_current_user");
          if (!storedUser) {
            window.location.href = "/login";
            return;
          }
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          const userKey = parsedUser.email.replace(/[^a-zA-Z0-9]/g, "_");

          // Check if Supabase is supported and the user has a Supabase UID
          if (isSupabaseSupported() && supabase && parsedUser.id) {
            try {
              // 1. Profile Load
              const profileResponse = await supabase
                .from("profiles")
                .select("*")
                .eq("id", parsedUser.id)
                .single();

              const profileErr = profileResponse.error;
              let profile = profileResponse.data;

              if (profileErr || !profile) {
                // Try to get local profile to insert or fallback
                const storedProfile = localStorage.getItem(
                  `nourishlab_profile_${userKey}`,
                );
                const parsedLocal = storedProfile
                  ? JSON.parse(storedProfile)
                  : null;
                const newProfile = {
                  id: parsedUser.id,
                  email: parsedUser.email,
                  name:
                    parsedUser.name || parsedUser.email.split("@")[0] || "User",
                  weight: parsedLocal?.weight || 65,
                  height: parsedLocal?.height || 165,
                  age: parsedLocal?.age || 34,
                  gender: parsedLocal?.gender || "female",
                  activity: parsedLocal?.activity || 1.2,
                  condition_id:
                    parsedLocal?.conditionId ||
                    parsedUser.conditionId ||
                    "general",
                  waist: parsedLocal?.waist || 75,
                };
                const { data: insertedProfile } = await supabase
                  .from("profiles")
                  .insert(newProfile)
                  .select()
                  .single();
                if (insertedProfile) {
                  profile = insertedProfile;
                } else {
                  profile = {
                    ...newProfile,
                    updated_at: new Date().toISOString(),
                  } as typeof profile;
                }
              }

              if (profile) {
                if (profile.weight) setWeight(Number(profile.weight));
                if (profile.height) setHeight(Number(profile.height));
                if (profile.age) setAge(Number(profile.age));
                if (profile.gender)
                  setGender(profile.gender as "male" | "female");
                if (profile.activity) setActivity(Number(profile.activity));
                if (profile.condition_id) setConditionId(profile.condition_id);
                if (profile.waist) setWaist(Number(profile.waist));
              }

              // 2. Food Logs Load (Today's meals)
              const { data: dbMeals, error: mealsErr } = await supabase
                .from("meals")
                .select("*")
                .eq("user_id", parsedUser.id)
                .gte("created_at", `${todayStr}T00:00:00.000Z`)
                .lte("created_at", `${todayStr}T23:59:59.999Z`);

              if (mealsErr || !dbMeals || dbMeals.length === 0) {
                const storedMeals = localStorage.getItem(
                  `nourishlab_meals_${userKey}`,
                );
                if (storedMeals) {
                  setLoggedMeals(JSON.parse(storedMeals));
                } else {
                  // Fallback live sample meals on first usage
                  const initialDummy: LoggedMeal[] = [
                    {
                      loggedId: "init-1",
                      foodId: "2",
                      name: "Nasi Merah",
                      calories: 165,
                      protein: 3.9,
                      carbs: 34.5,
                      fat: 1.35,
                      sodium: 1.5,
                      multiplier: 1.5,
                      loggedGrams: 150,
                      mealType: "Breakfast",
                    },
                    {
                      loggedId: "init-2",
                      foodId: "3",
                      name: "Dada Ayam Panggang",
                      calories: 247.5,
                      protein: 46.5,
                      carbs: 0,
                      fat: 5.4,
                      sodium: 111,
                      multiplier: 1.5,
                      loggedGrams: 150,
                      mealType: "Breakfast",
                    },
                  ];
                  setLoggedMeals(initialDummy);
                  localStorage.setItem(
                    `nourishlab_meals_${userKey}`,
                    JSON.stringify(initialDummy),
                  );
                }
              } else {
                setLoggedMeals(dbMeals.map(mapDbMealToClient));
              }

              // 3. Weight Log History Load
              const { data: dbWeight, error: weightErr } = await supabase
                .from("weight_history")
                .select("*")
                .eq("user_id", parsedUser.id)
                .order("date", { ascending: true });

              if (weightErr || !dbWeight || dbWeight.length === 0) {
                const storedWeightHistory = localStorage.getItem(
                  `nourishlab_weight_history_${userKey}`,
                );
                if (storedWeightHistory) {
                  setWeightHistory(JSON.parse(storedWeightHistory));
                } else {
                  const mockWeightHistory: WeightLog[] = [
                    { date: daysAgo(5), weight: 66.2 },
                    { date: daysAgo(4), weight: 65.9 },
                    { date: daysAgo(3), weight: 65.7 },
                    { date: daysAgo(2), weight: 65.5 },
                    { date: todayStr, weight: 65.0 },
                  ];
                  setWeightHistory(mockWeightHistory);
                  localStorage.setItem(
                    `nourishlab_weight_history_${userKey}`,
                    JSON.stringify(mockWeightHistory),
                  );
                }
              } else {
                setWeightHistory(
                  dbWeight.map((row) => ({
                    date: row.date,
                    weight: Number(row.weight),
                  })),
                );
              }

              // 4. Fluid intake Load (Today's)
              const { data: dbFluids, error: fluidsErr } = await supabase
                .from("fluids")
                .select("*")
                .eq("user_id", parsedUser.id)
                .eq("date", todayStr);

              if (fluidsErr || !dbFluids || dbFluids.length === 0) {
                const storedFluid = localStorage.getItem(
                  `nourishlab_fluid_${userKey}`,
                );
                if (storedFluid) {
                  setFluidIntake(Number(storedFluid));
                }
                todayFluidIdRef.current = null;
              } else {
                setFluidIntake(Number(dbFluids[0].amount));
                todayFluidIdRef.current = dbFluids[0].id;
              }

              // 5. Checklist Load
              const { data: dbChecklists, error: checklistErr } = await supabase
                .from("checklists")
                .select("*")
                .eq("user_id", parsedUser.id);

              if (checklistErr || !dbChecklists || dbChecklists.length === 0) {
                const storedChecklist = localStorage.getItem(
                  `nourishlab_checklist_${userKey}`,
                );
                if (storedChecklist) {
                  setChecklist(JSON.parse(storedChecklist));
                }
              } else {
                const fetchedChecklist: Record<string, boolean> = {};
                dbChecklists.forEach((row) => {
                  const dateStr = row.date;
                  const items = row.items || {};
                  Object.keys(items).forEach((itemId) => {
                    fetchedChecklist[`${dateStr}_${itemId}`] = !!items[itemId];
                  });
                });
                setChecklist(fetchedChecklist);
              }

              // 6. Lab Data Load
              const { data: dbLab, error: labErr } = await supabase
                .from("labs")
                .select("*")
                .eq("user_id", parsedUser.id)
                .maybeSingle();

              if (labErr || !dbLab) {
                const storedLab = localStorage.getItem(
                  `nourishlab_lab_data_${userKey}`,
                );
                if (storedLab) {
                  setLabData(JSON.parse(storedLab));
                }
              } else {
                setLabData({
                  uricAcid:
                    dbLab.uric_acid !== null
                      ? Number(dbLab.uric_acid)
                      : undefined,
                  ureum: dbLab.ureum !== null ? Number(dbLab.ureum) : undefined,
                  creatinine:
                    dbLab.creatinine !== null
                      ? Number(dbLab.creatinine)
                      : undefined,
                  potassium:
                    dbLab.potassium !== null
                      ? Number(dbLab.potassium)
                      : undefined,
                  sodium:
                    dbLab.sodium !== null ? Number(dbLab.sodium) : undefined,
                  phosphorus:
                    dbLab.phosphorus !== null
                      ? Number(dbLab.phosphorus)
                      : undefined,
                  lastUpdated: dbLab.last_updated || undefined,
                });
              }
            } catch (err) {
              console.error(
                "Supabase load error, falling back to localStorage:",
                err,
              );
              loadLocalFallback(userKey, todayStr);
            }
          } else {
            // Local Storage Fallback
            loadLocalFallback(userKey, todayStr);
          }
        } catch (e) {
          console.error("Failed loading user session.", e);
        }
      };

      const loadLocalFallback = (userKey: string, todayStr: string) => {
        // 1. Profile Load
        const storedProfile = localStorage.getItem(
          `nourishlab_profile_${userKey}`,
        );
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed.weight) setWeight(Number(parsed.weight));
          if (parsed.height) setHeight(Number(parsed.height));
          if (parsed.age) setAge(Number(parsed.age));
          if (parsed.gender) setGender(parsed.gender);
          if (parsed.activity) setActivity(Number(parsed.activity));
          if (parsed.conditionId) setConditionId(parsed.conditionId);
          if (parsed.waist) setWaist(Number(parsed.waist));
        }

        // 2. Food Logs Load
        const storedMeals = localStorage.getItem(`nourishlab_meals_${userKey}`);
        if (storedMeals) {
          setLoggedMeals(JSON.parse(storedMeals));
        } else {
          const initialDummy: LoggedMeal[] = [
            {
              loggedId: "init-1",
              foodId: "2",
              name: "Nasi Merah",
              calories: 165,
              protein: 3.9,
              carbs: 34.5,
              fat: 1.35,
              sodium: 1.5,
              multiplier: 1.5,
              loggedGrams: 150,
              mealType: "Breakfast",
            },
            {
              loggedId: "init-2",
              foodId: "3",
              name: "Dada Ayam Panggang",
              calories: 247.5,
              protein: 46.5,
              carbs: 0,
              fat: 5.4,
              sodium: 111,
              multiplier: 1.5,
              loggedGrams: 150,
              mealType: "Breakfast",
            },
          ];
          setLoggedMeals(initialDummy);
          localStorage.setItem(
            `nourishlab_meals_${userKey}`,
            JSON.stringify(initialDummy),
          );
        }

        // 3. Weight Log History Load
        const storedWeightHistory = localStorage.getItem(
          `nourishlab_weight_history_${userKey}`,
        );
        if (storedWeightHistory) {
          setWeightHistory(JSON.parse(storedWeightHistory));
        } else {
          const mockWeightHistory: WeightLog[] = [
            { date: daysAgo(5), weight: 66.2 },
            { date: daysAgo(4), weight: 65.9 },
            { date: daysAgo(3), weight: 65.7 },
            { date: daysAgo(2), weight: 65.5 },
            { date: todayStr, weight: 65.0 },
          ];
          setWeightHistory(mockWeightHistory);
          localStorage.setItem(
            `nourishlab_weight_history_${userKey}`,
            JSON.stringify(mockWeightHistory),
          );
        }

        // 4. Fluid intake Load
        const storedFluid = localStorage.getItem(`nourishlab_fluid_${userKey}`);
        if (storedFluid) {
          setFluidIntake(Number(storedFluid));
        }

        // 5. Checklist Load
        const storedChecklist = localStorage.getItem(
          `nourishlab_checklist_${userKey}`,
        );
        if (storedChecklist) {
          setChecklist(JSON.parse(storedChecklist));
        }

        // 6. Lab Data Load
        const storedLab = localStorage.getItem(
          `nourishlab_lab_data_${userKey}`,
        );
        if (storedLab) {
          setLabData(JSON.parse(storedLab));
        }
      };

      loadAllData();
    }, 0);

    try {
      // Ensure dark mode is disabled
      document.documentElement.classList.remove("dark");
    } catch (e) {
      console.error(e);
    }

    return () => clearTimeout(timer);
  }, []);

  // --- Auto-Save to localStorage when states change ---
  useEffect(() => {
    if (!mounted || !currentUser) return;
    const userKey = currentUser.email.replace(/[^a-zA-Z0-9]/g, "_");
    const profile = {
      weight,
      height,
      age,
      gender,
      activity,
      conditionId,
      waist,
    };
    localStorage.setItem(
      `nourishlab_profile_${userKey}`,
      JSON.stringify(profile),
    );
  }, [
    weight,
    height,
    age,
    gender,
    activity,
    conditionId,
    waist,
    mounted,
    currentUser,
  ]);

  useEffect(() => {
    if (!mounted || !currentUser) return;
    const userKey = currentUser.email.replace(/[^a-zA-Z0-9]/g, "_");
    localStorage.setItem(
      `nourishlab_meals_${userKey}`,
      JSON.stringify(loggedMeals),
    );
  }, [loggedMeals, mounted, currentUser]);

  useEffect(() => {
    if (!mounted || !currentUser) return;
    const userKey = currentUser.email.replace(/[^a-zA-Z0-9]/g, "_");
    localStorage.setItem(
      `nourishlab_weight_history_${userKey}`,
      JSON.stringify(weightHistory),
    );
  }, [weightHistory, mounted, currentUser]);

  useEffect(() => {
    if (!mounted || !currentUser) return;
    const userKey = currentUser.email.replace(/[^a-zA-Z0-9]/g, "_");
    localStorage.setItem(`nourishlab_fluid_${userKey}`, String(fluidIntake));
  }, [fluidIntake, mounted, currentUser]);

  useEffect(() => {
    if (!mounted || !currentUser) return;
    const userKey = currentUser.email.replace(/[^a-zA-Z0-9]/g, "_");
    localStorage.setItem(
      `nourishlab_checklist_${userKey}`,
      JSON.stringify(checklist),
    );
  }, [checklist, mounted, currentUser]);

  useEffect(() => {
    if (!mounted || !currentUser) return;
    const userKey = currentUser.email.replace(/[^a-zA-Z0-9]/g, "_");
    localStorage.setItem(
      `nourishlab_lab_data_${userKey}`,
      JSON.stringify(labData),
    );
  }, [labData, mounted, currentUser]);

  // --- Auto-Save to Supabase with debouncing when states change ---
  useEffect(() => {
    if (
      !mounted ||
      !currentUser ||
      !currentUser.id ||
      !isSupabaseSupported() ||
      !supabase
    )
      return;
    const client = supabase;

    const timer = setTimeout(async () => {
      try {
        const { error } = await client.from("profiles").upsert({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          weight: weight || null,
          height: height || null,
          age: age || null,
          gender: gender || null,
          activity: activity || null,
          condition_id: conditionId || null,
          waist: waist || null,
          updated_at: new Date().toISOString(),
        });
        if (error) console.error("Error syncing profile to Supabase:", error);
      } catch (err) {
        console.error("Supabase profile sync error:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    weight,
    height,
    age,
    gender,
    activity,
    conditionId,
    waist,
    currentUser,
    mounted,
  ]);

  useEffect(() => {
    if (
      !mounted ||
      !currentUser ||
      !currentUser.id ||
      !isSupabaseSupported() ||
      !supabase
    )
      return;
    const client = supabase;

    const timer = setTimeout(async () => {
      try {
        const { error } = await client.from("labs").upsert({
          user_id: currentUser.id,
          user_email: currentUser.email,
          uric_acid:
            labData.uricAcid !== undefined &&
            labData.uricAcid !== null &&
            !isNaN(Number(labData.uricAcid))
              ? Number(labData.uricAcid)
              : null,
          ureum:
            labData.ureum !== undefined &&
            labData.ureum !== null &&
            !isNaN(Number(labData.ureum))
              ? Number(labData.ureum)
              : null,
          creatinine:
            labData.creatinine !== undefined &&
            labData.creatinine !== null &&
            !isNaN(Number(labData.creatinine))
              ? Number(labData.creatinine)
              : null,
          potassium:
            labData.potassium !== undefined &&
            labData.potassium !== null &&
            !isNaN(Number(labData.potassium))
              ? Number(labData.potassium)
              : null,
          sodium:
            labData.sodium !== undefined &&
            labData.sodium !== null &&
            !isNaN(Number(labData.sodium))
              ? Number(labData.sodium)
              : null,
          phosphorus:
            labData.phosphorus !== undefined &&
            labData.phosphorus !== null &&
            !isNaN(Number(labData.phosphorus))
              ? Number(labData.phosphorus)
              : null,
          last_updated: labData.lastUpdated || null,
          updated_at: new Date().toISOString(),
        });
        if (error) console.error("Error syncing labs to Supabase:", error);
      } catch (err) {
        console.error("Supabase labs sync error:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [labData, currentUser, mounted]);

  useEffect(() => {
    if (
      !mounted ||
      !currentUser ||
      !currentUser.id ||
      !isSupabaseSupported() ||
      !supabase
    )
      return;
    const client = supabase;

    const timer = setTimeout(async () => {
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const todayPrefix = `${todayStr}_`;
        const todayItems: Record<string, boolean> = {};
        Object.keys(checklist).forEach((key) => {
          if (key.startsWith(todayPrefix)) {
            const itemId = key.substring(todayPrefix.length);
            todayItems[itemId] = checklist[key];
          }
        });

        const { error } = await client.from("checklists").upsert(
          {
            user_id: currentUser.id,
            user_email: currentUser.email,
            date: todayStr,
            items: todayItems,
          },
          {
            onConflict: "user_id,date",
          },
        );
        if (error) console.error("Error syncing checklist to Supabase:", error);
      } catch (err) {
        console.error("Supabase checklist sync error:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [checklist, currentUser, mounted]);

  useEffect(() => {
    if (
      !mounted ||
      !currentUser ||
      !currentUser.id ||
      !isSupabaseSupported() ||
      !supabase
    )
      return;
    const client = supabase;

    const timer = setTimeout(async () => {
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        if (todayFluidIdRef.current) {
          const { error } = await client
            .from("fluids")
            .update({ amount: fluidIntake })
            .eq("id", todayFluidIdRef.current);
          if (error) console.error("Error updating fluid in Supabase:", error);
        } else {
          // Check first to see if row already created today
          const { data: existing } = await client
            .from("fluids")
            .select("id")
            .eq("user_id", currentUser.id)
            .eq("date", todayStr)
            .maybeSingle();

          if (existing) {
            todayFluidIdRef.current = existing.id;
            const { error } = await client
              .from("fluids")
              .update({ amount: fluidIntake })
              .eq("id", existing.id);
            if (error)
              console.error("Error updating fluid after verification:", error);
          } else {
            const { data, error } = await client
              .from("fluids")
              .insert({
                user_id: currentUser.id,
                user_email: currentUser.email,
                date: todayStr,
                amount: fluidIntake,
              })
              .select("id")
              .single();
            if (error) {
              console.error("Error inserting fluid in Supabase:", error);
            } else if (data) {
              todayFluidIdRef.current = data.id;
            }
          }
        }
      } catch (err) {
        console.error("Supabase fluid sync error:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [fluidIntake, currentUser, mounted]);

  // Debounced FatSecret search effect
  useEffect(() => {
    if (!mounted) return;

    const delayDebounceFn = setTimeout(
      async () => {
        if (!searchQuery.trim()) {
          setApiSearchResults([]);
          setIsSearching(false);
          return;
        }

        setIsSearching(true);
        try {
          const response = await fetch(
            `/api/foods/search?q=${encodeURIComponent(searchQuery)}`,
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.results)) {
              setApiSearchResults(data.results);
            } else {
              setApiSearchResults([]);
            }
          } else {
            setApiSearchResults([]);
          }
        } catch (err) {
          console.error("FatSecret API search error:", err);
          setApiSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      },
      searchQuery.trim() ? 500 : 0,
    );

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, mounted]);

  // Flash notifications utility
  const flash = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Calculators ---
  // Ideal Body Weight (BBI)
  const bbi = useMemo(() => {
    const base = height - 100;
    if (gender === "male") {
      return base - base * 0.1;
    } else {
      return base - base * 0.15;
    }
  }, [height, gender]);

  // BMI
  const bmi = useMemo(() => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }, [weight, height]);

  // BMI Status
  const bmiStatus = useMemo(() => {
    if (bmi < 18.5)
      return {
        text: "Kekurangan Berat Badan",
        color: "text-amber-600 bg-amber-50 border-amber-100",
      };
    if (bmi >= 18.5 && bmi < 25)
      return {
        text: "Normal / Ideal",
        color: "text-emerald-700 bg-emerald-50 border-emerald-100",
      };
    if (bmi >= 25 && bmi < 30)
      return {
        text: "Kelebihan Berat Badan",
        color: "text-orange-600 bg-orange-50 border-orange-100",
      };
    return {
      text: "Obesitas",
      color: "text-rose-700 bg-rose-50 border-rose-100",
    };
  }, [bmi]);

  // Waist-to-Height Ratio (WHtR) Metabolic index
  const whtr = useMemo(() => {
    if (!height || !waist) return 0;
    return Number((waist / height).toFixed(2));
  }, [waist, height]);

  const whtrStatus = useMemo(() => {
    if (whtr <= 0.5)
      return {
        text: "Rendah (Ideal)",
        color: "text-emerald-700 bg-emerald-50 border-emerald-100",
      };
    if (whtr > 0.5 && whtr <= 0.6)
      return {
        text: "Sedang (Retensi Lemak)",
        color: "text-amber-600 bg-amber-50 border-amber-100",
      };
    return {
      text: "Tinggi (Obesitas Abdominal)",
      color: "text-rose-700 bg-rose-50 border-rose-100",
    };
  }, [whtr]);

  // Active Condition
  const activeCondition = useMemo(() => CONDITIONS[conditionId], [conditionId]);

  // Dynamic Targets
  const targets = useMemo(() => {
    const customCalories = Math.round(
      weight * activeCondition.calorieMultiplier,
    );
    const customProtein = Math.round(weight * activeCondition.proteinPerKg);
    const customCarbs = Math.round((customCalories * 0.55) / 4);
    const customFat = Math.round((customCalories * 0.25) / 9);

    return {
      calories: customCalories,
      protein: customProtein,
      carbs: customCarbs,
      fat: customFat,
      sodium: activeCondition.sodiumLimitMg,
    };
  }, [weight, activeCondition]);

  // Fluid intake Goal
  const fluidGoal = useMemo(() => {
    if (conditionId === "gout") return 3000;
    if (conditionId === "kidney") return 1500;
    return 2000;
  }, [conditionId]);

  // Consumed
  const consumed = useMemo(() => {
    return loggedMeals.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        acc.sodium += item.sodium;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 },
    );
  }, [loggedMeals]);

  // Macronutrient percentage of calories
  const macroBreakdown = useMemo(() => {
    const caloriesFromProtein = Math.round(consumed.protein * 4);
    const caloriesFromCarbs = Math.round(consumed.carbs * 4);
    const caloriesFromFat = Math.round(consumed.fat * 9);
    const totalMacroCals =
      caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;

    if (totalMacroCals === 0) {
      return { proteinPct: 0, carbsPct: 0, fatPct: 0, total: 0 };
    }

    return {
      proteinPct: Math.round((caloriesFromProtein / totalMacroCals) * 100),
      carbsPct: Math.round((caloriesFromCarbs / totalMacroCals) * 100),
      fatPct: Math.round((caloriesFromFat / totalMacroCals) * 100),
      total: totalMacroCals,
    };
  }, [consumed]);

  // Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    if (apiSearchResults.length > 0) {
      return apiSearchResults;
    }
    return FOOD_DATABASE.filter(
      (food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (food.brand &&
          food.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, apiSearchResults]);

  // Baseline weight comparison
  const weightMetrics = useMemo(() => {
    if (weightHistory.length === 0)
      return { baseline: weight, diff: 0, status: "stable" };
    // Sort chronologically
    const sorted = [...weightHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const baseline = sorted[0].weight;
    const current = sorted[sorted.length - 1].weight;
    const diff = Number((current - baseline).toFixed(1));
    return {
      baseline,
      diff,
      status: diff < 0 ? "loss" : diff > 0 ? "gain" : "stable",
    };
  }, [weightHistory, weight]);

  // Dynamic Biochemical Laboratory Analysis
  const labAnalysis = useMemo(() => {
    const analysis: Record<
      string,
      {
        value: number;
        status: string;
        color: string;
        range: string;
        desc: string;
        isAbnormal: boolean;
      }
    > = {};
    const { uricAcid, creatinine, ureum, potassium, sodium, phosphorus } =
      labData;

    if (uricAcid !== undefined) {
      const limitMax = gender === "male" ? 7.0 : 6.0;
      const limitMin = gender === "male" ? 3.4 : 2.4;
      const isHigh = uricAcid > limitMax;
      const isLow = uricAcid < limitMin;
      analysis.uricAcid = {
        value: uricAcid,
        status: isHigh ? "Tinggi (Hiperurisemia)" : isLow ? "Rendah" : "Normal",
        color: isHigh
          ? "text-amber-700 bg-amber-50 border-amber-200"
          : isLow
            ? "text-amber-600 bg-amber-50"
            : "text-emerald-700 bg-emerald-50 border-emerald-100",
        range: gender === "male" ? "3.4 - 7.0 mg/dL" : "2.4 - 6.0 mg/dL",
        desc: "Kadar asam urat dalam darah. Sangat penting dipantau untuk penderita Gout.",
        isAbnormal: isHigh || isLow,
      };
    }

    if (creatinine !== undefined) {
      const limitMax = gender === "male" ? 1.2 : 1.1;
      const limitMin = gender === "male" ? 0.6 : 0.5;
      const isHigh = creatinine > limitMax;
      const isLow = creatinine < limitMin;
      analysis.creatinine = {
        value: creatinine,
        status: isHigh
          ? "Tinggi (Ureum clearance menurun)"
          : isLow
            ? "Rendah"
            : "Normal",
        color: isHigh
          ? "text-rose-700 bg-rose-50 border-rose-200"
          : "text-emerald-700 bg-emerald-50 border-emerald-100",
        range: gender === "male" ? "0.6 - 1.2 mg/dL" : "0.5 - 1.1 mg/dL",
        desc: "Indikator utama fungsi filtrasi ginjal. Nilai tinggi menandakan penurunan fungsi ginjal.",
        isAbnormal: isHigh,
      };
    }

    if (ureum !== undefined) {
      const isHigh = ureum > 45;
      const isLow = ureum < 15;
      analysis.ureum = {
        value: ureum,
        status: isHigh ? "Tinggi (Uremia)" : isLow ? "Rendah" : "Normal",
        color: isHigh
          ? "text-rose-700 bg-rose-50 border-rose-200"
          : "text-emerald-700 bg-emerald-50 border-emerald-100",
        range: "15 - 45 mg/dL",
        desc: "Hasil metabolisme protein. Nilai tinggi menunjukkan penumpukan sisa nitrogen ginjal.",
        isAbnormal: isHigh,
      };
    }

    if (potassium !== undefined) {
      const isHigh = potassium > 5.1;
      const isLow = potassium < 3.5;
      analysis.potassium = {
        value: potassium,
        status: isHigh
          ? "Tinggi (Hiperkalemia)"
          : isLow
            ? "Rendah (Hipokalemia)"
            : "Normal",
        color: isHigh
          ? "text-rose-700 bg-rose-50 border-rose-200"
          : isLow
            ? "text-amber-700 bg-amber-50"
            : "text-emerald-700 bg-emerald-50 border-emerald-100",
        range: "3.5 - 5.1 mEq/L",
        desc: "Kadar elektrolit kalium. Hiperkalemia kritis bagi jantung dan fungsi ginjal.",
        isAbnormal: isHigh || isLow,
      };
    }

    if (sodium !== undefined) {
      const isHigh = sodium > 145;
      const isLow = sodium < 135;
      analysis.sodium = {
        value: sodium,
        status: isHigh
          ? "Tinggi (Hipernatremia)"
          : isLow
            ? "Rendah (Hiponatremia)"
            : "Normal",
        color: isHigh
          ? "text-amber-700 bg-amber-50 border-amber-200"
          : isLow
            ? "text-amber-600 bg-amber-50"
            : "text-emerald-700 bg-emerald-50 border-emerald-100",
        range: "135 - 145 mEq/L",
        desc: "Kadar natrium. Terkait erat dengan retensi cairan dan tekanan darah.",
        isAbnormal: isHigh || isLow,
      };
    }

    if (phosphorus !== undefined) {
      const isHigh = phosphorus > 4.5;
      const isLow = phosphorus < 2.5;
      analysis.phosphorus = {
        value: phosphorus,
        status: isHigh
          ? "Tinggi (Hiperfosfatemia)"
          : isLow
            ? "Rendah"
            : "Normal",
        color: isHigh
          ? "text-rose-700 bg-rose-50 border-rose-200"
          : "text-emerald-700 bg-emerald-50 border-emerald-100",
        range: "2.5 - 4.5 mg/dL",
        desc: "Kadar fosfor. Nilai tinggi dapat merusak tulang dan pembuluh darah pada CKD.",
        isAbnormal: isHigh,
      };
    }

    return analysis;
  }, [labData, gender]);

  // --- Custom Weight SVG Line Graph Coordinates Generator ---
  const svgChartPath = useMemo(() => {
    if (weightHistory.length < 2)
      return { linePath: "", areaPath: "", points: [] };

    // Sort weights chronologically
    const sorted = [...weightHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const width = 450;
    const height = 150;
    const paddingX = 40;
    const paddingY = 20;

    const minWeight = Math.min(...sorted.map((w) => w.weight)) - 1;
    const maxWeight = Math.max(...sorted.map((w) => w.weight)) + 1;
    const rangeY = maxWeight - minWeight === 0 ? 1 : maxWeight - minWeight;

    const points = sorted.map((entry, index) => {
      const x =
        paddingX + (index * (width - 2 * paddingX)) / (sorted.length - 1);
      const y =
        height -
        paddingY -
        ((entry.weight - minWeight) * (height - 2 * paddingY)) / rangeY;
      return { x, y, weight: entry.weight, date: entry.date };
    });

    const linePath = points
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    // Form closed shape for area fill
    const areaPath = `
      ${linePath}
      L ${points[points.length - 1].x} ${height - paddingY}
      L ${points[0].x} ${height - paddingY} Z
    `;

    return { linePath, areaPath, points };
  }, [weightHistory]);

  // --- Handlers ---
  const handleSelectFood = async (food: FoodItem) => {
    if (!food) return;

    if (food.isFatSecret) {
      setIsFetchingDetails(true);
      setSelectedSearchFood(food);
      setSelectedPortionWeight(food.servingWeightGrams || 100);

      try {
        const response = await fetch(
          `/api/foods/get?id=${encodeURIComponent(food.id)}`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.food) {
            setSelectedSearchFood(data.food);
            setSelectedPortionWeight(data.food.servingWeightGrams);
          }
        }
      } catch (err) {
        console.error("Error fetching food details:", err);
      } finally {
        setIsFetchingDetails(false);
      }
    } else {
      setSelectedSearchFood(food);
      setSelectedPortionWeight(food.servingWeightGrams);
    }
  };

  const handleAddMeal = (
    food: FoodItem,
    multiplier: number,
    targetMealType: "Breakfast" | "Lunch" | "Dinner" | "Snack",
  ) => {
    const calculatedGrams = Math.round(food.servingWeightGrams * multiplier);
    const newMeal: LoggedMeal = {
      loggedId: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      name: food.name,
      brand: food.brand,
      calories: Math.round(food.calories * multiplier),
      protein: Number((food.protein * multiplier).toFixed(1)),
      carbs: Number((food.carbs * multiplier).toFixed(1)),
      fat: Number((food.fat * multiplier).toFixed(1)),
      sodium: Math.round(food.sodium * multiplier),
      multiplier,
      loggedGrams: calculatedGrams,
      mealType: targetMealType,
    };

    setLoggedMeals((prev) => [newMeal, ...prev]);

    // Supabase sync
    if (isSupabaseSupported() && supabase && currentUser?.id) {
      supabase
        .from("meals")
        .insert(mapClientMealToDb(newMeal, currentUser.id, currentUser.email))
        .then(({ error }) => {
          if (error) console.error("Error inserting meal to Supabase:", error);
        });
    }

    setSelectedSearchFood(null);
    setSearchQuery("");
    setSearchFocused(false);
    flash(`Ditambahkan ke ${targetMealType}`);
  };

  const handleAddManualMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName) return;

    const multiplier = Number(manualWeight) / 100;
    const newMeal: LoggedMeal = {
      loggedId: Math.random().toString(36).substr(2, 9),
      foodId: "manual",
      name: manualName,
      brand: "Kustom",
      calories: Number(manualCalories) || 0,
      protein: Number(manualProtein) || 0,
      carbs: Number(manualCarbs) || 0,
      fat: Number(manualFat) || 0,
      sodium: Number(manualSodium) || 0,
      multiplier,
      loggedGrams: Number(manualWeight) || 100,
      mealType: selectedMealType,
    };

    setLoggedMeals((prev) => [newMeal, ...prev]);

    // Supabase sync
    if (isSupabaseSupported() && supabase && currentUser?.id) {
      supabase
        .from("meals")
        .insert(mapClientMealToDb(newMeal, currentUser.id, currentUser.email))
        .then(({ error }) => {
          if (error)
            console.error("Error inserting manual meal to Supabase:", error);
        });
    }

    setManualName("");
    setManualCalories("");
    setManualProtein("");
    setManualCarbs("");
    setManualFat("");
    setManualSodium("");
    setManualWeight("100");
    setIsManualMode(false);
    setSearchFocused(false);
    flash("Log kustom ditambahkan.");
  };

  const handleDeleteMeal = (loggedId: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.loggedId !== loggedId));

    // Supabase sync
    if (isSupabaseSupported() && supabase && currentUser?.id) {
      supabase
        .from("meals")
        .delete()
        .eq("logged_id", loggedId)
        .eq("user_id", currentUser.id)
        .then(({ error }) => {
          if (error) console.error("Error deleting meal from Supabase:", error);
        });
    }

    flash("Makanan dihapus dari log.", "error");
  };

  const handleAddWeightLog = (e: React.FormEvent) => {
    e.preventDefault();
    const wtVal = Number(newWeightInput);
    if (!wtVal || !newWeightDate) return;

    const existingIndex = weightHistory.findIndex(
      (w) => w.date === newWeightDate,
    );
    if (existingIndex > -1) {
      // Overwrite weight on same day
      const updated = [...weightHistory];
      updated[existingIndex].weight = wtVal;
      setWeightHistory(updated);
    } else {
      setWeightHistory((prev) => [
        ...prev,
        { date: newWeightDate, weight: wtVal },
      ]);
    }

    // Supabase sync
    if (isSupabaseSupported() && supabase && currentUser?.id) {
      const client = supabase;
      client
        .from("weight_history")
        .select("id")
        .eq("user_id", currentUser.id)
        .eq("date", newWeightDate)
        .maybeSingle()
        .then(({ data: existing, error: selectErr }) => {
          if (selectErr) {
            console.error("Error checking weight history row:", selectErr);
            return;
          }
          if (existing) {
            client
              .from("weight_history")
              .update({ weight: wtVal })
              .eq("id", existing.id)
              .then(({ error }) => {
                if (error)
                  console.error("Error updating weight history:", error);
              });
          } else {
            client
              .from("weight_history")
              .insert({
                user_id: currentUser.id,
                user_email: currentUser.email,
                date: newWeightDate,
                weight: wtVal,
              })
              .then(({ error }) => {
                if (error)
                  console.error("Error inserting weight history:", error);
              });
          }
        });
    }

    // Update active weight profile
    setWeight(wtVal);
    setNewWeightInput("");
    flash(`Log berat badan ${wtVal}kg tersimpan.`);
  };

  const handleDeleteWeightLog = (dateToDelete: string) => {
    setWeightHistory((prev) => prev.filter((w) => w.date !== dateToDelete));

    // Supabase sync
    if (isSupabaseSupported() && supabase && currentUser?.id) {
      supabase
        .from("weight_history")
        .delete()
        .eq("user_id", currentUser.id)
        .eq("date", dateToDelete)
        .then(({ error }) => {
          if (error)
            console.error("Error deleting weight log from Supabase:", error);
        });
    }

    flash("Log berat dihapus.", "error");
  };

  // --- Checklist toggles ---
  const toggleChecklistItem = (itemId: string) => {
    const key = `${new Date().toISOString().split("T")[0]}_${itemId}`;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecklistChecked = (itemId: string) => {
    const key = `${new Date().toISOString().split("T")[0]}_${itemId}`;
    return !!checklist[key];
  };

  // --- Export utilities ---
  const exportToCSV = () => {
    const headers =
      "Tanggal,Jenis Makan,Nama Makanan,Merek,Berat (g),Kalori (kcal),Protein (g),Karbohidrat (g),Lemak (g),Sodium (mg)\n";
    const rows = loggedMeals
      .map((m) => {
        const todayStr = new Date().toLocaleDateString("id-ID");
        return `"${todayStr}","${m.mealType}","${m.name}","${m.brand || "-"}","${m.loggedGrams}","${m.calories}","${m.protein}","${m.carbs}","${m.fat}","${m.sodium}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `NourishLab_Log_Makanan_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flash("Laporan CSV berhasil diunduh.");
  };

  const exportBackupJSON = () => {
    const data = {
      profile: { weight, height, age, gender, activity, conditionId, waist },
      meals: loggedMeals,
      weightHistory,
      fluidIntake,
      checklist,
      labData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `NourishLab_Backup_${new Date().toISOString().split("T")[0]}.json`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flash("Cadangan data JSON berhasil diekspor.");
  };

  // Percentage utilities
  const pct = (val: number, target: number) => {
    return Math.min(Math.round((val / target) * 100), 200);
  };

  const checkFoodWarning = (foodName: string) => {
    const nameLower = foodName.toLowerCase();

    if (conditionId === "kidney") {
      if (
        nameLower.includes("pisang") ||
        nameLower.includes("alpukat") ||
        nameLower.includes("bayam") ||
        nameLower.includes("kentang")
      ) {
        return "Tinggi Kalium — batasi ketat pada penyakit ginjal.";
      }
      if (
        nameLower.includes("sapi") ||
        nameLower.includes("ayam") ||
        nameLower.includes("susu") ||
        nameLower.includes("keju") ||
        nameLower.includes("jeroan")
      ) {
        return "Sumber Protein & Fosfor Tinggi — batasi konsumsi untuk menjaga ginjal.";
      }
    }

    if (conditionId === "hypertension") {
      if (
        nameLower.includes("mie") ||
        nameLower.includes("asin") ||
        nameLower.includes("instan") ||
        nameLower.includes("bakso") ||
        nameLower.includes("keripik") ||
        nameLower.includes("kecap")
      ) {
        return "Tinggi Sodium — hindari untuk diet hipertensi.";
      }
    }

    if (conditionId === "gout") {
      if (
        nameLower.includes("sapi") ||
        nameLower.includes("jeroan") ||
        nameLower.includes("udang") ||
        nameLower.includes("kerang") ||
        nameLower.includes("bayam") ||
        nameLower.includes("kol") ||
        nameLower.includes("alkohol") ||
        nameLower.includes("melinjo")
      ) {
        return "Kaya Purin — berisiko memicu nyeri sendi/serangan asam urat.";
      }
    }

    return null;
  };

  // Hydration fallback & Route Guard
  if (!mounted || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fbfaf7] font-mono text-xs text-[#6f7871]">
        Memuat Rekam Medis NourishLab...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col font-sans bg-[#fbfaf7] print:bg-white print:text-black">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md border text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300 ${notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}
        >
          {notification.type === "success" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          {notification.text}
        </div>
      )}

      {/* Editorial Header */}
      <header className="border-b border-[#e2e8e3] bg-[#fbfaf7] py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:border-b-2 print:pb-4 print:mb-6">
        <div>
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="NourishLab Logo"
              className="h-9 md:h-12 w-auto object-contain"
            />
          </div>
          <p className="text-xs font-mono uppercase tracking-wider text-[#6f7871] mt-2.5 print:hidden">
            Clinical Nutrition Ledger // Pasien: {currentUser.name} (
            {currentUser.email})
          </p>
          <p className="hidden print:block text-[10px] font-mono text-zinc-500 mt-0.5">
            Laporan Resmi Asuhan Mandiri Gizi Klinis Pasien: {currentUser.name}{" "}
            • Dicetak pada: {new Date().toLocaleDateString("id-ID")}
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <nav className="flex items-center gap-1 bg-[#edf2ee] p-1 rounded-lg border border-[#e2e8e3]">
            <button
              onClick={() => setActiveTab("diary")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "diary" ? "bg-white text-[#24402a] shadow-xs" : "text-[#6f7871] hover:text-[#24402a]"}`}
            >
              Harian
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "profile" ? "bg-white text-[#24402a] shadow-xs" : "text-[#6f7871] hover:text-[#24402a]"}`}
            >
              Profil Klinis
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "guide" ? "bg-white text-[#24402a] shadow-xs" : "text-[#6f7871] hover:text-[#24402a]"}`}
            >
              Panduan Edukasi
            </button>
          </nav>

          <button
            onClick={() => window.print()}
            className="p-2 border border-[#e2e8e3] hover:bg-[#edf2ee] text-[#24402a] rounded-lg transition-colors"
            title="Cetak Laporan Medis"
          >
            <Printer className="h-4 w-4" />
          </button>

          <button
            onClick={async () => {
              if (isSupabaseSupported() && supabase) {
                await supabase.auth.signOut();
              }
              localStorage.removeItem("nourishlab_current_user");
              window.location.href = "/";
            }}
            className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-700 hover:text-rose-800 rounded-lg text-xs font-semibold transition-all"
            title="Keluar dari Akun"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Pane - Clinical Details & BMI Stats */}
        <section className="lg:col-span-4 border-r border-[#e2e8e3] p-6 md:p-8 flex flex-col gap-8 bg-[#fdfdfc] print:col-span-12 print:border-r-0 print:p-0 print:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-[#587e61]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#6f7871]">
                Kondisi Klinis Aktif
              </span>
            </div>

            <div className="bg-[#edf2ee] p-5 rounded-xl border border-[#e2e8e3] print:bg-white print:p-3">
              <div className="flex justify-between items-start">
                <h3 className="font-editorial-heading text-lg font-bold text-[#24402a]">
                  {activeCondition.name}
                </h3>
                <span className="text-[10px] font-mono bg-white text-[#24402a] px-2 py-0.5 rounded-full border border-[#cbd3cc] print:hidden">
                  ACTV
                </span>
              </div>
              <p className="text-xs text-[#6f7871] mt-2 leading-relaxed">
                {activeCondition.desc}
              </p>

              <button
                onClick={() => setActiveTab("profile")}
                className="mt-4 flex items-center text-xs font-semibold text-[#587e61] hover:text-[#24402a] transition-all gap-1 group print:hidden"
              >
                Ubah Kondisi Klinis{" "}
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Anthropometric Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-[#587e61]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#6f7871]">
                Metrik Antropometri
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#e2e8e3] rounded-lg print:p-2">
                <p className="text-[11px] text-[#6f7871] uppercase tracking-wider font-mono">
                  Tinggi Badan
                </p>
                <p className="text-xl font-bold mt-1 text-[#24402a]">
                  {height}{" "}
                  <span className="text-xs font-normal text-[#6f7871]">cm</span>
                </p>
              </div>
              <div className="p-4 bg-white border border-[#e2e8e3] rounded-lg print:p-2">
                <p className="text-[11px] text-[#6f7871] uppercase tracking-wider font-mono">
                  Berat Badan
                </p>
                <p className="text-xl font-bold mt-1 text-[#24402a]">
                  {weight}{" "}
                  <span className="text-xs font-normal text-[#6f7871]">kg</span>
                </p>
              </div>
            </div>

            <div className="mt-4 bg-white border border-[#e2e8e3] rounded-xl p-4 flex flex-col gap-3 print:p-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#6f7871]">
                  BMI (Indeks Massa Tubuh)
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${bmiStatus.color}`}
                >
                  {bmi} - {bmiStatus.text}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-[#f1efe9] pt-3">
                <span className="text-[#6f7871]">Berat Badan Ideal (BBI)</span>
                <span className="font-bold text-[#24402a]">
                  {bbi.toFixed(1)} kg
                </span>
              </div>

              {/* Waist-to-height ratio layout */}
              <div className="flex flex-col border-t border-[#f1efe9] pt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6f7871]">
                    Lingkar Pinggang / WHtR
                  </span>
                  <span className="font-bold text-[#24402a]">
                    {waist} cm / {whtr}
                  </span>
                </div>
                <div
                  className={`text-[10px] mt-2 px-2.5 py-1.5 rounded-lg border font-mono ${whtrStatus.color}`}
                >
                  {whtrStatus.text}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Clinical Caps Summary */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6f7871]">
                Alokasi Gizi Harian
              </span>
              <span className="text-[10px] font-mono text-[#6f7871] italic print:hidden">
                Estimasi Akurat
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border-b border-[#e2e8e3] text-xs">
                <span className="font-medium text-[#24402a]">
                  Kalori (Energi)
                </span>
                <span className="font-bold font-mono text-[#24402a]">
                  {targets.calories} kcal
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border-b border-[#e2e8e3] text-xs">
                <div>
                  <span className="font-medium text-[#24402a]">Protein</span>
                  {conditionId === "kidney" && (
                    <span className="text-[9px] text-amber-600 block italic">
                      Dibatasi ketat
                    </span>
                  )}
                </div>
                <span className="font-bold font-mono text-[#24402a]">
                  {targets.protein} g
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border-b border-[#e2e8e3] text-xs">
                <div>
                  <span className="font-medium text-[#24402a]">
                    Sodium (Garam)
                  </span>
                  {conditionId === "hypertension" && (
                    <span className="text-[9px] text-rose-600 block font-semibold italic">
                      DASH Strict Limit
                    </span>
                  )}
                </div>
                <span className="font-bold font-mono text-[#24402a]">
                  &lt; {targets.sodium} mg
                </span>
              </div>
              <div className="flex items-center justify-between p-3 text-xs border-b border-[#e2e8e3] lg:border-b-0">
                <span className="font-medium text-[#24402a]">
                  Karbohidrat / Lemak
                </span>
                <span className="font-mono text-[#6f7871]">
                  {targets.carbs}g / {targets.fat}g
                </span>
              </div>
            </div>
          </div>

          {/* Weight History Analytics Panel */}
          <div className="print:hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#587e61]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#6f7871]">
                  Progress Berat Badan
                </span>
              </div>
              {weightMetrics.diff !== 0 && (
                <div
                  className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${weightMetrics.status === "loss" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}
                >
                  <TrendingDown className="h-3 w-3" />
                  <span>
                    {weightMetrics.diff > 0
                      ? `+${weightMetrics.diff}`
                      : weightMetrics.diff}{" "}
                    kg vs awal
                  </span>
                </div>
              )}
            </div>

            {weightHistory.length > 0 ? (
              <div className="bg-white border border-[#e2e8e3] rounded-xl p-4 flex flex-col items-center">
                {/* SVG Graphic Graph */}
                <svg
                  viewBox="0 0 450 150"
                  className="w-full h-28 stroke-[#24402a]"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#587e61" stopOpacity="0.2" />
                      <stop
                        offset="100%"
                        stopColor="#587e61"
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line
                    x1="40"
                    y1="20"
                    x2="410"
                    y2="20"
                    stroke="#f1efe9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="40"
                    y1="75"
                    x2="410"
                    y2="75"
                    stroke="#f1efe9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="40"
                    y1="130"
                    x2="410"
                    y2="130"
                    stroke="#cbd3cc"
                    strokeWidth="1"
                  />

                  {/* Area fill */}
                  {svgChartPath.areaPath && (
                    <path
                      d={svgChartPath.areaPath}
                      fill="url(#chartGradient)"
                      stroke="none"
                    />
                  )}

                  {/* Trend Line */}
                  {svgChartPath.linePath && (
                    <path
                      d={svgChartPath.linePath}
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Nodes & Labels */}
                  {svgChartPath.points.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#ffffff"
                        stroke="#24402a"
                        strokeWidth="2"
                      />
                      {/* Only label first, middle, and last to avoid clutter */}
                      {(idx === 0 ||
                        idx === svgChartPath.points.length - 1 ||
                        svgChartPath.points.length === 3) && (
                        <text
                          x={p.x}
                          y={p.y - 8}
                          fontSize="9"
                          textAnchor="middle"
                          fill="#24402a"
                          fontWeight="bold"
                          className="font-mono"
                        >
                          {p.weight}k
                        </text>
                      )}
                    </g>
                  ))}
                </svg>

                {/* Weight entry logger inside left panel */}
                <form
                  onSubmit={handleAddWeightLog}
                  className="w-full border-t border-[#f1efe9] pt-3 mt-2 flex gap-2"
                >
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Log BB baru (kg)"
                    value={newWeightInput}
                    onChange={(e) => setNewWeightInput(e.target.value)}
                    required
                    className="flex-1 px-3 py-1.5 text-xs border border-[#cbd3cc] rounded outline-none bg-[#fbfaf7] focus:bg-white text-[#24402a]"
                  />
                  <button
                    type="submit"
                    className="bg-[#24402a] hover:bg-[#587e61] text-white text-xs px-3 py-1.5 rounded transition-all font-semibold"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center p-6 bg-white border border-[#e2e8e3] rounded-xl text-xs text-[#6f7871] italic">
                Belum ada data timbangan. Mulai isi berat Anda.
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-[#e2e8e3] text-[10px] text-[#6f7871] font-mono leading-relaxed flex items-start gap-2 print:hidden">
            <Info className="h-3 w-3 shrink-0 mt-0.5 text-[#587e61]" />
            <span>
              Tolak ukur asuhan dihitung berdasarkan pedoman IDCN (Indonesian
              Dietetics and Nutrition). Konsultasikan asuhan berat dengan dokter
              spesialis gizi klinik.
            </span>
          </div>
        </section>

        {/* Right Workspace - Tab Views */}
        <section className="lg:col-span-8 p-6 md:p-10 flex flex-col gap-8 print:col-span-12 print:p-0 print:gap-6">
          {/* TAB 1: DIARY & TRACKING */}
          {activeTab === "diary" && (
            <>
              {/* Top Nutrient Progress Rings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 print:grid-cols-3 print:gap-2">
                {/* Calories Card */}
                <div className="bg-white border border-[#e2e8e3] p-5 rounded-xl flex items-center justify-between shadow-xs print:p-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono uppercase text-[#6f7871]">
                      Kalori
                    </span>
                    <span className="text-2xl font-bold mt-1 text-[#24402a] print:text-lg">
                      {consumed.calories}
                    </span>
                    <span className="text-[10px] text-[#6f7871] mt-0.5">
                      dari target {targets.calories} kcal
                    </span>
                  </div>
                  <div className="relative h-16 w-16 print:h-12 print:w-12">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#edf2ee"
                        strokeWidth="6"
                        fill="transparent"
                        className="print:stroke-zinc-100"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#587e61"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          26 *
                          (1 - pct(consumed.calories, targets.calories) / 100)
                        }
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-in-out print:stroke-zinc-800"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#24402a] font-mono print:text-[10px]">
                      {pct(consumed.calories, targets.calories)}%
                    </span>
                  </div>
                </div>

                {/* Protein Card */}
                <div className="bg-white border border-[#e2e8e3] p-5 rounded-xl flex items-center justify-between shadow-xs print:p-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono uppercase text-[#6f7871]">
                      Protein
                    </span>
                    <span className="text-2xl font-bold mt-1 text-[#24402a] print:text-lg">
                      {consumed.protein.toFixed(1)}g
                    </span>
                    <span className="text-[10px] text-[#6f7871] mt-0.5">
                      dari target {targets.protein}g
                    </span>
                  </div>
                  <div className="relative h-16 w-16 print:h-12 print:w-12">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#edf2ee"
                        strokeWidth="6"
                        fill="transparent"
                        className="print:stroke-zinc-100"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke={
                          consumed.protein > targets.protein &&
                          conditionId === "kidney"
                            ? "#b85233"
                            : "#24402a"
                        }
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          26 *
                          (1 - pct(consumed.protein, targets.protein) / 100)
                        }
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-in-out print:stroke-zinc-850"
                      />
                    </svg>
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold font-mono print:text-[10px] ${consumed.protein > targets.protein && conditionId === "kidney" ? "text-[#b85233]" : "text-[#24402a]"}`}
                    >
                      {pct(consumed.protein, targets.protein)}%
                    </span>
                  </div>
                </div>

                {/* Sodium Card */}
                <div
                  className={`border p-5 rounded-xl flex items-center justify-between shadow-xs transition-colors duration-300 print:p-3 ${consumed.sodium > targets.sodium ? "bg-rose-50/50 border-rose-200" : "bg-white border-[#e2e8e3]"}`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-mono uppercase text-[#6f7871]">
                      Sodium (Garam)
                    </span>
                    <span
                      className={`text-2xl font-bold mt-1 print:text-lg ${consumed.sodium > targets.sodium ? "text-[#b85233]" : "text-[#24402a]"}`}
                    >
                      {consumed.sodium}mg
                    </span>
                    <span className="text-[10px] text-[#6f7871] mt-0.5">
                      batas &lt; {targets.sodium}mg
                    </span>
                  </div>
                  <div className="relative h-16 w-16 print:h-12 print:w-12">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#edf2ee"
                        strokeWidth="6"
                        fill="transparent"
                        className="print:stroke-zinc-100"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke={
                          consumed.sodium > targets.sodium
                            ? "#b85233"
                            : "#4c6e54"
                        }
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          26 *
                          (1 - pct(consumed.sodium, targets.sodium) / 100)
                        }
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-in-out print:stroke-zinc-800"
                      />
                    </svg>
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold font-mono print:text-[10px] ${consumed.sodium > targets.sodium ? "text-[#b85233]" : "text-[#24402a]"}`}
                    >
                      {pct(consumed.sodium, targets.sodium)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* NEW: Macronutrient Balance Segmented Progress Bar */}
              <div className="bg-white border border-[#e2e8e3] p-5 rounded-xl shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono uppercase text-[#6f7871] flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#587e61]" />{" "}
                    Keseimbangan Zat Gizi Makro
                  </span>
                  <span className="text-[10px] font-mono text-[#6f7871]">
                    Total Asupan: {macroBreakdown.total} kcal dari makro
                  </span>
                </div>

                {/* Horizontal Segmented Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden bg-zinc-100 flex">
                  {macroBreakdown.total > 0 ? (
                    <>
                      <div
                        style={{ flexBasis: `${macroBreakdown.carbsPct}%` }}
                        className="bg-[#24402a] h-full transition-all duration-500"
                        title={`Karbohidrat: ${macroBreakdown.carbsPct}%`}
                      />
                      <div
                        style={{ flexBasis: `${macroBreakdown.proteinPct}%` }}
                        className="bg-[#587e61] h-full transition-all duration-500"
                        title={`Protein: ${macroBreakdown.proteinPct}%`}
                      />
                      <div
                        style={{ flexBasis: `${macroBreakdown.fatPct}%` }}
                        className="bg-[#d8c3a5] h-full transition-all duration-500"
                        title={`Lemak: ${macroBreakdown.fatPct}%`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-zinc-100 h-full" />
                  )}
                </div>

                {/* Macro exact details & target comparisons */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono text-center">
                  <div className="flex flex-col border-r border-[#f1efe9]">
                    <span className="text-[10px] text-[#6f7871] flex items-center justify-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#24402a]" />{" "}
                      Karbohidrat
                    </span>
                    <span className="font-bold text-[#24402a] mt-1">
                      {consumed.carbs.toFixed(1)}g
                    </span>
                    <span className="text-[9px] text-[#6f7871] mt-0.5">
                      Target: {targets.carbs}g
                    </span>
                  </div>
                  <div className="flex flex-col border-r border-[#f1efe9]">
                    <span className="text-[10px] text-[#6f7871] flex items-center justify-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#587e61]" />{" "}
                      Protein
                    </span>
                    <span className="font-bold text-[#24402a] mt-1">
                      {consumed.protein.toFixed(1)}g
                    </span>
                    <span className="text-[9px] text-[#6f7871] mt-0.5">
                      Target: {targets.protein}g
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#6f7871] flex items-center justify-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#d8c3a5]" />{" "}
                      Lemak
                    </span>
                    <span className="font-bold text-[#24402a] mt-1">
                      {consumed.fat.toFixed(1)}g
                    </span>
                    <span className="text-[9px] text-[#6f7871] mt-0.5">
                      Target: {targets.fat}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Messages for Target Breaches and Biochem Anomalies */}
              <div className="flex flex-col gap-3">
                {/* Target breaches */}
                {consumed.sodium > targets.sodium && (
                  <div className="bg-[#fdf5f2] border border-[#f5d9d0] text-[#b85233] px-4 py-3 rounded-lg flex items-center gap-3 text-xs print:bg-white print:border-rose-500">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <p>
                      <strong>Peringatan Asupan Garam (Hipertensi):</strong>{" "}
                      Akumulasi sodium Anda ({consumed.sodium}mg) melebihi batas
                      asupan harian optimal ({targets.sodium}mg). Kurangi bumbu
                      tambahan hari ini.
                    </p>
                  </div>
                )}

                {consumed.protein > targets.protein &&
                  conditionId === "kidney" && (
                    <div className="bg-[#fdf5f2] border border-[#f5d9d0] text-[#b85233] px-4 py-3 rounded-lg flex items-center gap-3 text-xs print:bg-white print:border-amber-500">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <p>
                        <strong>
                          Peringatan Asupan Protein (Penyakit Ginjal):
                        </strong>{" "}
                        Protein melebihi target rendah protein (
                        {targets.protein}g). Kelebihan protein meningkatkan
                        beban urea ginjal Anda.
                      </p>
                    </div>
                  )}

                {/* Biochem warnings based on laboratory results */}
                {labAnalysis.potassium?.isAbnormal &&
                  conditionId === "kidney" &&
                  labData.potassium! > 5.1 && (
                    <div className="bg-[#fdf5f2] border border-[#f5d9d0] text-[#b85233] px-4 py-3 rounded-lg flex items-center gap-3 text-xs print:bg-white print:border-rose-400">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <p>
                        <strong>
                          Hiperkalemia Klinis (Tes Darah {labData.lastUpdated}):
                        </strong>{" "}
                        Kadar kalium darah Anda ({labData.potassium} mEq/L)
                        berada di atas batas normal. Batasi konsumsi kentang,
                        bayam, alpukat, dan pisang.
                      </p>
                    </div>
                  )}

                {labAnalysis.uricAcid?.isAbnormal && conditionId === "gout" && (
                  <div className="bg-[#fdf5f2] border border-[#f5d9d0] text-[#b85233] px-4 py-3 rounded-lg flex items-center gap-3 text-xs print:bg-white print:border-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <p>
                      <strong>
                        Hiperurisemia Klinis (Tes Darah {labData.lastUpdated}):
                      </strong>{" "}
                      Kadar asam urat Anda ({labData.uricAcid} mg/dL) terdeteksi
                      tinggi. Batasi ketat makanan kaya purin hari ini.
                    </p>
                  </div>
                )}
              </div>

              {/* NEW: Side-by-Side Hydration Tracker and Daily Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
                {/* Fluid Tracker Card */}
                <div className="bg-white border border-[#e2e8e3] p-5 rounded-xl shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-mono uppercase text-[#6f7871] flex items-center gap-1.5">
                        <Droplet className="h-4 w-4 text-blue-500" /> Pelacak
                        Cairan & Hidrasi
                      </span>
                      <button
                        onClick={() => {
                          setFluidIntake(0);
                          flash("Catatan cairan direset.", "error");
                        }}
                        className="text-[10px] text-[#6f7871] hover:text-[#b85233] font-mono flex items-center gap-1"
                        title="Reset"
                      >
                        <RefreshCw className="h-3 w-3" /> Reset
                      </button>
                    </div>

                    <div className="flex justify-between items-baseline mt-1">
                      <p className="text-xl font-bold text-[#24402a]">
                        {fluidIntake}{" "}
                        <span className="text-xs font-normal text-[#6f7871]">
                          ml
                        </span>
                      </p>
                      <span className="text-xs text-[#6f7871]">
                        Target: {fluidGoal} ml
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-100 h-2.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (fluidIntake / fluidGoal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Water quick-add buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <button
                      onClick={() => {
                        setFluidIntake((prev) => prev + 250);
                        flash("+250 ml Air Ditambahkan");
                      }}
                      className="border border-[#e2e8e3] hover:bg-[#edf2ee] text-[#24402a] text-[10px] font-semibold py-2 px-1 rounded transition-colors"
                    >
                      +250ml (Gelas)
                    </button>
                    <button
                      onClick={() => {
                        setFluidIntake((prev) => prev + 500);
                        flash("+500 ml Air Ditambahkan");
                      }}
                      className="border border-[#e2e8e3] hover:bg-[#edf2ee] text-[#24402a] text-[10px] font-semibold py-2 px-1 rounded transition-colors"
                    >
                      +500ml (Botol)
                    </button>
                    <button
                      onClick={() => {
                        setFluidIntake((prev) => prev + 750);
                        flash("+750 ml Air Ditambahkan");
                      }}
                      className="border border-[#e2e8e3] hover:bg-[#edf2ee] text-[#24402a] text-[10px] font-semibold py-2 px-1 rounded transition-colors"
                    >
                      +750ml (Besar)
                    </button>
                  </div>
                </div>

                {/* Daily Checklist Card */}
                <div className="bg-white border border-[#e2e8e3] p-5 rounded-xl shadow-xs flex flex-col">
                  <span className="text-xs font-mono uppercase text-[#6f7871] mb-3 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-[#587e61]" /> Checklist
                    Harian: {activeCondition.name}
                  </span>

                  <div className="flex-1 flex flex-col justify-center divide-y divide-[#f1efe9]">
                    {CHECKLIST_ITEMS[conditionId].map((item) => {
                      const checked = isChecklistChecked(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklistItem(item.id)}
                          className="py-2.5 flex items-center gap-2.5 cursor-pointer select-none group text-xs text-[#24402a]"
                        >
                          <div
                            className={`h-4 w-4 shrink-0 border rounded flex items-center justify-center transition-all ${checked ? "bg-[#24402a] border-[#24402a]" : "border-[#cbd3cc] group-hover:border-[#587e61]"}`}
                          >
                            {checked && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`transition-all leading-snug ${checked ? "line-through text-[#6f7871]" : "font-medium"}`}
                          >
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Add Food Console Area */}
              <div className="bg-white border border-[#e2e8e3] rounded-xl shadow-xs p-6 relative print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h3 className="font-editorial-heading text-lg font-bold text-[#24402a]">
                      Catat Konsumsi Makanan
                    </h3>
                    <p className="text-xs text-[#6f7871]">
                      Cari makanan melalui FatSecret API mockup atau ketik
                      manual.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6f7871]">Porsi untuk:</span>
                    <select
                      value={selectedMealType}
                      onChange={(e) =>
                        setSelectedMealType(
                          e.target.value as
                            | "Breakfast"
                            | "Lunch"
                            | "Dinner"
                            | "Snack",
                        )
                      }
                      className="text-xs border border-[#cbd3cc] rounded bg-white px-2 py-1 outline-none text-[#24402a] font-medium"
                    >
                      <option value="Breakfast">Sarapan</option>
                      <option value="Lunch">Makan Siang</option>
                      <option value="Dinner">Makan Malam</option>
                      <option value="Snack">Cemilan</option>
                    </select>
                  </div>
                </div>

                {/* Form type switcher */}
                <div className="flex gap-4 mb-4 border-b border-[#f1efe9] pb-2">
                  <button
                    onClick={() => {
                      setIsManualMode(false);
                      setSelectedSearchFood(null);
                    }}
                    className={`text-xs font-semibold pb-1 border-b-2 transition-all ${!isManualMode ? "border-[#587e61] text-[#24402a]" : "border-transparent text-[#6f7871] hover:text-[#24402a]"}`}
                  >
                    Cari Database (FatSecret)
                  </button>
                  <button
                    onClick={() => {
                      setIsManualMode(true);
                      setSelectedSearchFood(null);
                    }}
                    className={`text-xs font-semibold pb-1 border-b-2 transition-all ${isManualMode ? "border-[#587e61] text-[#24402a]" : "border-transparent text-[#6f7871] hover:text-[#24402a]"}`}
                  >
                    Input Manual / Kustom
                  </button>
                </div>

                {!isManualMode ? (
                  <div className="relative">
                    {/* Search Input Box */}
                    <div className="relative flex items-center">
                      <Search className="absolute left-3.5 h-4 w-4 text-[#6f7871]" />
                      <input
                        type="text"
                        placeholder="Ketik nama makanan (misal: Nasi, Ayam, Pisang, Ceri, Teri...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8e3] rounded-lg bg-[#fbfaf7] text-xs outline-none focus:border-[#587e61] focus:bg-white transition-all text-[#18221b]"
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    {searchFocused && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-[#e2e8e3] rounded-lg shadow-lg mt-1 z-20 max-h-72 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-4 text-center text-xs text-[#6f7871] flex items-center justify-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin text-[#587e61]" />
                            <span>Mencari makanan...</span>
                          </div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((food) => {
                            const warningMsg = checkFoodWarning(food.name);
                            return (
                              <div
                                key={food.id}
                                onClick={() => handleSelectFood(food)}
                                className="p-3 border-b border-[#f1efe9] hover:bg-[#edf2ee] cursor-pointer flex items-center justify-between transition-colors"
                              >
                                <div>
                                  <p className="text-xs font-semibold text-[#24402a]">
                                    {food.name}{" "}
                                    {food.brand && (
                                      <span className="text-[10px] text-[#587e61] font-normal">
                                        ({food.brand})
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-[#6f7871] mt-0.5">
                                    Porsi standar: {food.servingSize} (
                                    {food.servingWeightGrams}g) •{" "}
                                    {food.calories} kcal • P: {food.protein}g •
                                    S: {food.sodium}mg
                                  </p>
                                  {warningMsg && (
                                    <div className="flex items-center gap-1 mt-1 text-[9px] font-semibold text-[#b85233]">
                                      <AlertTriangle className="h-2.5 w-2.5" />
                                      <span>{warningMsg}</span>
                                    </div>
                                  )}
                                </div>
                                <Plus className="h-4 w-4 text-[#587e61]" />
                              </div>
                            );
                          })
                        ) : searchQuery.trim() !== "" ? (
                          <div className="p-4 text-center text-xs text-[#6f7871]">
                            Tidak ditemukan hasil. Gunakan menu{" "}
                            <strong>Input Manual</strong> untuk mencatat kustom.
                          </div>
                        ) : (
                          <div className="p-4 text-xs text-[#6f7871] flex flex-col gap-2">
                            <span className="font-semibold text-[#24402a] mb-1">
                              Rekomendasi makanan cepat:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {FOOD_DATABASE.slice(0, 9).map((food) => (
                                <button
                                  key={food.id}
                                  onClick={() => {
                                    setSearchQuery(food.name);
                                    handleSelectFood(food);
                                  }}
                                  className="text-left px-2 py-1.5 border border-[#e2e8e3] rounded hover:bg-[#edf2ee] transition-all text-[11px] truncate text-[#24402a]"
                                >
                                  {food.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-2 border-t border-[#f1efe9] bg-[#fbfaf7] text-right">
                          <button
                            onClick={() => setSearchFocused(false)}
                            className="text-[10px] font-semibold uppercase tracking-wider text-[#6f7871] hover:text-[#24402a] px-2 py-1"
                          >
                            Tutup Panel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Weight Adjustment Panel for chosen search item */}
                    {selectedSearchFood && (
                      <div className="mt-4 p-4 border border-[#e2e8e3] bg-[#edf2ee]/40 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in duration-200">
                        {isFetchingDetails ? (
                          <div className="flex items-center justify-center gap-2 w-full py-2">
                            <RefreshCw className="h-4 w-4 animate-spin text-[#587e61]" />
                            <span className="text-xs text-[#6f7871]">
                              Mengambil detail nutrisi...
                            </span>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="text-xs text-[#24402a] font-semibold">
                                Sesuaikan Porsi Log:
                              </p>
                              <p className="text-sm font-bold text-[#24402a] mt-0.5">
                                {selectedSearchFood.name}{" "}
                                {selectedSearchFood.brand && (
                                  <span className="text-xs font-normal text-[#587e61]">
                                    ({selectedSearchFood.brand})
                                  </span>
                                )}
                                <span className="text-xs font-normal text-[#6f7871] ml-1">
                                  ({selectedPortionWeight} gram)
                                </span>
                              </p>
                              <div className="grid grid-cols-4 gap-2 mt-2 text-[10px] font-mono text-[#6f7871]">
                                <span>
                                  Kcal:{" "}
                                  {Math.round(
                                    selectedSearchFood.calories *
                                      (selectedPortionWeight /
                                        selectedSearchFood.servingWeightGrams),
                                  )}
                                </span>
                                <span>
                                  Prot:{" "}
                                  {(
                                    selectedSearchFood.protein *
                                    (selectedPortionWeight /
                                      selectedSearchFood.servingWeightGrams)
                                  ).toFixed(1)}
                                  g
                                </span>
                                <span>
                                  Carb:{" "}
                                  {(
                                    selectedSearchFood.carbs *
                                    (selectedPortionWeight /
                                      selectedSearchFood.servingWeightGrams)
                                  ).toFixed(1)}
                                  g
                                </span>
                                <span>
                                  Sod:{" "}
                                  {Math.round(
                                    selectedSearchFood.sodium *
                                      (selectedPortionWeight /
                                        selectedSearchFood.servingWeightGrams),
                                  )}
                                  mg
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                              <div className="flex items-center border border-[#cbd3cc] rounded bg-white overflow-hidden">
                                <input
                                  type="number"
                                  value={selectedPortionWeight}
                                  onChange={(e) =>
                                    setSelectedPortionWeight(
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                  className="w-16 px-2 py-1 text-xs text-center outline-none text-[#24402a]"
                                />
                                <span className="text-[10px] bg-[#fbfaf7] px-2 py-1 border-l border-[#e2e8e3] text-[#6f7871] font-mono">
                                  g
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  const mult =
                                    selectedPortionWeight /
                                    selectedSearchFood.servingWeightGrams;
                                  handleAddMeal(
                                    selectedSearchFood,
                                    mult,
                                    selectedMealType,
                                  );
                                }}
                                className="bg-[#24402a] hover:bg-[#587e61] text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                              >
                                Tambah ke{" "}
                                {selectedMealType === "Breakfast"
                                  ? "Sarapan"
                                  : selectedMealType === "Lunch"
                                    ? "Siang"
                                    : selectedMealType === "Dinner"
                                      ? "Malam"
                                      : "Cemilan"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Manual input form */
                  <form
                    onSubmit={handleAddManualMeal}
                    className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-2 animate-in fade-in duration-200"
                  >
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-[#6f7871]">
                        Nama Makanan
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik nama makanan..."
                        required
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="border border-[#cbd3cc] rounded px-2.5 py-1.5 text-xs outline-none bg-[#fbfaf7] focus:bg-white text-[#24402a]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-[#6f7871]">
                        Porsi (g)
                      </label>
                      <input
                        type="number"
                        required
                        value={manualWeight}
                        onChange={(e) => setManualWeight(e.target.value)}
                        className="border border-[#cbd3cc] rounded px-2.5 py-1.5 text-xs outline-none bg-[#fbfaf7] focus:bg-white text-[#24402a] text-center"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-[#6f7871]">
                        Energi (kcal)
                      </label>
                      <input
                        type="number"
                        value={manualCalories}
                        onChange={(e) => setManualCalories(e.target.value)}
                        className="border border-[#cbd3cc] rounded px-2.5 py-1.5 text-xs outline-none bg-[#fbfaf7] focus:bg-white text-[#24402a] text-center"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-[#6f7871]">
                        Prot (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={manualProtein}
                        onChange={(e) => setManualProtein(e.target.value)}
                        className="border border-[#cbd3cc] rounded px-2.5 py-1.5 text-xs outline-none bg-[#fbfaf7] focus:bg-white text-[#24402a] text-center"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-[#6f7871]">
                        Sodium (mg)
                      </label>
                      <input
                        type="number"
                        value={manualSodium}
                        onChange={(e) => setManualSodium(e.target.value)}
                        className="border border-[#cbd3cc] rounded px-2.5 py-1.5 text-xs outline-none bg-[#fbfaf7] focus:bg-white text-[#24402a] text-center"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-6 flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsManualMode(false)}
                        className="text-xs text-[#6f7871] hover:text-[#24402a] px-3 py-1.5"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-[#24402a] hover:bg-[#587e61] text-white text-xs px-4 py-1.5 rounded transition-all font-semibold"
                      >
                        Simpan Log Manual
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Logged Meal Ledger History */}
              <div className="flex flex-col gap-4 print:gap-2">
                <h3 className="font-editorial-heading text-lg font-bold text-[#24402a] pb-2 border-b border-[#e2e8e3] print:text-sm print:pb-1">
                  Jurnal Makanan Hari Ini
                </h3>

                {(["Breakfast", "Lunch", "Dinner", "Snack"] as const).map(
                  (mealSection) => {
                    const sectionMeals = loggedMeals.filter(
                      (m) => m.mealType === mealSection,
                    );
                    const titleMap = {
                      Breakfast: "Sarapan",
                      Lunch: "Makan Siang",
                      Dinner: "Makan Malam",
                      Snack: "Cemilan",
                    };

                    const sectionTotals = sectionMeals.reduce(
                      (acc, m) => {
                        acc.calories += m.calories;
                        acc.protein += m.protein;
                        acc.sodium += m.sodium;
                        return acc;
                      },
                      { calories: 0, protein: 0, sodium: 0 },
                    );

                    return (
                      <div
                        key={mealSection}
                        className="bg-white border border-[#e2e8e3] rounded-xl overflow-hidden shadow-xs print:border-zinc-200"
                      >
                        <div className="bg-[#fdfdfc] border-b border-[#e2e8e3] px-5 py-3 flex justify-between items-center print:py-1.5 print:px-3 print:bg-zinc-50">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#587e61] print:bg-zinc-800" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#24402a] print:text-[10px] print:text-zinc-800">
                              {titleMap[mealSection]}
                            </h4>
                          </div>
                          <div className="text-[10px] font-mono text-[#6f7871] print:text-[9px] print:text-zinc-650">
                            Total: {sectionTotals.calories} kcal • P:{" "}
                            {sectionTotals.protein.toFixed(1)}g • S:{" "}
                            {sectionTotals.sodium}mg
                          </div>
                        </div>

                        {sectionMeals.length > 0 ? (
                          <div className="divide-y divide-[#f1efe9] print:divide-zinc-200">
                            {sectionMeals.map((meal) => {
                              const foodWarning = checkFoodWarning(meal.name);
                              return (
                                <div
                                  key={meal.loggedId}
                                  className="px-5 py-3.5 flex items-center justify-between group hover:bg-[#edf2ee]/20 transition-all print:py-2 print:px-3"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                      <p className="text-xs font-semibold text-[#24402a] truncate print:text-[11px] print:text-black">
                                        {meal.name}
                                      </p>
                                      <span className="text-[10px] text-[#6f7871] font-mono shrink-0 print:text-[9px]">
                                        {meal.loggedGrams}g
                                      </span>
                                    </div>

                                    <div className="flex flex-wrap gap-x-3 text-[10px] text-[#6f7871] mt-1 print:text-[9px] print:text-zinc-500">
                                      <span>
                                        Energi:{" "}
                                        <strong className="text-[#24402a] font-normal print:text-black">
                                          {meal.calories} kcal
                                        </strong>
                                      </span>
                                      <span>
                                        Protein:{" "}
                                        <strong className="text-[#24402a] font-normal print:text-black">
                                          {meal.protein}g
                                        </strong>
                                      </span>
                                      <span>
                                        Sodium:{" "}
                                        <strong
                                          className={
                                            meal.sodium > 200
                                              ? "text-[#b85233] font-semibold"
                                              : "text-[#24402a] font-normal print:text-black"
                                          }
                                        >
                                          {meal.sodium}mg
                                        </strong>
                                      </span>
                                    </div>

                                    {foodWarning && (
                                      <span className="text-[9px] text-[#b85233] font-medium block mt-1 print:hidden">
                                        * {foodWarning}
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    onClick={() =>
                                      handleDeleteMeal(meal.loggedId)
                                    }
                                    className="text-[#6f7871] hover:text-[#b85233] opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded hover:bg-rose-50 print:hidden"
                                    title="Hapus Makanan"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-xs text-[#6f7871] italic print:py-2 print:text-[10px] print:text-zinc-400">
                            Belum ada makanan terdaftar untuk{" "}
                            {titleMap[mealSection].toLowerCase()}.
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>

              {/* Offline backup panel */}
              <div className="mt-8 pt-6 border-t border-[#e2e8e3] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border print:hidden shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-[#24402a] uppercase tracking-wider font-mono">
                    Simpan & Ekspor Cadangan Data
                  </h4>
                  <p className="text-[11px] text-[#6f7871] mt-1">
                    Ekspor laporan makanan harian Anda ke format CSV atau
                    cadangkan data profil lokal.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e2e8e3] hover:bg-[#edf2ee] rounded text-[11px] font-semibold text-[#24402a] transition-all"
                  >
                    <Download className="h-3.5 w-3.5" /> Unduh CSV
                  </button>
                  <button
                    onClick={exportBackupJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e2e8e3] hover:bg-[#edf2ee] rounded text-[11px] font-semibold text-[#24402a] transition-all"
                  >
                    <Save className="h-3.5 w-3.5" /> Ekspor JSON
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CLINICAL PROFILE INPUTS */}
          {activeTab === "profile" && (
            <div className="bg-white border border-[#e2e8e3] p-6 md:p-8 rounded-xl shadow-xs animate-in fade-in duration-200">
              <h2 className="font-editorial-heading text-xl font-bold text-[#24402a] mb-2">
                Konfigurasi Profil Klinis & Target Gizi
              </h2>
              <p className="text-xs text-[#6f7871] mb-6">
                Sesuaikan biometrik tubuh dan kondisi klinis Anda. Sistem akan
                menghitung otomatis asupan protein, kalori, dan natrium yang
                aman.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setActiveTab("diary");
                }}
                className="space-y-6"
              >
                {/* 1. Clinical Condition Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#24402a] block mb-3">
                    Kondisi Kesehatan
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(CONDITIONS).map((cond) => (
                      <div
                        key={cond.id}
                        onClick={() => setConditionId(cond.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${conditionId === cond.id ? "bg-[#edf2ee] border-[#587e61] ring-1 ring-[#587e61]" : "bg-white border-[#e2e8e3] hover:border-[#587e61]/50"}`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#24402a]">
                              {cond.name}
                            </span>
                            {conditionId === cond.id && (
                              <CheckCircle className="h-4 w-4 text-[#587e61]" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#6f7871] mt-2 leading-relaxed">
                            {cond.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#cbd3cc]/30 flex flex-wrap gap-2 text-[9px] font-mono text-[#6f7871]">
                          <span>Calorie: {cond.calorieMultiplier}x BB</span>
                          <span>Prot: {cond.proteinPerKg}g/kg</span>
                          <span>Sod: &lt; {cond.sodiumLimitMg}mg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Biometric Numbers */}
                <div className="border-t border-[#f1efe9] pt-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#24402a] block mb-3">
                    Metrik Biometrik Tubuh
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-[#6f7871] font-semibold">
                        Tinggi Badan (cm)
                      </span>
                      <input
                        type="number"
                        required
                        value={height}
                        onChange={(e) =>
                          setHeight(Math.max(100, Number(e.target.value)))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-3 py-2 text-xs text-[#24402a] outline-none focus:border-[#587e61] bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-[#6f7871] font-semibold">
                        Berat Badan (kg)
                      </span>
                      <input
                        type="number"
                        required
                        value={weight}
                        onChange={(e) =>
                          setWeight(Math.max(30, Number(e.target.value)))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-3 py-2 text-xs text-[#24402a] outline-none focus:border-[#587e61] bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-[#6f7871] font-semibold">
                        Lingkar Pinggang (cm)
                      </span>
                      <input
                        type="number"
                        required
                        value={waist}
                        onChange={(e) =>
                          setWaist(Math.max(30, Number(e.target.value)))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-3 py-2 text-xs text-[#24402a] outline-none focus:border-[#587e61] bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-[#6f7871] font-semibold">
                        Umur (tahun)
                      </span>
                      <input
                        type="number"
                        required
                        value={age}
                        onChange={(e) =>
                          setAge(Math.max(1, Number(e.target.value)))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-3 py-2 text-xs text-[#24402a] outline-none focus:border-[#587e61] bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-[#6f7871] font-semibold">
                        Jenis Kelamin
                      </span>
                      <div className="grid grid-cols-2 border border-[#cbd3cc] rounded-lg overflow-hidden bg-[#fbfaf7] text-xs">
                        <button
                          type="button"
                          onClick={() => setGender("male")}
                          className={`py-2 text-center font-medium ${gender === "male" ? "bg-[#24402a] text-white" : "text-[#6f7871] hover:text-[#24402a]"}`}
                        >
                          Laki
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender("female")}
                          className={`py-2 text-center font-medium ${gender === "female" ? "bg-[#24402a] text-white" : "text-[#6f7871] hover:text-[#24402a]"}`}
                        >
                          Puan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Physical Activity Level */}
                <div className="border-t border-[#f1efe9] pt-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#24402a] block mb-3">
                    Tingkat Aktivitas Fisik
                  </label>
                  <div className="grid grid-cols-3 border border-[#cbd3cc] rounded-lg overflow-hidden bg-[#fbfaf7] text-xs">
                    <button
                      type="button"
                      onClick={() => setActivity(1.2)}
                      className={`py-2.5 text-center font-medium ${activity === 1.2 ? "bg-[#24402a] text-white" : "text-[#6f7871] hover:text-[#24402a]"}`}
                    >
                      Sedentary (1.2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivity(1.375)}
                      className={`py-2.5 text-center font-medium ${activity === 1.375 ? "bg-[#24402a] text-white" : "text-[#6f7871] hover:text-[#24402a]"}`}
                    >
                      Aktif Sedang (1.375)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivity(1.55)}
                      className={`py-2.5 text-center font-medium ${activity === 1.55 ? "bg-[#24402a] text-white" : "text-[#6f7871] hover:text-[#24402a]"}`}
                    >
                      Sangat Aktif (1.55)
                    </button>
                  </div>
                </div>

                {/* NEW: Biochemical Laboratory Ledger */}
                <div className="border-t border-[#f1efe9] pt-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#24402a] flex mb-2 items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-[#587e61]" /> Buku
                    Rekam Laboratorium (Data Biokimia)
                  </label>
                  <p className="text-[11px] text-[#6f7871] mb-4">
                    Isi angka laporan tes laboratorium medis terbaru Anda. Nilai
                    di luar parameter normal akan disorot dengan peringatan gizi
                    terkait.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#6f7871] uppercase tracking-wider font-mono text-center">
                        Asam Urat (mg/dL)
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 5.6"
                        value={
                          labData.uricAcid !== undefined ? labData.uricAcid : ""
                        }
                        onChange={(e) =>
                          setLabData((prev) => ({
                            ...prev,
                            uricAcid: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                            lastUpdated: new Date().toISOString().split("T")[0],
                          }))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-2 py-1.5 text-xs text-center text-[#24402a] outline-none bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#6f7871] uppercase tracking-wider font-mono text-center">
                        Kreatinin (mg/dL)
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 0.9"
                        value={
                          labData.creatinine !== undefined
                            ? labData.creatinine
                            : ""
                        }
                        onChange={(e) =>
                          setLabData((prev) => ({
                            ...prev,
                            creatinine: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                            lastUpdated: new Date().toISOString().split("T")[0],
                          }))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-2 py-1.5 text-xs text-center text-[#24402a] outline-none bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#6f7871] uppercase tracking-wider font-mono text-center">
                        Ureum (mg/dL)
                      </span>
                      <input
                        type="number"
                        step="1"
                        placeholder="e.g. 30"
                        value={labData.ureum !== undefined ? labData.ureum : ""}
                        onChange={(e) =>
                          setLabData((prev) => ({
                            ...prev,
                            ureum: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                            lastUpdated: new Date().toISOString().split("T")[0],
                          }))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-2 py-1.5 text-xs text-center text-[#24402a] outline-none bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#6f7871] uppercase tracking-wider font-mono text-center">
                        Kalium (mEq/L)
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 4.2"
                        value={
                          labData.potassium !== undefined
                            ? labData.potassium
                            : ""
                        }
                        onChange={(e) =>
                          setLabData((prev) => ({
                            ...prev,
                            potassium: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                            lastUpdated: new Date().toISOString().split("T")[0],
                          }))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-2 py-1.5 text-xs text-center text-[#24402a] outline-none bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#6f7871] uppercase tracking-wider font-mono text-center">
                        Natrium (mEq/L)
                      </span>
                      <input
                        type="number"
                        step="1"
                        placeholder="e.g. 140"
                        value={
                          labData.sodium !== undefined ? labData.sodium : ""
                        }
                        onChange={(e) =>
                          setLabData((prev) => ({
                            ...prev,
                            sodium: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                            lastUpdated: new Date().toISOString().split("T")[0],
                          }))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-2 py-1.5 text-xs text-center text-[#24402a] outline-none bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#6f7871] uppercase tracking-wider font-mono text-center">
                        Fosfor (mg/dL)
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 3.5"
                        value={
                          labData.phosphorus !== undefined
                            ? labData.phosphorus
                            : ""
                        }
                        onChange={(e) =>
                          setLabData((prev) => ({
                            ...prev,
                            phosphorus: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                            lastUpdated: new Date().toISOString().split("T")[0],
                          }))
                        }
                        className="border border-[#cbd3cc] rounded-lg px-2 py-1.5 text-xs text-center text-[#24402a] outline-none bg-[#fbfaf7] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Render Lab analysis flags */}
                  {Object.keys(labAnalysis).length > 0 && (
                    <div className="mt-4 bg-zinc-50 border border-[#e2e8e3] p-4 rounded-xl space-y-3">
                      <h4 className="text-xs font-semibold text-[#24402a] font-mono">
                        Interpretasi Hasil Lab Terkini:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(labAnalysis).map(([key, item]) => {
                          const labelMap: Record<string, string> = {
                            uricAcid: "Asam Urat",
                            creatinine: "Kreatinin",
                            ureum: "Ureum",
                            potassium: "Kalium",
                            sodium: "Natrium",
                            phosphorus: "Fosfor",
                          };
                          return (
                            <div
                              key={key}
                              className="bg-white border border-[#e2e8e3] p-3 rounded-lg flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-baseline">
                                  <span className="text-xs font-bold text-[#24402a]">
                                    {labelMap[key]}
                                  </span>
                                  <span className="text-[10px] font-mono text-[#6f7871]">
                                    {item.range}
                                  </span>
                                </div>
                                <p className="text-[10px] text-[#6f7871] mt-1 leading-snug">
                                  {item.desc}
                                </p>
                              </div>
                              <div className="mt-3 flex justify-between items-center">
                                <span className="text-sm font-extrabold text-[#24402a]">
                                  {item.value}
                                </span>
                                <span
                                  className={`text-[9px] font-semibold font-mono border px-2 py-0.5 rounded-full ${item.color}`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Weight Log Management List */}
                <div className="border-t border-[#f1efe9] pt-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#24402a] block mb-3">
                    Riwayat Catatan Timbangan
                  </label>

                  <div className="max-h-52 overflow-y-auto border border-[#e2e8e3] rounded-lg divide-y divide-[#f1efe9]">
                    {weightHistory.length > 0 ? (
                      [...weightHistory]
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime(),
                        )
                        .map((log) => (
                          <div
                            key={log.date}
                            className="flex justify-between items-center px-4 py-2.5 text-xs text-[#24402a] hover:bg-[#edf2ee]/20"
                          >
                            <span className="font-mono flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#587e61]" />{" "}
                              {log.date}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="font-bold">{log.weight} kg</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteWeightLog(log.date)}
                                className="text-rose-600 hover:text-rose-800 font-semibold text-[10px]"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="p-4 text-center text-xs text-[#6f7871] italic">
                        Belum ada riwayat timbangan terdaftar.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#f1efe9] flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#24402a] hover:bg-[#587e61] text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs"
                  >
                    Simpan dan Lihat Jurnal Harian
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: CLINICAL EDUCATION & LISTS */}
          {activeTab === "guide" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white border border-[#e2e8e3] p-6 md:p-8 rounded-xl shadow-xs">
                <h2 className="font-editorial-heading text-xl font-bold text-[#24402a] mb-2">
                  Clinical Handbook: {activeCondition.name}
                </h2>
                <p className="text-xs text-[#6f7871] mb-6">
                  Panduan diet komprehensif, batasan nutrisi kritis, dan
                  penataan makan harian Anda.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recommended Foods */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-lg">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                      <CheckCircle className="h-4 w-4" /> Makanan Sangat
                      Dianjurkan
                    </h3>
                    <ul className="space-y-2">
                      {activeCondition.allowedFoods.map((food, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-emerald-950 flex items-center gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Restrictive Foods */}
                  <div className="bg-[#fdf5f2] border border-[#f5d9d0] p-5 rounded-lg">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#b85233] flex items-center gap-1.5 mb-3">
                      <AlertTriangle className="h-4 w-4" /> Makanan Dibatasi /
                      Dihindari
                    </h3>
                    <ul className="space-y-2">
                      {activeCondition.prohibitedFoods.map((food, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-[#8a331a] flex items-center gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-[#b85233]" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Clinical Guidelines Leaflet */}
              <div className="bg-white border border-[#e2e8e3] p-6 md:p-8 rounded-xl shadow-xs">
                <h3 className="font-editorial-heading text-lg font-bold text-[#24402a] mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#587e61]" /> Rekomendasi
                  Medis Gizi Harian
                </h3>

                <div className="space-y-4">
                  {activeCondition.clinicalTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 text-xs leading-relaxed text-[#18221b] border-b border-[#f1efe9] pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-mono text-[#587e61] font-bold">
                        0{idx + 1}.
                      </span>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Meal Plan Template */}
              <div className="bg-white border border-[#e2e8e3] p-6 md:p-8 rounded-xl shadow-xs">
                <h3 className="font-editorial-heading text-lg font-bold text-[#24402a] mb-2 flex items-center gap-2">
                  <Apple className="h-5 w-5 text-[#587e61]" /> Templat Jadwal
                  Distribusi Makan
                </h3>
                <p className="text-xs text-[#6f7871] mb-4">
                  Contoh pembagian porsi asupan kalori harian gizi seimbang:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-[#fbfaf7] border border-[#e2e8e3] rounded">
                    <p className="font-bold text-[#24402a]">Sarapan (25%)</p>
                    <p className="text-[10px] text-[#6f7871] mt-1">
                      {Math.round(targets.calories * 0.25)} kcal
                    </p>
                    <p className="text-[9px] text-[#587e61] mt-0.5">
                      Rekomendasi serat tinggi
                    </p>
                  </div>
                  <div className="p-3 bg-[#fbfaf7] border border-[#e2e8e3] rounded">
                    <p className="font-bold text-[#24402a]">
                      Makan Siang (35%)
                    </p>
                    <p className="text-[10px] text-[#6f7871] mt-1">
                      {Math.round(targets.calories * 0.35)} kcal
                    </p>
                    <p className="text-[9px] text-[#587e61] mt-0.5">
                      Karbohidrat kompleks + protein
                    </p>
                  </div>
                  <div className="p-3 bg-[#fbfaf7] border border-[#e2e8e3] rounded">
                    <p className="font-bold text-[#24402a]">
                      Makan Malam (30%)
                    </p>
                    <p className="text-[10px] text-[#6f7871] mt-1">
                      {Math.round(targets.calories * 0.3)} kcal
                    </p>
                    <p className="text-[9px] text-[#587e61] mt-0.5">
                      Rendah garam & lemak jenuh
                    </p>
                  </div>
                  <div className="p-3 bg-[#fbfaf7] border border-[#e2e8e3] rounded">
                    <p className="font-bold text-[#24402a]">Selingan (10%)</p>
                    <p className="text-[10px] text-[#6f7871] mt-1">
                      {Math.round(targets.calories * 0.1)} kcal
                    </p>
                    <p className="text-[9px] text-[#587e61] mt-0.5">
                      Cemilan buah / biji-bijian
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Subtle bottom ticker */}
      <footer className="border-t border-[#e2e8e3] py-4 px-6 bg-[#fbfaf7] text-center text-[10px] text-[#6f7871] font-mono print:hidden">
        NourishLab v1.0 — Tailored Nutrition Tracker for Clinical Support. All
        rights reserved.
      </footer>
    </div>
  );
}
