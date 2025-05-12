import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { FIREBASE_AUTH } from "../FirebaseConfig";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    console.log("Attempting login with:", email);

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = '';
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to signup page
  const signUp = () => {
    router.push("/(auth)/createAccount");
  };

  // Skip the login page
  const toHome = () => {
    router.push("/(tabs)/home");
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="items-center pt-12 pb-8">
          <Text className="text-4xl font-bold text-pink-500">
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
            onPress={signIn}
            className="bg-blue-500 py-3 rounded-lg mb-3 items-center"
          >
            <Text className="text-white text-lg font-semibold">Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signUp}
            className="bg-emerald-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white text-lg font-semibold">
              Create New Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toHome}
            className="bg-pink-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white text-lg font-semibold">
              Skip to Home
            </Text>
          </TouchableOpacity>
          
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
