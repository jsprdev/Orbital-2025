import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './serviceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: 'lyst-4a45d.firebasestorage.app',

});

const db = admin.firestore();
const bucket = admin.storage().bucket();
  
export { admin, db, bucket };
