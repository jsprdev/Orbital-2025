import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddIdea from '../(list)/AddIdea'
import { ScrollView } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import GeneratePlan from '../(plans)/GeneratePlan'

export default function YourPlans() {

  const handlePress = () => {
    router.push('/(plans)/route-selection');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
      
          {/* top graphic */}
          <View className="py-4 mb-2.5 bg-white  relative flex-col items-center px-4">
            <Image source={require('@/assets/images/roadPic.png')} style={{ width: 280, height: 280, marginBottom: -15 }} resizeMode="contain" />
            
            <Text className="text-5xl shadow-xl2 font-extrabold text-gray-700 text-center mt-3">
              Your Plans
            </Text>

            <GeneratePlan />
            
          </View>

          </ScrollView>

          
          
    </SafeAreaView>
     
    
  )
}