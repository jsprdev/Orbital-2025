import React from "react";
import {
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const ITEM_SPACING = 20;

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ImageCarousel({
  images,
  onDelete,
  flag,
}: {
  images: string[];
  onDelete: (index: number) => void;
  flag: string;
}) {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <Animated.FlatList
      data={images}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      pagingEnabled
      snapToInterval={ITEM_WIDTH + ITEM_SPACING}
      snapToAlignment="center"
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true },
      )}
      scrollEventThrottle={10}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 1) * (ITEM_WIDTH + ITEM_SPACING * 2),
          index * (ITEM_WIDTH + ITEM_SPACING * 2),
          (index + 1) * (ITEM_WIDTH + ITEM_SPACING * 2),
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1, 0.9],
          extrapolate: "clamp",
        });

        return (
          <AnimatedView
            className="mx-2 rounded-xl overflow-hidden"
            style={{
              width: ITEM_WIDTH,
              transform: [{ scale }],
            }}
          >
            <View
              className={`relative ${
                index === 0 && flag.trim() !== ""
                  ? "p-1 border-2 rounded-xl"
                  : ""
              }`}
            >
              <Image
                source={{ uri: item }}
                className="w-full h-72 rounded-xl"
                resizeMode="cover"
                testID="carousel-image"
              />
              {index === 0 && flag.trim() !== "" && (
                <Text className="absolute left-1/2 -translate-x-1/2 font-semibold mt-2 bg-white p-1 rounded-lg ">
                  Cover Page
                </Text>
              )}
              <TouchableOpacity
                onPress={() => onDelete(index)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-1 rounded-full shadow-lg"
                testID="carousel-delete-button"
              >
                <Feather name="x" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </AnimatedView>
        );
      }}
    />
  );
}
