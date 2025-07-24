import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Note } from '@/types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

interface DateRouteResult {
  selectedLocations: Note[];
  visitOrder: number[];
}

interface DraggableRouteCardProps {
  route: DateRouteResult;
  onRouteChange: (newRoute: DateRouteResult) => void;
}

interface DraggableStopProps {
  location: Note;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  isDragging: boolean;
}

const DraggableStop: React.FC<DraggableStopProps> = ({ location, index, onMove, isDragging }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.05);
    },
    onActive: (event) => {
      translateY.value = event.translationY;
    },
    onEnd: () => {
      scale.value = withSpring(1);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: isDragging ? 1000 : 1,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <View className={`bg-white border-2 rounded-lg p-4 mb-3 ${
          isDragging ? 'border-pink-500 shadow-lg' : 'border-gray-200'
        }`}>
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-pink-500 rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold">{index + 1}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {location.description}
              </Text>
              {location.place && (
                <Text className="text-gray-600 mt-1">
                  📍 {location.place}
                </Text>
              )}
            </View>
            <View className="w-6 h-6 items-center justify-center">
              <Text className="text-gray-400">⋮⋮</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const DraggableRouteCard: React.FC<DraggableRouteCardProps> = ({ route, onRouteChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Debug logging
  console.log("DraggableRouteCard received route:", route);
  console.log("Selected locations:", route.selectedLocations);
  console.log("Visit order:", route.visitOrder);

  const moveStop = (fromIndex: number, toIndex: number) => {
    const newVisitOrder = [...route.visitOrder];
    const [movedItem] = newVisitOrder.splice(fromIndex, 1);
    newVisitOrder.splice(toIndex, 0, movedItem);
    
    const newRoute: DateRouteResult = {
      ...route,
      visitOrder: newVisitOrder,
    };
    
    onRouteChange(newRoute);
  };

  return (
    <View className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4">
      {/* Debug info */}
      <View className="bg-blue-50 p-2 rounded mb-3">
        <Text className="text-blue-800 text-xs">
          Debug: {route.selectedLocations.length} locations, {route.visitOrder.length} stops
        </Text>
      </View>

      {route.visitOrder.map((locationIndex, stepIndex) => {
        const location = route.selectedLocations[locationIndex];
        console.log(`Rendering stop ${stepIndex}:`, location);
        
        if (!location) {
          console.warn(`No location found for index ${locationIndex}`);
          return (
            <View key={`error-${stepIndex}`} className="bg-red-100 p-4 mb-3 rounded-lg">
              <Text className="text-red-800">Error: No location data for index {locationIndex}</Text>
            </View>
          );
        }

        return (
          <DraggableStop
            key={`${location.id}-${stepIndex}`}
            location={location}
            index={stepIndex}
            onMove={moveStop}
            isDragging={isDragging}
          />
        );
      })}
      
      <View className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <Text className="text-gray-600 text-center text-sm">
          💡 Drag and drop the cards above to reorder your route
        </Text>
      </View>
    </View>
  );
};

export default DraggableRouteCard; 