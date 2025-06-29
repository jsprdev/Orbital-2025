import OpenAI from 'openai';
import dotenv from 'dotenv';

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

      // TESTING PROMPT FOR THE UI
      const prompt = `

Input cards:
${cardsJson}

Instructions:
For now, just output the JSON object with the following structure:

Output ONLY a JSON object matching this exact schema:
{
  "selectedLocations": [ /* the full card objects you chose */ ],
  "visitOrder": [ /* array of 0-based indices into the original cards array, in visit order */ ]
}

Do not include any explanations, just the JSON object.`;

      console.log('Calling OpenAI API...');
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano", // DO NOT CHANGE I AM BROKE THIS IS THE CHEAPEST I GOT NO MONEY
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
        max_tokens: 1000,
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