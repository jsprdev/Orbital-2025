import { db, bucket, admin } from "../config/firebase-config.js";
import { Photo } from "../../Lyst/types/gallery.dto.js"

export class GalleryService {  

  async getPhotos(userId: string): Promise<Photo[]> {
    const photosCollection = db.collection('images');
    const snapshot = await photosCollection
      .where('userId', '==', userId)
      .get();
      
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Photo[];
  }

  async uploadPhoto(userId: string, file: Express.Multer.File, albumId: string): Promise<Photo> {
    const photosCollection = db.collection('images');

    const storagePath = `images/${Date.now()}_${file.originalname}`;
    const fileRef = bucket.file(storagePath);

    try {
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            uploadedBy: userId,
            originalName: file.originalname
          }
        }
      });

      const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491' // Far future date
      });

      const photoData = {
        url,
        userId,
        storagePath,
        albumId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await photosCollection.add(photoData);
  
      return {
        id: docRef.id,
        url: photoData.url,
        userId: photoData.userId,
        storagePath: photoData.storagePath,
        albumName: albumId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      } as Photo;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  }

  async deletePhoto(photoId: string): Promise<boolean> {
    const photosCollection = db.collection('images');
    const docRef = photosCollection.doc(photoId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log('Photo not found:', photoId);
      return false;
    }

    const photo = doc.data() as Photo;
    try {

      // deleting from both storage and firestore
      await bucket.file(photo.storagePath).delete();
      await docRef.delete();

      if (photo.albumName) {
        const albumsRef = db.collection('albums');
        const snapshot = await albumsRef
          .where('userId', '==', photo.userId)
          .where('name', '==', photo.albumName)
          .get();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async getPhotoById(photoId: string): Promise<Photo | null> {
    const photosCollection = db.collection('images');
    const docRef = photosCollection.doc(photoId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log('Photo not found:', photoId);
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Photo;
  }
}