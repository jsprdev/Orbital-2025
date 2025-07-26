import { db } from "../config/firebase-config";
import { Gift } from "../../Lyst/types/index";

export class GiftsService {
  async getGifts(userId: string) {
    const giftsRef = db.collection('gifts');
    const snapshot = await giftsRef.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    const gifts: Gift[] = [];
    snapshot.forEach(doc => {
      gifts.push({ ...doc.data(), id: doc.id } as Gift);
    });
    return gifts;
  }

  async addGift(gift: Gift) {
    const docRef = await db.collection('gifts').add(gift);
    return { ...gift, id: docRef.id };
  }

  async deleteGift(giftId: string) {
    await db.collection('gifts').doc(giftId).delete();
    return true;
  }
} 