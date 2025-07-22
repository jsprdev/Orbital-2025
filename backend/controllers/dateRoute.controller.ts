import { Router, Request, Response } from 'express';
import { DateRouteService } from '../services/dateRoute.service';

const router = Router();

interface LocationCard {
  name: string;
  address: string;
  tags?: string[];
  [key: string]: any;
}

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
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