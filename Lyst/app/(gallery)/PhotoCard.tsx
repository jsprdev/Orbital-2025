import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Photo } from "../../types/gallery.dto";

interface PhotoCardProps {
  photo: Photo;
  onDelete: (photoId: string) => void;
}

export default function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  return (
    <View
      className="mb-4"
      style={{ width: "48%", aspectRatio: 1, position: "relative" }}
    >
      <Image
        source={{ uri: photo.url }}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
      />
      <View className="absolute top-2 right-2 flex-row space-x-2">
        <TouchableOpacity
          className="bg-white rounded-full p-1"
          style={{ elevation: 2 }}
        >
          <Feather name="heart" size={16} color="hotpink" fill="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-full p-1"
          style={{ elevation: 2 }}
          onPress={() => onDelete(photo.id)}
        >
          <Feather name="trash-2" size={16} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
