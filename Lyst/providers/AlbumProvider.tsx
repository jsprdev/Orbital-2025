import React, { createContext, useContext, useEffect, useState } from "react";
import { getAlbums, addAlbum } from "@/utils/albums.api";
import { useAuth } from "@/providers/AuthProvider";
import { Album } from "@/types/album.dto";

interface AlbumContextType {
  albums: Album[];
  selectedAlbumId: string | null;
  setSelectedAlbumId: (id: string | null) => void;
  addNewAlbum: (name: string) => Promise<string>; // returns albumId
  loading: boolean;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const AlbumProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAlbums = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAlbums(token);
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewAlbum = async (name: string): Promise<string> => {
    if (!token) throw new Error("No token available");
    try {
      const newAlbum = await addAlbum(token, name);
      setAlbums((prev) => {
        const exists = prev.find((a) => a.id === newAlbum.id);
        return exists ? prev : [...prev, newAlbum];
      });
      return newAlbum.id;
      
    } catch (error) {
      console.error("Error creating album:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [token]);

  return (
    <AlbumContext.Provider
      value={{
        albums,
        selectedAlbumId,
        setSelectedAlbumId,
        addNewAlbum,
        loading,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbum = () => {
  const context = useContext(AlbumContext);
  if (!context)
    throw new Error("useAlbum must be used within an AlbumProvider");
  return context;
};
