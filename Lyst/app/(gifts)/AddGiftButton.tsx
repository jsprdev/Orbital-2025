import React from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";

export default function AddGiftButton({
  handlePress,
}: {
  handlePress: () => void;
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="self-center p-20 py-2 rounded-xl items-center bg-pink-500 mt-4 mb-5"
      >
        <Text className="text-white shadow-xl text-lg font-bold">
          Add a Gift
        </Text>
      </TouchableOpacity>
    </View>
  );
}
