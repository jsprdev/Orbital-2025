import { Request, Response, Router } from 'express';
import { GiftsService } from '../services/gifts.service';

const giftsServiceInstance = new GiftsService();
const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const gifts = await giftsServiceInstance.getGifts(req.user.user_id);
    res.status(200).json({ gifts });
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const gift = req.body;
    gift.userId = req.user.user_id;
    const addedGift = await giftsServiceInstance.addGift(gift);
    res.status(201).json({ gift: addedGift });
  } catch (error) {
    console.error('Error adding gift:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const giftId = req.params.id;
    if (!giftId) {
      res.status(400).json({ error: "Gift ID is required" });
      return;
    }
    await giftsServiceInstance.deleteGift(giftId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting gift:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router; 