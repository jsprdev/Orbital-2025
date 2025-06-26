import React from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import PhotoCard from "./PhotoCard";
import { Photo } from "../../types/gallery.dto";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface GalleryGridProps {
  photos: Photo[];
  albumsId: string[];
  albums: string[];
  onDelete: (photoId: string) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  photos = [],
  albumsId = [],
  albums = [],
  onDelete,
}) => {
  // Group photos by albumId (stored in photo.albumName)
  const photosByAlbum: Record<string, Photo[]> = {};

  // Initialize albums by ID
  albumsId.forEach((albumId) => {
    photosByAlbum[albumId] = [];
  });

  // Always include Uncategorized
  photosByAlbum["Uncategorized"] = [];

  // Categorize photos
  photos.forEach((photo) => {
    const albumId = photo.albumName?.trim() || "";
    if (albumId && albumsId.includes(albumId)) {
      photosByAlbum[albumId].push(photo);
    } else {
      photosByAlbum["Uncategorized"].push(photo);
    }
  });

  // Only show albums with photos
  const nonEmptyAlbums = Object.entries(photosByAlbum).filter(
    ([_, albumPhotos]) => albumPhotos.length > 0
  );

  if (nonEmptyAlbums.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-gray-500 text-lg">No photos found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 w-full">
      {nonEmptyAlbums.map(([albumId, albumPhotos]) => {
        // Find the album name by index
        const albumIndex = albumsId.indexOf(albumId);
        const albumName =
          albumIndex !== -1 ? albums[albumIndex] : "Uncategorized";
        return (
          <View key={albumId} className="mb-6 w-full">
            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text className="text-lg font-semibold">
                {albumName} ({albumPhotos.length})
              </Text>
              <TouchableOpacity>
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
                  <PhotoCard photo={item} onDelete={onDelete} />
                </View>
              )}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default GalleryGrid;
