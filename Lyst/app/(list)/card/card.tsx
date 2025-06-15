import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Note } from "@/types";

type Props = {
  note: Note;
  onPress: (id: string) => void;
};

const priorityColor: Record<string, string> = {
  low: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-white",
  high: "bg-red-500 text-white",
};

export default function Card({ note, onPress }: Props) {
  const { id, description, priority, place, tags = [] } = note;

  return (
    <TouchableOpacity onPress={() => note.id && onPress(note.id)}>
      <View className="bg-white rounded-xl shadow p-4 mb-4">
        {/* Row 1: Description | Priority */}
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-base font-semibold flex-1">{description}</Text>
          <View className={`text-xs px-2 py-1 rounded-full ml-2 ${priorityColor[priority]}`} /> 
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 my-2" />

        {/* Row 2: Location | Tags */}
        <View className="flex-row justify-between items-end flex-wrap">
          <Text className="text-sm text-gray-600 max-w-[50%]">
            {place || ""}
          </Text>
          <View className="flex-row flex-wrap justify-end flex-1">
            {tags.map((tag) => (
              <Text
                key={tag}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full ml-1 mb-1"
              >
                {tag}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
