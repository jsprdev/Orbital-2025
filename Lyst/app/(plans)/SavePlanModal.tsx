import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";

interface SavePlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  saving: boolean;
}

export default function SavePlanModal({ visible, onClose, onSave, saving }: SavePlanModalProps) {
  const [title, setTitle] = useState("");

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      setTitle("");
    }
  };

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={handleClose}
      />
      <View className="absolute inset-0 justify-center items-center px-6">
        <View className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
          <Text className="text-xl font-bold mb-4 text-center">Save Your Plan</Text>
          
          <Text className="text-gray-600 mb-2">Plan Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="Enter plan name..."
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-300 rounded-lg py-3"
              onPress={handleClose}
              disabled={saving}
            >
              <Text className="text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-green-500 rounded-lg py-3"
              onPress={handleSave}
              disabled={saving || !title.trim()}
            >
              <Text className="text-white text-center font-semibold">
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}