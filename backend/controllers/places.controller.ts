import { Request, Response, Router } from 'express';
import { PlacesService } from '../services/places.service';

const placesServiceInstance = new PlacesService();
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  
  const input = req.query.input as string;
  if (!input) {
    res.status(400).json({ error: 'Missing input parameter' });
    return;
  }
  try {
    const data = await placesServiceInstance.autocomplete(input);
    console.log('Google Places API response:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

router.get('/details', async (req: Request, res: Response) => {
  const placeId = req.query.placeId as string;
  if (!placeId) {
    res.status(400).json({ error: 'Missing placeId parameter' });
    return;
  }
  try {
    const data = await placesServiceInstance.getPlaceDetails(placeId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

export default router;