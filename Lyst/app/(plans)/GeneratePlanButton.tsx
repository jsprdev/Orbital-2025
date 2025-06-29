import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";

export default function GeneratePlanButton({
  handlePress,
}: {
  handlePress: () => void;
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="w-full self-center p-20 py-2 rounded-xl items-center bg-pink-500 mt-4"
      >
        <Text className="text-white shadow-xl text-lg font-bold">
          Make a Plan
        </Text>
      </TouchableOpacity>
    </View>
  );
}
