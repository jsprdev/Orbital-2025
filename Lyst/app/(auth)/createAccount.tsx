// This is the page where users can create a new account.
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { createUser } = useAuth();
  

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await createUser(email, password, confirmPassword);
      router.replace("/(tabs)/Profile");
    } catch (error:any) {
      console.log("Sign Up Error:", error);
      if (error.code === "auth/invalid-credentials") {
        Alert.alert("Invalid Email or Password");
      } else {
        Alert.alert("Sign In Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="items-center pt-12 pb-8">
          <Text className="text-4xl font-bold text-pink-500">
            Create Account
          </Text>
          <Text className="text-gray-600 mt-2">
            Just a few more clicks away.
          </Text>
        </View>

        <View className="px-6">
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
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            className="h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
            secureTextEntry
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="h-12 border border-gray-300 rounded-lg px-4 mb-6 text-base"
            secureTextEntry
          />

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            className="bg-primary py-3 rounded-lg mb-3 items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center"
          >
            <Text className="text-secondary">
              Already have an account?{" "}
              <Text className="font-semibold text-primary">Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
