import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType = 'image/jpeg', pantryItems } = await request.json();

    const pantryContext = pantryItems?.length
      ? `Current pantry: ${pantryItems.map((p: { name: string; quantity: number; unit: string }) => `${p.name} (${p.quantity} ${p.unit})`).join(', ')}`
      : '';

    const messages: Anthropic.MessageParam[] = [];

    if (imageBase64) {
      messages.push({
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
            text: `Analyze this kitchen/pantry image. ${pantryContext}

Identify what dish was likely made, what ingredients are visible and their approximate remaining amounts.

Respond with ONLY valid JSON:
{
  "identifiedDish": "dish name or null",
  "usedIngredients": ["ingredient1", "ingredient2"],
  "remainingIngredients": [
    {"name": "ingredient", "estimatedAmount": "amount with unit"}
  ],
  "observations": "brief observation"
}`,
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: `${pantryContext}\n\nAnalyze this pantry inventory and respond with ONLY valid JSON:
{
  "identifiedDish": null,
  "usedIngredients": [],
  "remainingIngredients": ${JSON.stringify(pantryItems?.map((p: { name: string; quantity: number; unit: string }) => ({ name: p.name, estimatedAmount: `${p.quantity} ${p.unit}` })) || [])},
  "observations": "Current pantry inventory"
}`,
      });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanText);

    return Response.json(data);
  } catch (err) {
    console.error('Pantry analysis error:', err);
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
