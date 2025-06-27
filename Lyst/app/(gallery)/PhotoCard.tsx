import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Photo } from "../../types/gallery.dto";

interface PhotoCardProps {
  photo: Photo;
  onDelete: (photoId: string) => void;
}

export default function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  const [loading, setLoading] = useState(false);

  return (
    <View className="w-full h-full" style={{ position: "relative" }}>
      <Image
        source={{ uri: photo.url }}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
        onLoadEnd={() => setLoading(true)}
        testID="photo"
      />
    </View>
  );
}
