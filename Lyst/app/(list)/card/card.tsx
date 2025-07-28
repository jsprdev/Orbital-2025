import React from "react";
import { View, Text, Pressable } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Feather from "@expo/vector-icons/Feather";
import { Note } from "@/types";

type Props = {
  note: Note;
  onPress: (id: string) => void;
  onDelete: () => void;
};

const priorityColor: Record<string, string> = {
  low: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-white",
  high: "bg-red-500 text-white",
};

export default function Card({ note, onPress, onDelete }: Props) {
  const swipeRight = (progress: any, drag: any) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 60 }],
    }));

    return (
      <Pressable onPress={onDelete}>
        <Reanimated.View
          style={styleAnimation}
          className="bg-red-500 justify-center items-center w-16 h-[80%] pr-2 pb-3"
        >
          <Feather name="trash-2" size={30} color="white" />
        </Reanimated.View>
      </Pressable>
    );
  };

  const { id, description, priority, place, tags = [] } = note;

  return (
    <Reanimated.View
      entering={FadeIn.duration(300).springify()}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition}
    >
      <ReanimatedSwipeable
        key={note.id}
        friction={2}
        rightThreshold={40}
        renderRightActions={swipeRight}
        overshootRight={false}
        containerStyle={{
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <Pressable onPress={() => note.id && onPress(note.id)}>
          {({ pressed }) => (
            <View
              className="rounded-xl shadow-sm p-4 mb-4"
              style={{ backgroundColor: pressed ? "#f3f4f6" : "#fff" }}
            >
              <View className="flex-row justify-between items-start mb-1">
                <Text className="text-base font-semibold flex-1">
                  {description}
                </Text>
                <View
                  className={`text-xs px-2 py-1 rounded-full ml-2 ${priorityColor[priority]}`}
                />
              </View>

              {/* divider */}
              <View className="h-px bg-gray-200 my-2" />

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
          )}
        </Pressable>
      </ReanimatedSwipeable>
    </Reanimated.View>
  );
}
