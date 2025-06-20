import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function AddIdeaButton({ handlePress }: { handlePress: () => void }) {

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="w-full self-center p-20 py-2 rounded-xl items-center bg-pink-500 mt-4"
      >
        {/* <FontAwesome6 name="add" size={24} color="red" /> */}
        {/* <Image
          source={require('../../assets/icons/add.png')}
          style={{
            width: 24,
            height: 24,
          }}
        /> */}
        <Text className="text-white text-lg font-bold">Add Idea</Text>
      </TouchableOpacity>
    </View>
  );
}