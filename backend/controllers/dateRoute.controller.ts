import { Router, Request, Response } from 'express';
import { DateRouteService } from '../services/dateRoute.service';
import { verifyToken } from '../middleware/verifyToken';
import { PlacesService } from '../services/places.service';
import OpenAI from 'openai';

const router = Router();
const placesService = new PlacesService();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface LocationCard {
  name: string;
  description: string;
  address: string;
  tags?: string[];
  [key: string]: any;
}

// used to enrich the card with a short summary of what the place is
async function getPlaceSummary(placeDetails: any) {
  
  if (placeDetails.editorial_summary?.overview) {
    return placeDetails.editorial_summary.overview;
  }
  
  const name = placeDetails.name || '';
  const types = placeDetails.types ? placeDetails.types.join(', ') : '';
  const servesDinner = placeDetails.serves_dinner;
  const servesLunch = placeDetails.serves_lunch;
  const address = placeDetails.formatted_address || '';
  const reviews = placeDetails.reviews ? placeDetails.reviews[0] + placeDetails.reviews[1] + placeDetails.reviews[2] : '';
  const prompt = `Write a one-sentence summary describing what this place is for:\nName: ${name}\nTypes: ${types}\nAddress: ${address}\nServes Dinner: ${servesDinner}\nServes Lunch: ${servesLunch}\nBrief Reviews: ${reviews}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-nano", // USE CHEAPEST CHEAPEST ONE FOR THIS, extremely low complexity
    messages: [
      { role: "system", content: "You are a helpful assistant that summarizes places based information about the place." },
      { role: "user", content: prompt }
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}

router.post('/generate', verifyToken, async (req: Request, res: Response): Promise<void> => {
  console.log("POST /generate called");
  console.log("3");
  try {
    const { cards }: { cards: LocationCard[] } = req.body;

    // VALIDATION
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      res.status(400).json({
        error: 'Invalid input: cards array is required and must not be empty'
      });
      return;
    }

    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card || !card.name || !card.address) {
        res.status(400).json({
          error: `Invalid card at index ${i}: name and address are required`
        });
        return;
      }
    }

    // ENRICH CARDS WITH GOOGLE PLACES INFO
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      console.log("CARD:", card);
      if (card && card.place_id) {
        try {
          const placeDetailsResponse = await placesService.getPlaceDetails(card.place_id);
          const placeDetails = placeDetailsResponse.result;
          // console.log("PLACE DETAILS:", placeDetails);
          card.about = await getPlaceSummary(placeDetails)
          // console.log("CARD ABOUT:", card.about);
  
        } catch (e) {
          console.error(`IN dateRoute.controller.ts: Failed to fetch details for place_id ${card.place_id}:`, e);
        }
      }
    }




    // generation of date route 
    const dateRoute = await DateRouteService.generateDateRoute(cards);

    res.json({
      success: true,
      data: dateRoute
    });

  } catch (error) {
    console.error('Error in date route generation:', error);
    res.status(500).json({
      error: 'Failed to generate date route',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 