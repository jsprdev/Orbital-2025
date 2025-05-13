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
  Image,
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
      router.replace('/(tabs)/Profile'); 

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

  const signUp = () => {
    router.push("/(auth)/createAccount");
  };

  // for dev purposes, skip to home page
  // const toHome = () => {
  //   router.push("/(tabs)/Profile");
  // }
  

  return (
    <>
      <View className="h-1/2 bg-gray-50 justify-center items-center">
        <Image
          source={require("../assets/images/loginPic.png")}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}  
        />
    </View>
      <KeyboardAvoidingView 
          className="h-1/2 bg-white rounded-t-3xl -mt-6">
        <SafeAreaView className="flex-1">
          <View className="items-left px-7 pt-12 pb-8">
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
              className="bg-primary py-3 rounded-lg mb-3 items-center"
            >
              <Text className="text-white text-lg font-semibold">Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={signUp}
              className="bg-secondary py-3 rounded-lg items-center"
            >
              <Text className="text-white text-lg font-semibold">
                Create New Account
              </Text>
            </TouchableOpacity>

            {/* skip to home page FOR TESTING */}
  {/* 
            <TouchableOpacity
              onPress={toHome}
              className="bg-pink-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white text-lg font-semibold">
                Skip to Home
              </Text>
            </TouchableOpacity> */}
            
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}
