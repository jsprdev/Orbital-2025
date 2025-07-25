import { db } from "../config/firebase-config";

export class ExpensesService {
  async getExpenses(userId: string) {
    const expensesRef = db.collection('expenses');
    const snapshot = await expensesRef.where('userId', '==', userId).get();
    const expenses: any[] = [];
    snapshot.forEach(doc => {
      expenses.push({ ...doc.data(), id: doc.id });
    });
    return expenses;
  }

  async addExpense(expense: any) {
    const docRef = await db.collection('expenses').add(expense);
    return { ...expense, id: docRef.id };
  }

  async updateExpense(expenseId: string, data: any) {
    await db.collection('expenses').doc(expenseId).update(data);
    return true;
  }

  async deleteExpense(expenseId: string) {
    await db.collection('expenses').doc(expenseId).delete();
    return true;
  }
} 