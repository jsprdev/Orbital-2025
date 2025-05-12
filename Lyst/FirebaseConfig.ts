// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9RgSRu7PDzcB30l6ZcxPEgs6wR9CBT-8",
  authDomain: "lyst-4a45d.firebaseapp.com",
  projectId: "lyst-4a45d",
  storageBucket: "lyst-4a45d.firebasestorage.app",
  messagingSenderId: "874196085920",
  appId: "1:874196085920:web:a32ecf0c34dc73adb8edc5"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH };

