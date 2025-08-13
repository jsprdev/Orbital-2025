import React from "react";
import { View, Image } from "react-native";
import { Photo } from "../../types/gallery.dto";

interface PhotoCardProps {
  photo: Photo;
  onDelete: (photoId: string) => void;
}

export default function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  return (
    <View className="w-full h-full" style={{ position: "relative" }}>
      <Image
        source={{ uri: photo.url }}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
        testID="photo"
      />
    </View>
  );
}
