import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { uploadPhoto } from "../../utils/galleryAPI";
import { useAuth } from "../../providers/AuthProvider";

export default function AddImageScreen() {
  const [selectedImage, setSelectedImage] = useState<string[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions to select images."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage([result.assets[0].uri]);
        console.log("Selected image:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera permissions to take photos."
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage([result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const uploadImage = async () => {
    if (!selectedImage || !token) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    setUploading(true);
    try {
      await uploadPhoto(token, selectedImage);
      Alert.alert("Success", "Image uploaded successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setSelectedImage(null);
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 pt-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="hotpink" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Add Photo</Text>
        <TouchableOpacity
          onPress={uploadImage}
          disabled={!selectedImage || uploading}
          className={`px-4 py-2 rounded-lg ${
            selectedImage && !uploading ? "bg-hotpink" : "bg-gray-300"
          }`}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold">Upload</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Image Selection */}
      <View className="p-4">
        {selectedImage ? (
          <View className="items-center">
            <Image
              source={{ uri: selectedImage[0] }}
              className="w-80 h-80 rounded-lg mb-4"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center">
            <View className="w-80 h-80 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mb-4">
              <Feather name="image" size={64} color="gray" />
              <Text className="text-gray-500 mt-2 text-center">
                No image selected
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={pickImage}
            className="bg-pink py-3 rounded-lg items-center"
          >
            <Text className="text-black font-semibold text-lg">
              Choose from Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            className="bg-blue-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
