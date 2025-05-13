import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

export default function MakeAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = FIREBASE_AUTH;

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)/Profile'); // Redirect to main app after signup
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <SafeAreaView className="flex-1">

        <View className="items-center pt-12 pb-8">
          <Text className="text-4xl font-bold text-pink-500">Create Account</Text>
          <Text className="text-gray-600 mt-2">Just a few more clicks away.</Text>
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
            className="bg-blue-500 py-3 rounded-lg mb-3 items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-semibold">Create Account</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.back()}
            className="items-center"
          >
            <Text className="text-blue-500">
              Already have an account? <Text className="font-semibold">Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}