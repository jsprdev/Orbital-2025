import React, { createContext, useContext, useEffect, useState } from "react";
import { getPhotos, uploadPhoto, deletePhoto } from "@/utils/gallery.api";
import { getAlbums, addAlbum, deleteAlbum } from "@/utils/albums.api";
import { useAuth } from "@/providers/AuthProvider";
import { Photo } from "@/types/gallery.dto";
import { Album } from "@/types/album.dto";

interface GalleryContextType {
  photos: Photo[];
  albums: Album[];
  loading: boolean;
  fetchPhotos: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  uploadPhoto: (albumId: string, imageUris: string[]) => Promise<any>;
  deletePhoto: (photoId: string) => Promise<void>;
  addAlbum: (albumName: string) => Promise<any>;
  deleteAlbum: (albumId: string) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuth();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPhotos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const fetchedPhotos = await getPhotos(token);
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const fetchedAlbums = await getAlbums(token);
      setAlbums(fetchedAlbums);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhotoHandler = async (albumName: string, imageUris: string[]) => {
    if (!token) throw new Error("No token available");
    setLoading(true);
    try {
      const uploaded = await uploadPhoto(token, albumName, imageUris);
      await fetchPhotos();
      await fetchAlbums();
      return uploaded;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePhotoHandler = async (photoId: string) => {
    if (!token) throw new Error("No token available");
    setLoading(true);
    try {
      // Get the photo to find its album before deleting
      const photoToDelete = photos.find((p) => p.id === photoId);
      const albumId = photoToDelete?.albumId;

      await deletePhoto(token, photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));

      // If the photo was in an album, check if the album is now empty
      if (albumId) {
        const album = albums.find((a) => a.id === albumId);
        // Don't delete albums with empty names or "Uncategorized" albums
        if (album && album.name && album.name.trim() !== "") {
          const remainingPhotosInAlbum = photos.filter(
            (p) => p.albumId === albumId && p.id !== photoId
          );
          if (remainingPhotosInAlbum.length === 0) {
            // Album is empty, delete it
            await deleteAlbum(token, albumId);
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
          }
        }
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addAlbumHandler = async (albumName: string) => {
    if (!token) {
      throw new Error("No token available");
    }

    setLoading(true);
    try {
      const newAlbum = await addAlbum(token, albumName);
      setAlbums((prev) => {
        const exists = prev.find((a) => a.id === newAlbum.id);
        return exists ? prev : [...prev, newAlbum];
      });
      return newAlbum;
    } catch (error) {
      console.error("Error adding album:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbumHandler = async (albumId: string) => {
    if (!token) throw new Error("No token available");
    setLoading(true);
    try {
      await deleteAlbum(token, albumId);
      setAlbums((prev) => prev.filter((a) => a.id !== albumId));
      await fetchPhotos();
    } catch (error) {
      console.error("Error deleting album:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchAlbums();
  }, [token]);

  return (
    <GalleryContext.Provider
      value={{
        photos,
        albums,
        loading,
        fetchPhotos,
        fetchAlbums,
        uploadPhoto: uploadPhotoHandler,
        deletePhoto: deletePhotoHandler,
        addAlbum: addAlbumHandler,
        deleteAlbum: deleteAlbumHandler,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context)
    throw new Error("useGallery must be used within a GalleryProvider");
  return context;
};
