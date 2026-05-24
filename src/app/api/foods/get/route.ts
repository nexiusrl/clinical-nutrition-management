// src/app/api/foods/get/route.ts
import { NextResponse } from "next/server";
import { getFoodDetails, isFatSecretSupported } from "@/lib/fatsecret";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";

    if (!id.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing food ID parameter" },
        { status: 400 },
      );
    }

    if (!isFatSecretSupported()) {
      return NextResponse.json({ success: false, fallback: true });
    }

    const data = await getFoodDetails(id);
    if (!data || !data.food) {
      return NextResponse.json(
        { success: false, error: "Food item not found" },
        { status: 404 },
      );
    }

    const foodObj = data.food;
    const servingsObj = foodObj.servings?.serving;

    if (!servingsObj) {
      return NextResponse.json(
        { success: false, error: "Nutritional servings not found for this item" },
        { status: 404 },
      );
    }

    interface Serving {
      metric_serving_unit?: string;
      metric_serving_amount?: string;
      calories?: string;
      protein?: string;
      carbohydrate?: string;
      fat?: string;
      sodium?: string;
      serving_description?: string;
    }

    const selectedServing: Serving = Array.isArray(servingsObj)
      ? (servingsObj as Serving[]).find(
          (s) =>
            s.metric_serving_unit === "g" ||
            s.metric_serving_amount !== undefined,
        ) || servingsObj[0]
      : (servingsObj as Serving);

    const calories = parseFloat(selectedServing.calories || "0") || 0;
    const protein = parseFloat(selectedServing.protein || "0") || 0;
    const carbs = parseFloat(selectedServing.carbohydrate || "0") || 0;
    const fat = parseFloat(selectedServing.fat || "0") || 0;
    const sodium = parseFloat(selectedServing.sodium || "0") || 0;
    const servingSize = selectedServing.serving_description || "1 porsi";
    const servingWeightGrams =
      parseFloat(selectedServing.metric_serving_amount || "100") || 100;

    const mappedFood = {
      id: foodObj.food_id,
      name: foodObj.food_name,
      brand: foodObj.brand_name || "",
      category: foodObj.food_type || "Umum",
      calories,
      protein,
      carbs,
      fat,
      sodium,
      servingSize,
      servingWeightGrams,
      isFatSecret: true,
    };

    return NextResponse.json({ success: true, food: mappedFood });
  } catch (error) {
    console.error("API /api/foods/get error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
