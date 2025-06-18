import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function AddIdeaButton({ handlePress }: { handlePress: () => void }) {

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="p-3 rounded-full items-center flex-row"
      >
        {/* <FontAwesome6 name="add" size={24} color="red" /> */}
        <Image
          source={require('../../assets/icons/add.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}