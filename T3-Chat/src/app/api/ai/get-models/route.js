import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "CodaAI Chat",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform and filter the models for better UI display
    const transformedModels = data.data.map((model) => ({
      id: model.id,
      name: model.name || model.id.split("/")[1] || model.id,
      description: model.description || "",
      context_length: model.context_length || 0,
      pricing: {
        prompt: model.pricing?.prompt || "0",
        completion: model.pricing?.completion || "0",
      },
      top_provider: model.top_provider || {},
    }));

    // Sort models by popularity/pricing
    const sortedModels = transformedModels.sort((a, b) => {
      const aPrice = parseFloat(a.pricing.prompt || "0");
      const bPrice = parseFloat(b.pricing.prompt || "0");
      return aPrice - bPrice;
    });

    return NextResponse.json({ 
      success: true, 
      models: sortedModels,
      count: sortedModels.length 
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        models: [] 
      },
      { status: 500 }
    );
  }
}