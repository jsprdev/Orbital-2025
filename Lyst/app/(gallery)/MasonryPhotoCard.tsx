import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Photo } from "@/types/gallery.dto";

type Props = {
  photo: Photo;
  onDelete: (photoId: string) => void;
  toggleDeleteIcons: boolean;
};

export default function MansonryPhotoCard({
  photo,
  onDelete,
  toggleDeleteIcons,
}: Props) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Image.getSize(
      photo.url,
      (w, h) => {
        setAspectRatio(w > 0 && h > 0 ? w / h : 1);
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, [photo.url]);

  return (
    <View className="relative rounded-2xl overflow-hidden">
      {loading ? (
        <View className="py-10 items-center justify-center bg-gray-100">
          <ActivityIndicator />
        </View>
      ) : (
        <Image
          source={{ uri: photo.url }}
          style={{ aspectRatio }}
          className="w-full rounded-2xl"
          testID="image"
        />
      )}
      {toggleDeleteIcons && (
        <TouchableOpacity
          onPress={() => onDelete(photo.id)}
          className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full"
        >
          <Feather name="trash" size={16} color="white" testID="trash-icon" />
        </TouchableOpacity>
      )}
    </View>
  );
}
