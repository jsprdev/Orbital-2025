import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGallery } from "@/providers/GalleryProvider";

interface AlbumDropdownProps {
  albumName: string;
  setAlbumName: (name: string) => void;
}

export default function AlbumDropdown({
  albumName,
  setAlbumName,
}: AlbumDropdownProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { albums, photos } = useGallery();

  const handleSelect = (selectedAlbumName: string) => {
    setAlbumName(selectedAlbumName);
    setDropdownVisible(false);
    Keyboard.dismiss();
  };

  // Filter out albums with no photos, but allow albums with empty names
  const nonEmptyAlbums = albums.filter((album) => {
    if (!album) return false;

    // Check if album has any photos
    const albumPhotos = photos.filter((photo) => photo.albumId === album.id);
    return albumPhotos.length > 0;
  });

  const filteredAlbums = nonEmptyAlbums.filter((album) =>
    album.name.toLowerCase().includes(albumName.toLowerCase()),
  );

  return (
    <View className="relative">
      <Text className="mb-1 text-base font-medium">Album (Optional)</Text>

      <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
        <TouchableOpacity
          onPress={() => setDropdownVisible((prev) => !prev)}
          className="ml-1 mr-2"
          testID="album-icon"
        >
          <Ionicons name="albums" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          placeholder="Select existing or enter new album"
          placeholderTextColor="#9CA3AF"
          value={albumName}
          onChangeText={(text) => {
            setAlbumName(text);
            setDropdownVisible(true);
          }}
          className="flex-1 h-12 text-base"
        />
      </View>

      {dropdownVisible && filteredAlbums.length > 0 && (
        <View className="absolute top-full z-10 w-full bg-white border border-gray-200 rounded-md max-h-48 bg-opacity-50">
          <ScrollView
            style={{ maxHeight: 200 }}
            keyboardShouldPersistTaps="handled"
          >
            {filteredAlbums.map((album) => (
              <TouchableOpacity
                key={album.id}
                onPress={() => handleSelect(album.name)}
                className="p-3 border-b border-gray-100"
              >
                <Text className="text-base">{album.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
