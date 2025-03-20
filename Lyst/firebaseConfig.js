// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3jL7T6o6gJ9oh3EsQLGW8n7bqc4BoUPY",
  authDomain: "orbital---lyst.firebaseapp.com",
  projectId: "orbital---lyst",
  storageBucket: "orbital---lyst.firebasestorage.app",
  messagingSenderId: "402155458755",
  appId: "1:402155458755:web:ca687bcd90808656661276",
  measurementId: "G-K1LXZYKNVH"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);