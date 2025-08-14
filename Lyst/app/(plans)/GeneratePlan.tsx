import { View } from "react-native";
import React from "react";
import { router } from "expo-router";
import GeneratePlanButton from "./GeneratePlanButton";

export default function GeneratePlan() {
  const handlePress = () => {
    router.push("/(plans)/RouteSelection");
  };

  return (
    <View>
      <GeneratePlanButton handlePress={handlePress} />
    </View>
  );
}
