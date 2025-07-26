import React from "react";
import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function AddGiftForm() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>Add Gift Form</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
} 