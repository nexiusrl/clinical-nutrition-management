// src/lib/fatsecret.ts

const clientId = process.env.FATSECRET_CLIENT_ID || "";
const clientSecret = process.env.FATSECRET_CLIENT_SECRET || "";

let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

export const isFatSecretSupported = (): boolean => {
  return clientId !== "" && clientSecret !== "";
};

async function getAccessToken(): Promise<string | null> {
  if (!isFatSecretSupported()) return null;

  // Return cached token if it is still valid (leaving a 60-second buffer)
  if (cachedToken && Date.now() < tokenExpiryTime - 60000) {
    return cachedToken;
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://oauth.fatsecret.com/connect/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "basic",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("FatSecret Token Error:", errText);
      return null;
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Expires in is in seconds. Map to absolute timestamp
    tokenExpiryTime = Date.now() + (data.expires_in || 86400) * 1000;
    return cachedToken;
  } catch (error) {
    console.error("FatSecret Auth Error:", error);
    return null;
  }
}

// Regular expression parser for summary descriptions
// e.g. "Per 100g - Calories: 130kcal | Fat: 0.30g | Carbs: 28.00g | Protein: 2.70g"
export function parseDescription(desc: string) {
  if (!desc) {
    return {
      servingSize: "100g",
      servingWeightGrams: 100,
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
      sodium: 0,
    };
  }

  const parts = desc.split(" - ");
  const servingSize = parts[0] || "100g";

  let servingWeightGrams = 100;
  const gramMatch = servingSize.match(/(\d+(?:\.\d+)?)\s*g/i);
  if (gramMatch && gramMatch[1]) {
    servingWeightGrams = parseFloat(gramMatch[1]);
  }

  const getVal = (regex: RegExp): number => {
    const match = desc.match(regex);
    return match && match[1] ? parseFloat(match[1]) : 0;
  };

  const calories = getVal(/(?:Calories|Kalori):\s*(\d+(?:\.\d+)?)/i);
  const fat = getVal(/(?:Fat|Lemak):\s*(\d+(?:\.\d+)?)/i);
  const carbs = getVal(/(?:Carbs|Karbohidrat|Karbo):\s*(\d+(?:\.\d+)?)/i);
  const protein = getVal(/Protein:\s*(\d+(?:\.\d+)?)/i);
  const sodium = getVal(/(?:Sodium|Natrium):\s*(\d+(?:\.\d+)?)/i);

  return {
    servingSize,
    servingWeightGrams,
    calories,
    fat,
    carbs,
    protein,
    sodium,
  };
}

export async function searchFoods(query: string) {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch("https://platform.fatsecret.com/rest/server.api", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        method: "foods.search",
        search_expression: query,
        format: "json",
        max_results: "15",
      }),
    });

    if (!response.ok) {
      console.error("FatSecret API search error status:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("FatSecret API search request error:", error);
    return null;
  }
}

export async function getFoodDetails(foodId: string) {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch("https://platform.fatsecret.com/rest/server.api", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        method: "food.get",
        food_id: foodId,
        format: "json",
      }),
    });

    if (!response.ok) {
      console.error("FatSecret API food.get error status:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("FatSecret API food.get request error:", error);
    return null;
  }
}
