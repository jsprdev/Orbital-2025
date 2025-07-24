import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import SingleProfile from "../(profile)/SingleProfile";
import CoupleProfile from "../(profile)/CoupleProfiePage";
import { getPartnerDetails } from "@/utils/partner.api";
import AntDesign from "@expo/vector-icons/AntDesign";

const Profile = () => {
  const { token } = useAuth();
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchPairStatus() {
      if (token) {
        const temp = await getPartnerDetails(token);
        if (temp.partnerUserId) {
          setHasPartner(true);
        } else {
          setHasPartner(false);
        }
      }
    }
    fetchPairStatus();
  }, [token]);
    
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className=" mb-4 mt-8 px-4 pt-4 ">
        <View className="items-center mt-4">
          <Text className="text-2xl font-bold mb-2">Profile</Text>
          <TouchableOpacity
            onPress={() => router.push("/(profile)/Settings")}
            className="absolute right-2 pr-2"
          >
            <AntDesign name="setting" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}>
          {hasPartner === null ? (
            <Text>Loading...</Text>
          ) : hasPartner ? (
            <CoupleProfile />
          ) : (
            <SingleProfile />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


export default Profile;

