import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWeatherForecast } from "@/utils/lyst.api";
import { createDatePlan } from "@/utils/datePlans.api";
import { useAuth } from "@/providers/AuthProvider";
import * as Calendar from "expo-calendar";
import DraggableFlatList, {
  NestableDraggableFlatList,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import SavePlanModal from "./SavePlanModal";
import Feather from "@expo/vector-icons/Feather";

const addToCalendar = async () => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Please give epxo permission to edit your calendars");
    return;
  }
  Calendar.createEventInCalendarAsync({});
};

export default function RouteReview() {
  const { routeData } = useLocalSearchParams();
  const { token } = useAuth();
  const initialRoute = routeData ? JSON.parse(routeData as string) : [];
  // initialRoute is basically the raw json response from the AI
  
  const getOrderedLocations = () => {
    if (!initialRoute.selectedLocations || !initialRoute.visitOrder) {
      console.log("Missing data, returning original locations");
      return initialRoute.selectedLocations || [];
    }
    
    const ordered = initialRoute.visitOrder.map((index: number) => initialRoute.selectedLocations[index]);
    
    return ordered;
  };
  
  const [data, setData] = useState(getOrderedLocations());
  const [weatherForecastForNextWeek, setWeatherForecastForNextWeek] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAINotes, setShowAINotes] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherForecast("Singapore");
        //console.log("Weather API response:", data);
        setWeatherForecastForNextWeek(data.forecast);
        console.log(weatherForecastForNextWeek)
      } catch (error) {
        console.error("failed to fetch weather forecast:", error);
        setWeatherForecastForNextWeek([]);
      }
    };
    fetchWeather();
  }, []);

  const handleSavePlan = async (title: string) => {
    if (!token) {
      Alert.alert("Error", "Please sign in to save plans");
      return;
    }

    if (!data || data.length === 0) {
      Alert.alert("Error", "No locations to save");
      return;
    }

    setSaving(true);
    try {
      const planData = {
        title: title,
        locations: data,
      };
      
      await createDatePlan(planData, token);
      Alert.alert("Success", "Plan saved successfully!");
      setShowSaveModal(false);
    } catch (error) {
      console.error("Error saving plan:", error);
      Alert.alert("Error", "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  
  const combinedData = [
    { type: 'header', id: 'header' },
    ...data.map((item: any, index: number) => ({ ...item, type: 'location', originalIndex: index })),
    ...(initialRoute.explanation ? [{ type: 'aiNotes', id: 'aiNotes' }] : []),
  
    { type: 'weather', id: 'weather' },

    { type: 'buttons', id: 'buttons' },
  ];

  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    if (item.type === 'header') {
      return (
        <View className="mb-4">
          <Text className="text-2xl font-bold">Review Your Date Route</Text>
          <Text className="text-lg text-gray-500 mb-3">
            Drag and drop to reorder
          </Text>
        </View>
      );
    }

    if (item.type === 'location') {
      return (
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          className={`mb-4 p-4 rounded-lg border border-gray-300 bg-white shadow ${isActive ? "bg-white/90 shadow-lg scale-105" : ""}`}
        >
          <Text className="font-bold text-lg mb-1">{item.name}</Text>
          <Text className="text-gray-600 mb-1">{item.address}</Text>
        </TouchableOpacity>
      );
    }

    // Ai explanation for the route to give more context, is a togglable dropdown
    if (item.type === 'aiNotes') {
      return (
        <View className="mb-4">
          <TouchableOpacity
            className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg"
            onPress={() => setShowAINotes(!showAINotes)}
          >
            <Text className="font-semibold text-gray-700">AI's Notes</Text>
            <Feather 
              name={showAINotes ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
          
          {showAINotes && (
            <View className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
              <Text className="text-gray-600 leading-5">
                {initialRoute.explanation}
              </Text>
            </View>
          )}
        </View>
      );
    }

    if (item.type === 'weather') {
      return (
        <View className="mb-4">
          <Text className="font-semibold text-xl mb-2">3-Day Weather Forecast</Text>
          <Text className="text-sm text-gray-500 mb-3">Data from WeatherAPI</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {Array.isArray(weatherForecastForNextWeek) && weatherForecastForNextWeek.map((item: any, index) => (
              <View key={index} className="mr-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm min-w-[120px]">
                <Text className="font-bold text-gray-800 text-center mb-2">{item.date}</Text>
                <Text className="text-center text-gray-600 mb-1">
                  {item.chance_of_rain}%
                </Text>
                <Text className="text-xs text-gray-500 text-center">
                  Chance of Rain
                </Text>
                <Text className="text-center text-gray-700 mt-2 text-sm" numberOfLines={2}>
                  {item.condition}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }

    if (item.type === 'buttons') {
      return (
        <View className="mb-6">
          <TouchableOpacity
            className="bg-green-500 p-4 rounded-lg mt-3 shadow-md"
            onPress={() => setShowSaveModal(true)}
          >
            <Text className="text-white text-center font-bold">
              Save to Plans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg mt-3 shadow-md"
            onPress={() => {
              // goes back to YourPlans
              router.push("/(tabs)/YourPlans");
            }}
          >
            <Text className="text-white text-center font-bold">
              Back to Your Plans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-lg bg-pink-500 mt-4 mb-2"
            onPress={addToCalendar}
          >
            <Text className="text-white text-center font-bold p-4">
              Add to Device Calendar
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const handleDragEnd = ({ data }: any) => {
    // EXTRACT ONLY the location items and update the state
    const locationItems = data.filter((item: any) => item.type === 'location');
    setData(locationItems);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <DraggableFlatList
        data={combinedData}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id || item.type + item.originalIndex}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <SavePlanModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSavePlan}
        saving={saving}
      />
    </SafeAreaView>
  );
}
