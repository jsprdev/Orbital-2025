import admin, { ServiceAccount } from 'firebase-admin';

// Use environment variables for Render deployment
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'lyst-4a45d',
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'lyst-4a45d.firebasestorage.app',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
  
export { admin, db, bucket };
