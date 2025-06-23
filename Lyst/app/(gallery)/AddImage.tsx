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
import { TextInput } from "react-native-gesture-handler";

export default function AddImageScreen() {
  const [selectedImage, setSelectedImage] = useState<string[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");

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
          {selectedImage ? (
            <View className="items-center">
              <Image
                source={{ uri: selectedImage[0] }}
                className="w-80 h-80 rounded-lg mb-4"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute bottom-6 bg-white p-1 rounded-full shadow"
              >
                <Feather name="x" size={18} color="red" />
              </TouchableOpacity>
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

          <View className="px-6 space-y-4">
            {/* Description Field */}
            <View>
              <Text>Description</Text>
              <TextInput
                placeholder="Add a description to your Photo"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                className="h-12 border border-gray-300 rounded-lg px-4 mt-1 text-base"
                autoCapitalize="none"
                keyboardType="default"
              />
            </View>

            {/* Place Field */}
            <View className="mt-4">
              <Text>Place</Text>
              <TextInput
                placeholder="Add a location to your Photo"
                placeholderTextColor="#9CA3AF"
                value={place}
                onChangeText={setPlace}
                className="h-12 border border-gray-300 rounded-lg px-4 mt-1 text-base"
                autoCapitalize="none"
                keyboardType="default"
              />
            </View>

            <View className="items-end mt-6">
              <TouchableOpacity
                onPress={uploadImage}
                disabled={!selectedImage || uploading}
                className={`px-6 py-3 rounded-xl shadow-md ${
                  selectedImage && !uploading ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text
                    className={`font-semibold text-base ${
                      selectedImage && !uploading
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
