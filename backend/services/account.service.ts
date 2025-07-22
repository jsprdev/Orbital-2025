import { db } from "../config/firebase-config";

export class AccountService {

  async createAccount(userId: string, displayName: string, email: string) {
    const userRef = db.collection("users").doc(userId);
    await userRef.set({
      displayName,
      email,
      createdAt: new Date(),
      partnerId: null,
      inviteCode: null,
      inviteCodeExpiry: null
    });
    return { success: true };
  }

}