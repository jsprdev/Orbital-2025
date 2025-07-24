import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@/providers/AuthProvider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useGallery } from "@/providers/GalleryProvider";

const Settings = () => {
  const { user, signOutUser, changeEmail, changePassword } = useAuth();
  const [emailPopup, setEmailPopup] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [passwordPopup, setPasswordPopup] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>("");

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
    <SafeAreaView>
      <View className="relative flex-row justify-center items-center p-4 pt-14">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 top-14 ml-2"
        >
          <Feather name="arrow-left" size={28} color="hotpink" />
        </TouchableOpacity>

        <Text className="text-2xl text-gray-600 font-bold">Settings</Text>
      </View>

      {/* User Info */}
      <View className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-6 ml-6 mr-8 mt-2">
        <View className="flex-row items-center mb-4 mt-4 ml-2">
          <View className="rounded-full mr-4">
            <Image
              source={require("@/assets/images/profilePage/SampleProfilePicture.jpg")}
              className="w-16 h-16 rounded-full bg-gray-200"
            />
          </View>
          <View>
            <Text className="text-xl font-semibold text-gray-800">
              {user?.displayName || "User Name"}
            </Text>
            <Text className="text-gray-500">
              {user?.email || "user@example.com"}
            </Text>
          </View>
        </View>
      </View>

      <View className="border-b border-gray-200 mb-6 ml-6 mr-8"></View>

      {/* Security Section */}
      <View className="ml-6 mr-8 ">
        <Text className="text-lg font-bold text-gray-800 mb-4 ml-1">
          SECURITY
        </Text>

        <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-100"
            onPress={() => setEmailPopup(true)}
          >
            <MaterialCommunityIcons
              name="email-edit"
              size={24}
              color="gray"
              className="mr-3"
            />
            <Text className="text-gray-700 font-medium flex-1">
              Change Email
            </Text>
            <Feather name="chevron-right" size={20} color="gray" />
          </TouchableOpacity>

          <Modal visible={emailPopup} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50 px-6">
              <View className="bg-white rounded-xl w-full p-6">
                <Text className="text-lg font-semibold mb-2">
                  Enter new email
                </Text>
                <TextInput
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="e.g. your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="border border-gray-300 rounded-md px-4 py-3 mb-4"
                />
                <View className="flex-row justify-end space-x-4">
                  <TouchableOpacity onPress={() => setEmailPopup(false)}>
                    <Text className="text-gray-500 mr-3">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => changeEmail(newEmail)}>
                    <Text className="text-pink-500 font-bold">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-100"
            onPress={() => setPasswordPopup(true)}
          >
            <MaterialCommunityIcons
              name="lock-reset"
              size={24}
              color="gray"
              className="mr-3"
            />
            <Text className="text-gray-700 font-medium flex-1">
              Change Password
            </Text>
            <Feather name="chevron-right" size={20} color="gray" />
          </TouchableOpacity>

          <Modal visible={passwordPopup} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50 px-6">
              <View className="bg-white rounded-xl w-full p-6">
                <Text className="text-lg font-semibold mb-2">New Password</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Password min. 6 characters"
                  autoCapitalize="none"
                  className="border border-gray-300 rounded-md px-4 py-3 mb-4"
                />

                <Text className="text-lg font-semibold mb-2">
                  Confirm Password
                </Text>
                <TextInput
                  value={newConfirmPassword}
                  onChangeText={setNewConfirmPassword}
                  placeholder="Password min. 6 characters"
                  autoCapitalize="none"
                  className="border border-gray-300 rounded-md px-4 py-3 mb-4"
                />

                <View className="flex-row justify-end space-x-4">
                  <TouchableOpacity onPress={() => setPasswordPopup(false)}>
                    <Text className="text-gray-500 mr-3">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => changePassword(newPassword)}>
                    <Text className="text-pink-500 font-bold">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>

      {/* More Section */}
      <View className="ml-6 mr-8 mt-8">
        <Text className="text-lg font-bold text-gray-800 mb-4 ml-1">MORE</Text>

        <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color="gray"
              className="mr-3"
            />
            <Text className="text-gray-700 font-medium flex-1">
              Notification Preference
            </Text>
            <Feather name="chevron-right" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
            <MaterialCommunityIcons
              name="help"
              size={24}
              color="gray"
              className="mr-3"
            />
            <Text className="text-gray-700 font-medium flex-1">
              Help and Support
            </Text>
            <Feather name="chevron-right" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <View className="bg-red-100 rounded-xl border border-gray-200 overflow-hidden ml-6 mr-8 mt-8">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center p-4"
        >
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color="red"
            className="mr-3"
          />
          <Text className="text-red-500 font-medium flex-1">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
