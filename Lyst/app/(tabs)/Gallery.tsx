import React from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function Gallery() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Text className="text-2xl font-bold text-gray-800">Gallery</Text>
            <Text className="text-gray-600 mt-2">This is the Gallery page.</Text>
        </SafeAreaView>
    );
}