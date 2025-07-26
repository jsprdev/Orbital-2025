import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddGift from "../(gifts)/AddGift";
import GiftsList from "../(gifts)/GiftsList";

export default function YourGifts() {
  const [refresh, setRefresh] = useState(false);
  const handleGiftAdded = () => setRefresh((r) => !r);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* top graphic */}
        <View className="py-4 bg-white relative flex-col items-center px-4 -mb-4">
          <Image
            source={require("@/assets/images/gifts.png")}
            style={{ width: 280, height: 280, marginBottom: -15 }}
            resizeMode="contain"
          />
          <Text className="text-5xl shadow-xl2 font-extrabold text-gray-700 text-center">
            Your Gifts
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16, marginBottom: 8, marginTop: 0 }}>
          <AddGift onGiftAdded={handleGiftAdded} />
        </View>
        <GiftsList key={refresh ? "1" : "0"} />
      </ScrollView>
    </SafeAreaView>
  );
}
