import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { router } from 'expo-router';

const goBack = () => {
  router.push('../')
};

const Home = () => {
  return (
    <SafeAreaView className="flex-1">
      <Text>Home Page</Text>
      <TouchableOpacity
        onPress={goBack}
        className="bg-pink-500 py-3 rounded-lg items-center"
      >
        <Text className="text-white text-lg font-semibold">
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
