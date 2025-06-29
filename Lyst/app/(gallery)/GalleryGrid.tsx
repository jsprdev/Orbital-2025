import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import PhotoCard from "./PhotoCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useGallery } from "@/providers/GalleryProvider";

const GalleryGrid = () => {
  const { photos, albums, deletePhoto } = useGallery();

  // Handle Delete
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

  const handleViewAll = (albumId: string, albumName: string) => {
    router.push({
      pathname: "/(gallery)/AlbumView",
      params: { albumId, albumName },
    });
  };

  // Group photos by albumId (stored in photo.albumId)
  const photosByAlbum: Record<string, any[]> = {};
  albums.forEach((album) => {
    if (album.id) {
      photosByAlbum[album.id] = [];
    }
  });
  photosByAlbum["Uncategorized"] = [];

  photos.forEach((photo) => {
    const photoAlbumId = photo.albumId || "";

    if (photoAlbumId && photosByAlbum[photoAlbumId] !== undefined) {
      photosByAlbum[photoAlbumId].push(photo);
    } else {
      photosByAlbum["Uncategorized"].push(photo);
    }
  });

  const nonEmptyAlbums = Object.entries(photosByAlbum).filter(
    ([_, albumPhotos]) => albumPhotos.length > 0,
  );

  if (nonEmptyAlbums.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-gray-500 text-lg" testID="no-photos-found">
          No photos found
        </Text>
      </View>
    );
  }
  return (
    <View className="w-full">
      {nonEmptyAlbums.map(([albumId, albumPhotos]) => {
        const album = albums.find((a) => a.id === albumId);
        const albumName = album ? album.name : "Uncategorized";

        return (
          <View key={albumId} className="mb-6 w-full">
            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text className="text-lg font-semibold">
                {albumName} ({albumPhotos.length})
              </Text>
              <TouchableOpacity
                onPress={() => handleViewAll(albumId, albumName)}
              >
                <View className="flex-row items-center space-x-1">
                  <Text className="text-base text-black-500 font-medium">
                    See All
                  </Text>
                  <FontAwesome
                    name="long-arrow-right"
                    size={20}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={albumPhotos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="mr-3 w-[150px] h-[150px]">
                  <PhotoCard photo={item} onDelete={handleDeletePhoto} />
                </View>
              )}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );
      })}
    </View>
  );
};

export default GalleryGrid;
