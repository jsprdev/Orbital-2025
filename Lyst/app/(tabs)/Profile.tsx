import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const goBack = () => {
  router.push('../')
};


const Profile = () => {
  const [showOptions, setShowOptions] = useState(false);

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('error', 'failed to log out');
      console.error('Logout error:', error);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <View className="items-center py-8">
          <View className="w-32 h-32 rounded-full bg-gray-200 mb-4" />
          <Text className="text-2xl font-bold">Welcome!</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => setShowOptions(!showOptions)}
          className="bg-gray-100 p-4 rounded-lg"
        >
          <Text>Your Partner ▼</Text>
        </TouchableOpacity>
        
        {showOptions && (
          <View className="bg-white border p-4 mt-1 rounded-lg">
            <Text>Partner Functionality Coming Soon!</Text>
          </View>
        )}

        <TouchableOpacity
                onPress={handleLogout}
                className="bg-pink-500 py-3 rounded-lg items-center"
              >
                <Text className="text-white text-lg font-semibold">
                  Logout
                </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Profile

