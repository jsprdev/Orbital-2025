import { Request, Response, Router } from 'express';
import { ExpensesService } from '../services/expenses.service';

const expensesServiceInstance = new ExpensesService();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user.user_id !== 'string') {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const expenses = await expensesServiceInstance.getExpenses(req.user.user_id);
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user.user_id !== 'string') {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const expense = req.body;
    expense.userId = req.user.user_id;
    const addedExpense = await expensesServiceInstance.addExpense(expense);
    res.status(201).json({ expense: addedExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user.user_id !== 'string') {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const expenseId = req.params.id;
    if (!expenseId || typeof expenseId !== 'string') {
      res.status(400).json({ error: 'Expense ID is required' });
      return;
    }
    const data = req.body;
    await expensesServiceInstance.updateExpense(expenseId, data);
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user.user_id !== 'string') {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const expenseId = req.params.id;
    if (!expenseId || typeof expenseId !== 'string') {
      res.status(400).json({ error: 'Expense ID is required' });
      return;
    }
    await expensesServiceInstance.deleteExpense(expenseId);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router; 