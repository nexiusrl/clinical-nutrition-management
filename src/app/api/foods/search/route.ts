// src/app/api/foods/search/route.ts
import { NextResponse } from "next/server";
import { searchFoods, parseDescription, isFatSecretSupported } from "@/lib/fatsecret";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ success: true, results: [] });
    }

    if (!isFatSecretSupported()) {
      return NextResponse.json({ success: false, fallback: true, results: [] });
    }

    const data = await searchFoods(query);
    if (!data || !data.foods) {
      return NextResponse.json({ success: false, results: [] });
    }

    const rawFoods = data.foods.food;
    if (!rawFoods) {
      return NextResponse.json({ success: true, results: [] });
    }

    interface RawFood {
      food_id: string;
      food_name: string;
      brand_name?: string;
      food_type?: string;
      food_description?: string;
    }

    const foodArray = Array.isArray(rawFoods) ? rawFoods : [rawFoods];

    const results = (foodArray as RawFood[]).map((f) => {
      const parsed = parseDescription(f.food_description || "");
      return {
        id: f.food_id,
        name: f.food_name,
        brand: f.brand_name || "",
        category: f.food_type || "Umum",
        calories: parsed.calories,
        protein: parsed.protein,
        carbs: parsed.carbs,
        fat: parsed.fat,
        sodium: parsed.sodium,
        servingSize: parsed.servingSize,
        servingWeightGrams: parsed.servingWeightGrams,
        isFatSecret: true,
      };
    });

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("API /api/foods/search error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
