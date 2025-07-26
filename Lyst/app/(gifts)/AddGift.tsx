import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import AddGiftButton from "./AddGiftButton";
import { createGift } from "@/utils/gifts.api";
import { useAuth } from "@/providers/AuthProvider";

const { height } = Dimensions.get("window");

export default function AddGift({ onGiftAdded }: { onGiftAdded?: () => void }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [visible, setVisible] = useState(false);
  const [giftName, setGiftName] = useState("");
  const [giftUrl, setGiftUrl] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const { token } = useAuth();

  const openDrawer = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      setGiftName("");
      setGiftUrl("");
      setGiftPrice("");
    });
  };

  const onSaveGift = async () => {
    if (!giftName.trim() || !giftUrl.trim() || !giftPrice.trim() || !token) return;
    await createGift({ name: giftName, url: giftUrl, price: giftPrice, createdAt: new Date().toISOString() }, token);
    closeDrawer();
    if (onGiftAdded) onGiftAdded();
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <AddGiftButton handlePress={openDrawer} />
      <Modal transparent visible={visible} animationType="none">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={closeDrawer}
        />
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: height * 0.6,
            bottom: 0,
            top: undefined,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
          <Text className="text-xl font-bold mb-4">Add New Gift</Text>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
            <Text className="font-semibold mb-1">Gift Name</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 mb-4"
              placeholder="Enter gift name"
              value={giftName}
              onChangeText={setGiftName}
            />
            <Text className="font-semibold mb-1">Gift URL</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 mb-4"
              placeholder="Paste a link"
              value={giftUrl}
              onChangeText={setGiftUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text className="font-semibold mb-1">Price</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 mb-4"
              placeholder="Enter price"
              value={giftPrice}
              onChangeText={setGiftPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={onSaveGift}
              className="bg-blue-600 rounded py-3 items-center"
            >
              <Text className="text-white font-bold text-lg">Save Gift</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeDrawer}
              className="mt-3 bg-gray-300 rounded py-2 items-center"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}
