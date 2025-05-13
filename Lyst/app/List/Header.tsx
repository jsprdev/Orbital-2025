import React from 'react';
import { Text, View } from 'react-native';

export default function Header() {
  return (
    <View className="py-4 mb-2.5 bg-white items-center justify-center border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-700">Your Lyst</Text>
    </View>
  );
}