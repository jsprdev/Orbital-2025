import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// need put this if not got some typescript error lol
interface LocationCard {
  name: string;
  description: string;
  address: string;
  tags?: string[];
  [key: string]: any; // for other data
}

// need put this also for typing
interface DateRouteResponse {
  selectedLocations: LocationCard[];
  visitOrder: number[];
}

export class DateRouteService {
  static async generateDateRoute(cards: LocationCard[]): Promise<DateRouteResponse> {
    try {
      // debug
      console.log('OpenAI API Key loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');
      
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      // turn into json format for ai to prompt
      const cardsJson = JSON.stringify(cards, null, 2);
      console.log('Cards to process:', cards.length);
      console.log(cards);

      // PROMPT FOR GPT
      const prompt = `You are a date planning expert. Given a list of location cards, create an optimal date route.

Input cards:
${cardsJson}

Instructions:

1. All locations provided are places that the user wants to go, but please pick 3-4 locations from the provided cards that are a suitable combination to go together for a plan for a date
2. Order them into an optimal visit sequence for a romantic date
3. Consider factors like: - distance between each other - Romantic atmosphere - Logical flow (dinner after activities, dessert after dinner, etc.) - Distance and travel time between locations - Variety of experiences (activity, dining, entertainment, etc.)
4. There should only be a maximum of one main course meal location in the route



Output ONLY a JSON object matching this exact schema:
{
  "selectedLocations": [ /* the full card objects you chose */ ],
  "visitOrder": [ /* array of 0-based indices into the original cards array, in visit order */ ]
  "explanation": Why did you choose this combination and why you put them in this order 
}

Do not include any explanations, just the JSON object.`;

      console.log('Calling OpenAI API...');
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // DO NOT CHANGE I AM BROKE THIS IS THE CHEAPEST I GOT NO MONEY
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates date routes. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000, // DO NOT CHANGE
      });

      console.log('response received');
      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('NO RESPONSE');
      }

      console.log('parsing response...');
      // parse
      const parsedResponse = JSON.parse(responseContent) as DateRouteResponse;

    
      if (!parsedResponse.selectedLocations || !parsedResponse.visitOrder) {
        throw new Error('Invalid response structure from OpenAI');
      }

      console.log('ROUTE GENERATED SUCCESSFULLY');
      return parsedResponse;

    } catch (error) {
      
      throw new Error(`FAIL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 