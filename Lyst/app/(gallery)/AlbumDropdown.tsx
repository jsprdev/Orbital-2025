import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface AlbumDropdownProps {
  albumsArray: string[];
  albumName: string;
  setAlbumName: (album: string) => void;
}

export default function AlbumDropdown({
  albumsArray,
  albumName,
  setAlbumName,
}: AlbumDropdownProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (item: string) => {
    setAlbumName(item);
    setDropdownVisible(false);
    Keyboard.dismiss();
  };

  const filteredAlbums = albumsArray
    .filter((album) => album && album.trim() !== "")
    .filter((album) => album.toLowerCase().includes(albumName.toLowerCase()));

  return (
    <View className="relative">
      <Text className="mb-1 text-base font-medium">Album (Optional)</Text>

      <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
        <TouchableOpacity
          onPress={() => setDropdownVisible((prev) => !prev)}
          className="ml-1 mr-2"
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
            {filteredAlbums.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelect(item)}
                className="p-3 border-b border-gray-100"
              >
                <Text className="text-base">{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
