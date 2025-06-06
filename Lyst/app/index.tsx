// This is the first screen users see when they open the app.

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../providers/AuthProvider";


export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(tabs)/Profile");
    } catch (error:any) {
      if (error.code === "auth/invalid-credentials") {
        Alert.alert("Invalid Email or Password");
      } else {
        Alert.alert("Sign In Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpPage = () => {
    router.push("./(auth)/CreateAccount");
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="h-1/2 bg-gray-50 justify-center items-center">
        <Image
          source={require("../assets/images/loginPic.png")}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
      <View className="flex-1">
        <KeyboardAvoidingView className="h-1/2 rounded-t-3xl">
          <View className="items-left px-7 pt-12 pb-8">
            <Text className="text-4xl font-bold text-pink-500 shadow-md">
              Welcome to Lyst
            </Text>
          </View>

          <View className="px-6 justify-center">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              className="h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              className="h-12 border border-gray-300 rounded-lg px-4 mb-6 text-base shadow-md"
              secureTextEntry
            />
          </View>

          <View className="px-6 bottom">
            <TouchableOpacity
              onPress={handleSignIn}
              className="bg-primary py-3 rounded-lg mb-3 items-center"
            >
              <Text className="text-white text-lg font-semibold shadow-md">
                Log In
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-base">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={signUpPage}>
                <Text className="text-primary font-semibold text-base">
                  Register now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
