import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = await request.json();

    if (!imageBase64) {
      return Response.json({ error: 'Image data required' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `Analyze this food image and respond with ONLY valid JSON (no markdown, no code blocks):
{
  "name": "dish name",
  "description": "brief description",
  "emoji": "single relevant emoji",
  "portionSize": "estimated portion size",
  "confidence": 0-100,
  "nutrition": {
    "calories": number,
    "protein": number (grams),
    "carbs": number (grams),
    "fat": number (grams),
    "fiber": number (grams),
    "sugar": number (grams),
    "sodium": number (mg)
  },
  "tips": ["tip1", "tip2"],
  "ingredients": ["ingredient1", "ingredient2"]
}

Be precise with nutrition values. Estimate based on typical restaurant/home portion sizes.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanText);

    return Response.json({
      food: {
        id: `food-${Date.now()}`,
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        portionSize: data.portionSize,
        confidence: data.confidence,
        nutrition: data.nutrition,
      },
      tips: data.tips || [],
      ingredients: data.ingredients || [],
    });
  } catch (err) {
    console.error('Food analysis error:', err);
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
