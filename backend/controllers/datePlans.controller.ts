import { Request, Response, Router } from 'express';
import { DatePlansService } from '../services/datePlans.service';

const datePlansServiceInstance = new DatePlansService();
const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const plans = await datePlansServiceInstance.getDatePlans(req.user.user_id);
    res.status(200).json({ plans });
  } catch (error) {
    console.error('Error fetching date plans:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const plan = req.body;
    plan.userId = req.user.user_id;
    plan.createdAt = new Date().toISOString();
    const addedPlan = await datePlansServiceInstance.addDatePlan(plan);
    res.status(201).json({ plan: addedPlan });
  } catch (error) {
    console.error('Error adding date plan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const planId = req.params.id;
    if (!planId) {
      res.status(400).json({ error: "Plan ID is required" });
      return;
    }
    await datePlansServiceInstance.deleteDatePlan(planId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting date plan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// updates when u change status of a plan
router.patch("/:id/status", async (req: Request, res: Response): Promise<void> => {
  try {

    const planId = req.params.id;
    const { completed } = req.body;
    
    if (!planId) {
      res.status(400).json({ error: "Plan ID is required" });
      return;
    }
    
    await datePlansServiceInstance.updateDatePlanStatus(planId, completed);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating date plan status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;