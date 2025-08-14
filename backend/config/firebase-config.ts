import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './serviceAccount.json';

if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error('FIREBASE_STORAGE_BUCKET environment variable is not set');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,

});

const db = admin.firestore();
const bucket = admin.storage().bucket();
  
export { admin, db, bucket };
