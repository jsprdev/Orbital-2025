import { db } from "../config/firebase-config";

export class PartnerService {

  async generateCode(userId: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const userRef = db.collection("users").doc(userId);
    await userRef.update({ 
      inviteCode: code,
      inviteCodeExpiry : expiry 
    });
    return code;
  }

  async joinCode(userId: string, code: string) {

    // find partner with the code
    const partner = await db
      .collection("users")
      .where("inviteCode", "==", code)
      .get();
    
    if (partner.empty) {
      throw new Error("Invalid code");
    }

    const partnerDoc = partner.docs[0];
    if (!partnerDoc) {
      throw new Error("Invalid Code");
    }
    const partnerUserId = partnerDoc.id;
    const partnerData = partnerDoc.data();

    if (partnerUserId === userId) {
      throw new Error("Cannot link to yourself.");
    }

    // find current user
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      throw new Error("User not found");
    }
    const userData = userSnap.data();

    // checks
    if (userData?.partnerId === partnerUserId) {
      throw new Error("Already linked to this partner.");
    }
    if (userData?.partnerId) {
      throw new Error("You are already linked to a partner.");
    }
    if (partnerData?.partnerId) {
      throw new Error("This code has already been used.");
    }

    // update both users to reference each other
    await userRef.update({ partnerId: partnerUserId });
    await db.collection("users").doc(partnerUserId).update({ partnerId: userId });

    // and clear both invite code fields
    await db.collection("users").doc(userId).update({ inviteCode: null, inviteCodeExpiry: null });
    await db.collection("users").doc(partnerUserId).update({ inviteCode: null, inviteCodeExpiry: null });

    return { success: true, partnerId: partnerUserId };
  }
}