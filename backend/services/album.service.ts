import { admin, db } from "../config/firebase-config";
import { Album } from "../../Lyst/types/album.dto";
import { StringCheckGrader } from "openai/resources/graders/grader-models";

export class AlbumsService {

  async getAlbums(userId: string, partnerId?: string) {
    const albumsRef = db.collection('albums');
    const snapshot = await albumsRef.where('userId', '==', userId).get();
    
    const albums: Album[] = [];
    snapshot.forEach(doc => {
      albums.push({ ...doc.data(), id:doc.id } as Album);
    });

    if (partnerId) {
      const partnerSnapshot = await albumsRef.where('userId', '==', partnerId).get();
      partnerSnapshot.forEach(doc => {
        albums.push({ ...doc.data(), id:doc.id } as Album);
        });
      }
      return albums; 
    
  }

  async addToAndUpdateAlbum(albumName: string, userId: string) {
    const albumRef = db.collection("albums");
    const newAlbum = {
      userId: userId,
      name: albumName,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await albumRef.add(newAlbum)
    return { id: docRef.id, ...newAlbum };
  }

  async deleteAlbum(albumId: string) {
    await db.collection("albums").doc(albumId).delete(); 
    return true;
  }








}
