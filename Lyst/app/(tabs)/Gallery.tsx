import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { getPhotos, deletePhoto } from "../../utils/gallery.api";
import { useAuth } from "../../providers/AuthProvider";
import { Photo } from "../../types/gallery.dto";
import GalleryGrid from "../(gallery)/GalleryGrid";
import { getAlbums } from "@/utils/albums.api";


export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [albumId, setAlbumId] = useState<string[]>([]);
  const [albumList, setAlbumList] = useState<string[]>([]);
  const { token } = useAuth();

  const fetchPhotos = async () => {
    if (!token) return;
    try {
      const fetchedPhotos = await getPhotos(token);
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      Alert.alert("Error", "Failed to load photos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAlbums = async () => {
    if (!token) return;
    try {
      const data = await getAlbums(token);
      const albumId = data.map((album: any) => album.id);
      const albumNames = data.map((album: any) => album.name);
      setAlbumId(albumId);
      setAlbumList(albumNames);
    } catch (error) {
      console.error("Error fetching albums:", error);
      setAlbumList([]);
    }
  };


  const handleRefresh = () => {
    fetchPhotos();
    fetchAlbums();
  };

  useEffect(() => {
    handleRefresh();
  }, [token]);

  const handleDeletePhoto = async (photoId: string) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePhoto(token!, photoId);
            setPhotos(photos.filter((photo) => photo.id !== photoId));
            Alert.alert("Success", "Photo deleted successfully");
          } catch (error) {
            console.error("Error deleting photo:", error);
            Alert.alert("Error", "Failed to delete photo");
          }
        },
      },
    ]);
  };


  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="hotpink" />
        <Text className="mt-4 text-gray-600">Loading photos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-4 pt-12"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["hotpink"]}
          tintColor="hotpink"
        />
      }
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 mt-8">
        <Text className="text-2xl font-bold">All Photos ▼</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity onPress={() => router.push("/(gallery)/AddImage")}>
            <Feather name="plus" color="hotpink" size={28} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Photo Grid */}

      <GalleryGrid
        photos={photos}
        albumsId={albumId}
        albums={albumList}
        onDelete={handleDeletePhoto}
      />
    </ScrollView>
  );
}
