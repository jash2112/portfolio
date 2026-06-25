import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { consumed, goals, pantryItems, remainingCalories } = await request.json();

    const prompt = `You are a nutrition expert. Based on what someone has eaten today and their remaining daily goals, suggest 3-4 specific meals or snacks.

Today's consumption:
- Calories: ${Math.round(consumed.calories)} / ${goals.calories} kcal
- Protein: ${Math.round(consumed.protein)} / ${goals.protein}g
- Carbs: ${Math.round(consumed.carbs)} / ${goals.carbs}g
- Fat: ${Math.round(consumed.fat)} / ${goals.fat}g
- Fiber: ${Math.round(consumed.fiber)} / ${goals.fiber}g

Remaining to reach goals:
- Calories: ${Math.round(remainingCalories)} kcal
- Protein: ${Math.round(Math.max(0, goals.protein - consumed.protein))}g
- Carbs: ${Math.round(Math.max(0, goals.carbs - consumed.carbs))}g
- Fat: ${Math.round(Math.max(0, goals.fat - consumed.fat))}g

Available pantry items: ${pantryItems?.length ? pantryItems.map((p: { name: string }) => p.name).join(', ') : 'Not specified'}

Focus especially on filling protein and fiber gaps. Suggest realistic, practical meals.

Respond with ONLY valid JSON array:
[
  {
    "name": "Meal name",
    "description": "Brief description",
    "emoji": "emoji",
    "reason": "Why this fits their remaining needs",
    "nutrition": {
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "fiber": number
    },
    "ingredients": ["ingredient1", "ingredient2"],
    "prepTime": "X min"
  }
]`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const suggestions = JSON.parse(cleanText);

    return Response.json({ suggestions });
  } catch (err) {
    console.error('Suggestions error:', err);
    return Response.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
