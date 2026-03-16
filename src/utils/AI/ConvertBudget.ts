export async function convertBudget(data: any[]) {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    console.log(apiKey);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are a budget AI assistant.

You will receive a list of budget items in JSON format. 
Each item has a description and total amount. Your job is to assign each item to **exactly one** of the TETFund NRF categories below:

- Personnel Costs/Allowances
- Equipment
- Supplies/Consumables
- Data Collection & Analysis
- Travels
- Dissemination
- Miscellaneous

⚠️ Rules:

1. Do NOT invent any categories outside the ones above.
2. Keep the "description" exactly as given.
3. Ensure "total" is a number.
4. Return ONLY valid JSON. No explanations, no extra text.
5. The output must be an array of objects exactly in this structure:

[
  {
    "description": "string",
    "total": number,
    "category": "one of the allowed categories"
  }
]

Input items:
${JSON.stringify(data)}

Output:
`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1
        }
      })
    }
  );

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

  try {
    console.log(text);
    return JSON.parse(text);
  } catch(error) {
    console.error(error);
    return [];
  }
}