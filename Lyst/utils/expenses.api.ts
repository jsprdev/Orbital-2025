import { FIREBASE_DB } from "@/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

export interface ExpenseItemType {
  name: string;
  amount: string;
}

export interface SectionType {
  id?: string; 
  title: string;
  items: ExpenseItemType[];
  createdAt?: string;
}


export const getExpenseSections = async (userId: string): Promise<SectionType[]> => {
  const q = query(
    collection(FIREBASE_DB, `users/${userId}/expenses`),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SectionType));
};

// Create a new expense section
export const createExpenseSection = async (userId: string, section: SectionType) => {
  const sectionRef = doc(collection(FIREBASE_DB, `users/${userId}/expenses`));
  const data = {
    ...section,
    createdAt: section.createdAt || new Date().toISOString(),
  };
  await setDoc(sectionRef, data);
  return { id: sectionRef.id, ...data };
};


export const updateExpenseSection = async (userId: string, sectionId: string, section: SectionType) => {
  const sectionRef = doc(FIREBASE_DB, `users/${userId}/expenses/${sectionId}`);
  // omit the id
  const { id, ...updateData } = section;
  await updateDoc(sectionRef, updateData);
};


export const deleteExpenseSection = async (userId: string, sectionId: string) => {
  const sectionRef = doc(FIREBASE_DB, `users/${userId}/expenses/${sectionId}`);
  await deleteDoc(sectionRef);
}; 