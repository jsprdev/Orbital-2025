import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { usePartner } from "@/providers/PartnerProvider";
import { generateCode, joinCode } from "@/utils/partner.api";
import AntDesign from "@expo/vector-icons/AntDesign";

const SingleProfile = () => {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [inviteCode, setInviteCode] = useState<string>("");
  const { user, token } = useAuth();
  const { fetchPartner }  = usePartner();

  return (
    <>
      <View className="items-center py-8">
        <Image
          source={require("@/assets/images/profilePage/SampleProfilePicture.jpg")}
          className="w-48 h-48 rounded-full bg-gray-200 mb-4"
        />
        <Text className="text-3xl font-bold">{user?.displayName}</Text>
        <Text className="text-xl font-light">Not Paired</Text>
      </View>
      <TouchableOpacity
        className="bg-blue-500 px-4 py-3 rounded-full self-center"
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
      <View className="flex-row items-center ml-8 mr-8 mt-6 mb-8">
        <TextInput
          keyboardType="numeric"
          placeholder="Enter Partner Code Here"
          placeholderTextColor="#9CA3AF"
          value={inviteCode}
          onChangeText={setInviteCode}
          className="flex-1 h-14 border border-gray-300 rounded-lg rounded-tr-none rounded-br-none px-4 text-base"
        />
        <TouchableOpacity
          className="bg-blue-500 h-14 p-3 w-16 rounded-lg rounded-tl-none rounded-bl-none justify-center items-center"
          onPress={async () => {
            if (inviteCode) {
              const flag = await joinCode(token!, inviteCode);
              await fetchPartner();
            }
          }}
        >
          <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SingleProfile;
