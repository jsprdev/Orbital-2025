import { db } from "../config/firebase-config";
import { DatePlan } from "../../Lyst/types/index";

export class DatePlansService {
  async getDatePlans(userId: string) {
    const plansRef = db.collection('datePlans');
    const snapshot = await plansRef.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    const plans: DatePlan[] = [];
    snapshot.forEach(doc => {
      plans.push({ ...doc.data(), id: doc.id } as DatePlan);
    });
    return plans;
  }

  async addDatePlan(plan: DatePlan) {
    const docRef = await db.collection('datePlans').add(plan);
    return { ...plan, id: docRef.id };
  }

  async deleteDatePlan(planId: string) {
    await db.collection('datePlans').doc(planId).delete();
    return true;
  }

  async updateDatePlanStatus(planId: string, completed: boolean) {
    await db.collection('datePlans').doc(planId).update({ completed });
    return true;
  }
}