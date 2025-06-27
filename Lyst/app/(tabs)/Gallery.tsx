import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import GalleryGrid from "../(gallery)/GalleryGrid";
import { useGallery } from "@/providers/GalleryProvider";

export default function GalleryScreen() {
  const { photos, albums, loading, fetchPhotos, fetchAlbums, deletePhoto } =
    useGallery();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
    await fetchAlbums();
    setRefreshing(false);
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
    <View className="flex-1 bg-white">
      {/* Header - Outside ScrollView */}
      <View className="flex-row justify-between items-center mb-4 mt-8 px-4 pt-12">
        <Text className="text-2xl font-bold">All Photos ▼</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity onPress={() => router.push("/(gallery)/AddImage")}>
            <Feather name="plus" color="hotpink" size={28} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Photo Grid - Inside ScrollView */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["hotpink"]}
            tintColor="hotpink"
          />
        }
      >
        <GalleryGrid />
      </ScrollView>
    </View>
  );
}
