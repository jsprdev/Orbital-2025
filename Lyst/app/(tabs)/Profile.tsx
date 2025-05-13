import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const Profile = () => {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <View className="items-center py-8">
          <View className="w-32 h-32 rounded-full bg-gray-200 mb-4" />
          <Text className="text-2xl font-bold">Welcome, User!</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => setShowOptions(!showOptions)}
          className="bg-gray-100 p-4 rounded-lg"
        >
          <Text>Your Partner ▼</Text>
        </TouchableOpacity>
        
        {showOptions && (
          <View className="bg-white border p-4 mt-1 rounded-lg">
            <Text>Lirilli Larilla</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default Profile