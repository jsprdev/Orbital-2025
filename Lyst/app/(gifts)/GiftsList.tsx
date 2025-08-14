import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Linking, RefreshControl, TouchableOpacity } from "react-native";
import { getGifts, deleteGift } from "@/utils/gifts.api";
import { useAuth } from "@/providers/AuthProvider";
import { Gift } from "@/types";
import Feather from "@expo/vector-icons/Feather";

export default function GiftsList() {
  const { token } = useAuth();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGifts = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const data = await getGifts(token);
      setGifts(data);
    } catch (e) {
      console.error("Error fetching gifts:", e);
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGifts();
  }, [token, fetchGifts]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    await deleteGift(id, token);
    fetchGifts();
  };

  // Helper to chunk gifts into rows of 2
  const chunkGifts = (arr: Gift[], size: number) => {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size));
    }
    return res;
  };

  const giftRows = chunkGifts(gifts, 2);

  return (
    <ScrollView
      className="flex-1 px-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchGifts} />}
    >
      {gifts.length === 0 ? (
        <Text className="text-gray-400 text-center mt-8">No gifts yet. Add one!</Text>
      ) : (
        giftRows.map((row, rowIdx) => (
          <View key={rowIdx} className="flex-row mb-4">
            {row.map((gift, colIdx) => (
              <View
                key={gift.id}
                className={`flex-1 bg-white rounded-xl shadow p-4 border border-gray-200 mx-1 relative ${row.length === 1 ? "mr-1" : colIdx === 0 ? "mr-1" : "ml-1"}`}
              >
                <TouchableOpacity
                  className="absolute top-2 right-2 z-10 p-1"
                  onPress={() => handleDelete(gift.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="trash-2" size={20} color="#ef4444" />
                </TouchableOpacity>
                <Text className="font-bold text-base mb-1" numberOfLines={1}>
                  {gift.name}
                </Text>
                <Text
                  className="text-blue-600 underline mb-1 text-sm"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  onPress={() => Linking.openURL(gift.url)}
                >
                  {gift.url}
                </Text>
                <Text className="text-gray-500 text-sm">${gift.price}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
} 