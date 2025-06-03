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
  Image
} from "react-native";
import { FIREBASE_AUTH } from "../FirebaseConfig";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const router = useRouter();
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    console.log("Attempting login with:", email);

    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)/Profile'); 

    } catch (error: any) {
      let errorMessage = '';
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      }
      Alert.alert("Account Not Found. Please Sign in.", errorMessage);
    } 
  };

  const signUp = () => {
    router.push("/(auth)/createAccount");
  };

  // for dev purposes, skip to home page
  const toHome = () => {
    router.push("/(tabs)/Profile");
  }
  

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1">
        
        
      <KeyboardAvoidingView 
        className="h-1/2 rounded-t-3xl"
        >

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
            onPress={signIn}
            className="bg-primary py-3 rounded-lg mb-3 items-center"
          >
            <Text className="text-white text-lg font-semibold shadow-md">Log In</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600 text-base">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={signUp}>
              <Text className="text-primary font-semibold text-base">
                Register now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    </KeyboardAvoidingView>

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
  </View>
</SafeAreaView>
);
}
