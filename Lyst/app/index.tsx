// This is the first screen users see when they open the app.
import "react-native-get-random-values";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
  Image,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";

export default function Index() {
  const [email, setEmail] = useState("b@gmail.com");
  const [password, setPassword] = useState("abcabc");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signIn, forgotPassword } = useAuth();

  const insets = useSafeAreaInsets();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      console.log("Signing in..");
      await signIn(email, password);
      console.log("Sign in Successful");
      router.replace("/(tabs)/Profile");
    } catch (error: any) {
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
    router.push("./(auth)/createAccount");
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert("Please enter your email address.");
    }
    forgotPassword(email)
      .then(() => {
        Alert.alert("Password reset email sent!");
      })
      .catch((error) => {
        Alert.alert("Forgot Password Error", error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-1">
        <View className="h-1/2 bg-gray-50 justify-center items-center relative">
          <Image
            source={require("../assets/images/loginPic.png")}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          <View
            className="absolute bottom-0 left-0 right-0 bg-white"
            style={{
              height: 20,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          />
        </View>

        <View className="flex-1 bg-white">
          <View className="items-left px-7 pt-6 pb-8">
            <Text className="text-4xl font-bold text-pink-500 shadow-sm">
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

          <View className="px-6" style={{ paddingBottom: insets.bottom }}>
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

            <View className="flex-row justify-center items-center mt-4">
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-primary font-semibold text-base ml-2">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
