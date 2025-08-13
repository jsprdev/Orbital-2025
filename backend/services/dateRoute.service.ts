import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LocationCard {
  name: string;
  address: string;
  tags?: string[];
  [key: string]: any; // for other data
}

// PLACEHOLDER FORMAT FOR EVENTUAL OUTPUT for user to drag and rearrange
interface DateRouteResponse {
  selectedLocations: LocationCard[];
  visitOrder: number[];
}

export class DateRouteService {
  static async generateDateRoute(
    cards: LocationCard[]
  ): Promise<DateRouteResponse> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key is not configured");
      }

      // turn into json format for ai to prompt
      const cardsJson = JSON.stringify(cards, null, 2);

      // TESTING PROMPT FOR THE UI
      const prompt = `

Input cards:
${cardsJson}

Instructions:
1. All locations provided are places that the user wants to go, but please pick 3-4 locations from the provided cards that are a suitable combination to go together for a plan for a date
2. Order them into an optimal visit sequence for a romantic date
3. Consider factors like: - distance between each other - Romantic atmosphere - Logical flow (dinner after activities, dessert after dinner, etc.) - Distance and travel time between locations - Variety of experiences (activity, dining, entertainment, etc.)
4. There should only be a maximum of one main course meal location in the route, make your plan logical, select a mix of different activities where appropriate as well
5. Consider a logical starting time for the date and thereon choose the locations

Output ONLY a JSON object matching this exact schema:
{
  "selectedLocations": [ /* the full card objects you chose */ ],
  "visitOrder": [ /* array of 0-based indices in visit order of the locations that you arranged */ ],
  "explanation": [ /* a short explanation of why you chose these locations in combination together, and the reason for your route order*/ ]
}

Do not include any additional text, just the JSON object.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // DO NOT CHANGE I AM BROKE THIS IS THE CHEAPEST I GOT NO MONEY
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates date routes. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000, // DO NOT CHANGE PLEASE
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        throw new Error("NO RESPONSE");
      }

      // parse
      const parsedResponse = JSON.parse(responseContent) as DateRouteResponse;

      if (!parsedResponse.selectedLocations || !parsedResponse.visitOrder) {
        throw new Error("Invalid response structure from OpenAI");
      }

      return parsedResponse;
    } catch (error) {
      throw new Error(
        `FAIL: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
