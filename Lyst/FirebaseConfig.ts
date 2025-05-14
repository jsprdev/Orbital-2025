
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyD9RgSRu7PDzcB30l6ZcxPEgs6wR9CBT-8",
  authDomain: "lyst-4a45d.firebaseapp.com",
  projectId: "lyst-4a45d",
  storageBucket: "lyst-4a45d.firebasestorage.app",
  messagingSenderId: "874196085920",
  appId: "1:874196085920:web:a32ecf0c34dc73adb8edc5"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

