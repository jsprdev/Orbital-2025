import { Request, Response, Router } from 'express';
import { PartnerService } from '../services/partner.service';

const partnerServiceInstance = new PartnerService();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return; 
  }

  try {
    const partnerDetails = await partnerServiceInstance.getPartnerDetails(req.user.uid);
    res.status(200).json({ partnerDetails });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/generate", async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return; 
  }

  try {
    const code = await partnerServiceInstance.generateCode(req.user.uid);
    res.status(200).json({ code })
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/anniversaryDate", async (req: Request, res: Response) => {
  console.log("3");
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return; 
  }
  const { date } = req.body;
  console.log("4 Date: ", date);
  try {
    const dateObject = new Date(date);
    const result = await partnerServiceInstance.uploadAnniversaryDate(req.user.uid, dateObject);
    res.status(200).json(result)
  } catch (error) {
    console.error('Error joining code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/join", async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return; 
  }
  const { code } = req.body;
  try {
    const result = await partnerServiceInstance.joinCode(req.user.uid, code);
    res.status(200).json(result)
  } catch (error) {
    console.error('Error joining code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;