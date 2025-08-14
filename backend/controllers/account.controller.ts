import { Request, Response, Router } from 'express';
import { AccountService } from '../services/account.service';

const accountServiceInstance = new AccountService();
const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { userId, email, displayName} = req.body;
  if (!userId || !displayName || !email) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  
  try {
    const result = await accountServiceInstance.createAccount(userId, displayName, email);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;