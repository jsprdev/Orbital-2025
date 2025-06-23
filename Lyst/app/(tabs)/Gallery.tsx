import React, { useState, useEffect } from "react";
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
import { useFocusEffect } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { getPhotos, deletePhoto } from "../../utils/galleryAPI";
import { useAuth } from "../../providers/AuthProvider";
import { Photo } from "../../types/gallery.dto";
import PhotoCard from "../(gallery)/PhotoCard";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  useEffect(() => {
    fetchPhotos();
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
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
            <Feather name="plus" color="hotpink" size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="search" color="hotpink" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Favourite label */}
      <Text className="text-lg font-semibold mb-2">Favourites</Text>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <View className="flex-1 justify-center items-center py-20">
          <Feather name="image" size={64} color="gray" />
          <Text className="text-gray-500 mt-4 text-lg">No photos yet</Text>
          <Text className="text-gray-400 mt-2 text-center">
            Tap the + button to add your first photo
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={handleDeletePhoto}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
