import { admin, db } from "../config/firebase-config.js";
import { Album } from "../../Lyst/types/album.dto";

export class AlbumsService {

  async getAlbums(userId: string) {

    const albumsRef = db.collection('albums');
    const snapshot = await albumsRef.where('userId', '==', userId).get();
    const albums: Album[] = [];
    snapshot.forEach(doc => {
      albums.push({ ...doc.data(), id:doc.id } as Album);
    });
    return albums; 
  }

  async addToAndUpdateAlbum(albumName: string, userId: string, coverPhotoUrl?: string) {
    const albumRef = db.collection("albums");
    const snapshot = await albumRef
      .where('userId', '==', userId)
      .where('name', '==', albumName)
      .get();
    
    if (!snapshot.empty) {
      const existing = snapshot.docs[0];
      await db.collection("albums").doc(existing.id).update({
        ...(coverPhotoUrl && { coverPhotoUrl }),
      });
      return { id: existing.id, ...existing.data() } as Album;
    } else {
      const newAlbum = {
        userId: userId,
        name: albumName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...(coverPhotoUrl && { coverPhotoUrl })
      };

      const docRef = await albumRef.add(newAlbum)
      return { id: docRef.id, ...newAlbum };
    }
  }

  async deleteAlbum(albumId: string) {
    await db.collection("albums").doc(albumId).delete(); 
    return true;
  }








}
