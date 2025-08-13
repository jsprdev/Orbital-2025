import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useGallery } from "@/providers/GalleryProvider";
import MasonryList from "@react-native-seoul/masonry-list";
import MasonryPhotoCard from "./MasonryPhotoCard";
import { Photo } from "@/types/gallery.dto";

export default function AlbumView() {
  const { albumId, albumName } = useLocalSearchParams<{
    albumId: string;
    albumName: string;
  }>();

  const { photos, deletePhoto } = useGallery();
  const [showDeleteIcons, setShowDeleteIcons] = useState<boolean>(false);

  const handleDeletePhoto = async (photoId: string) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePhoto(photoId);
            Alert.alert("Success", "Photo deleted successfully");
          } catch (error) {
            console.error("Error deleting photo:", error);
            Alert.alert("Error", "Failed to delete photo");
          }
        },
      },
    ]);
  };

  // Filter photos by album
  const albumPhotos = photos.filter((photo) => {
    if (albumId === "Uncategorized") {
      return !photo.albumId || photo.albumId === "";
    }
    return photo.albumId === albumId;
  });

  const displayName = albumName || "Uncategorized";

  if (albumPhotos.length === 0) {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="relative flex-row justify-center items-center p-4 pt-12 mt-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 mt-7 pl-4"
          >
            <Feather name="arrow-left" size={28} color="hotpink" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">{displayName}</Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-gray-500 text-lg">No photos in this album</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="relative flex-row justify-center items-center p-4 pt-12 mt-8"
        testID="album-header"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 mt-7 pl-4"
        >
          <Feather name="arrow-left" size={28} color="hotpink" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">
          {displayName} - ({albumPhotos.length})
        </Text>

        <TouchableOpacity
          onPress={() => setShowDeleteIcons(!showDeleteIcons)}
          className="absolute right-4 mt-7 pr-4"
        >
          <Feather name="trash-2" size={24} color="hotpink" />
        </TouchableOpacity>
      </View>

      {/* Photo Grid */}
      <MasonryList
        data={albumPhotos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="m-2">
            <MasonryPhotoCard
              photo={item as Photo}
              onDelete={handleDeletePhoto}
              toggleDeleteIcons={showDeleteIcons}
            />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      />
    </View>
  );
}
