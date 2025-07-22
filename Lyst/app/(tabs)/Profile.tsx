import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Touchable,
  TextInput
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { generateCode, joinCode } from "@/utils/partner.api";

const Profile = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [inviteCode, setInviteCode] = useState<string>("");
  const { user, signOutUser, token } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.replace("/");
    } catch (error) {
      Alert.alert("error", "failed to log out");
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 mt-8">
        <View className="items-center py-8">
          <View className="w-32 h-32 rounded-full bg-gray-200 mb-4" />
          <Text className="text-2xl font-bold">
            {user?.displayName}'s Profile
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowOptions(!showOptions)}
          className="bg-gray-100 p-4 rounded-lg"
        >
          <Text>Your Partner ▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-lg items-center mt-4"
          onPress={async () => {
            const code = await generateCode(token!);
            setGeneratedCode(code);
          }}
        >
          <Text className="text-white text-lg font-semibold">
            {generatedCode
              ? `Your Code: ${generatedCode}`
              : "Generate Partner Code"}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Enter Partner Code Here"
          placeholderTextColor="#9CA3AF"
          value={inviteCode}
          onChangeText={setInviteCode}
          className="h-12 border border-gray-300 rounded-lg px-4 mt-4 text-base"
        />
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-lg items-center mb-8"
          onPress={async () => {
            if (inviteCode) {
              const flag = await joinCode(token!, inviteCode);
              console.log(flag)
            }
          }}
        >
          <Text>Partner Up!</Text>
        </TouchableOpacity>
        {showOptions && (
          <View className="bg-white border p-4 mt-1 rounded-lg">
            <Text>Partner Functionality Coming Soon!</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-pink-500 py-3 rounded-lg items-center"
        >
          <Text className="text-white text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
