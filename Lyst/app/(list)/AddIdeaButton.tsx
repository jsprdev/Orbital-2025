import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function AddIdeaButton({ handlePress }: { handlePress: () => void }) {

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="p-3 rounded-full items-center flex-row"
      >
        <FontAwesome6 name="add" size={24} color="pink" />
      </TouchableOpacity>
    </View>
  );
}