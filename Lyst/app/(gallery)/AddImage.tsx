import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import ImageCarousel from "./ImageCarousel";
import AlbumDropdown from "./AlbumDropdown";
import { useGallery } from "@/providers/GalleryProvider";

export default function AddImageScreen() {
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [albumName, setAlbumName] = useState<string>("");
  const { albums, uploadPhoto, addAlbum, loading, fetchAlbums } = useGallery();

  // Get album names for dropdown
  const allAlbumsName = albums.map((album) => album.name);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions to select images."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets) {
        const uris = result.assets.map((asset) => asset.uri);
        setSelectedImage((prev) => [...prev, ...uris]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera permissions to take photos."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }
    setUploading(true);
    try {
      // Ensure album exists or create it
      let album = albums.find((a) => a.name === albumName);
      if (!album) {
        album = await addAlbum(albumName);
      }
      if (!album || !album.id) {
        throw new Error("Album could not be found or created.");
      }

      await uploadPhoto(album.id!, selectedImage);
      await fetchAlbums(); // Refresh albums to ensure everything is in sync
      Alert.alert("Success", "Image uploaded successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
      setSelectedImage([]);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}
        <View className="relative flex-row justify-center items-center p-4 pt-12 mt-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 mt-7 pl-4"
          >
            <Feather name="arrow-left" size={28} color="hotpink" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold">Add Photo</Text>

          <TouchableOpacity
            onPress={takePhoto}
            className="absolute right-4 mt-7 pr-8"
          >
            <Feather name="camera" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Image Selection */}
        <View className="p-4">
          {selectedImage.length != 0 ? (
            <View className="items-center">
              <ImageCarousel
                images={selectedImage}
                onDelete={(index) =>
                  setSelectedImage((prev) => prev.filter((_, i) => i !== index))
                }
                flag={albumName}
              />
            </View>
          ) : (
            <View className="items-center">
              <TouchableOpacity
                onPress={pickImage}
                className="w-80 h-80 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mb-4"
              >
                <Feather name="image" size={64} color="gray" />
                <Text className="text-gray-500 mt-2 text-center">
                  No image selected {"\n"}Click Here to add photo.
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="px-6 space-y-4 mt-4">
            <View>
              <AlbumDropdown
                albumName={albumName}
                setAlbumName={setAlbumName}
              />
            </View>

            <View className="flex-row items-center justify-end mt-6 space-x-4">
              {selectedImage.length != 0 && (
                <TouchableOpacity
                  onPress={pickImage}
                  className="px-4 py-3 bg-blue-500 rounded-xl mr-2"
                >
                  <Text className="text-white font-semibold">
                    Add More Photos
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={uploadImage}
                disabled={selectedImage.length == 0 || uploading || loading}
                className={`px-4 py-3 rounded-xl shadow-md ${
                  selectedImage.length != 0 && !uploading && !loading
                    ? "bg-red-500"
                    : "bg-gray-300"
                }`}
              >
                {uploading || loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text
                    className={`font-semibold text-base ${
                      selectedImage.length != 0 && !uploading && !loading
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Upload
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
