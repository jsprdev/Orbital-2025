import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddIdea from '../(list)/AddIdea'
import { ScrollView } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import GeneratePlan from '../(plans)/GeneratePlan'

export default function YourPlans() {

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

          {/* saving is not a core feature detailed in ms2 */}
          <Text className="text-gray-500 text-lg font-bold text-center">
            Saving Plans coming soon!
          </Text>
          <Text className="text-gray-500 text-sm text-center">
            For now, generate a plan, and take a <Text className="font-semibold">screenshot</Text> to save it!
          </Text>

          </ScrollView>

          
          
    </SafeAreaView>
     
    
  )
}