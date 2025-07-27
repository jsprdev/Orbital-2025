import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCalendar } from "@/providers/CalendarProvider";
import { formatTime, formatDate } from "@/utils/calendar.api";
import { CalendarEvent } from "@/types/calendar.dto";
import Feather from "@expo/vector-icons/Feather";

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, deleteEvent } = useCalendar();
  const [event, setEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const event = events.find((e) => e.id === id);
    setEvent(event ?? null);
  }, [events, id]);

  const handleDelete = () => {
    Alert.alert("Delete Event", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (id) {
            await deleteEvent(id);
            router.back();
          }
        },
      },
    ]);
  };

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Event not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative flex-row justify-center items-center p-4 pt-12 mt-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 mt-7 pl-4"
        >
          <Feather name="arrow-left" size={28} color="hotpink" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold">Event Details</Text>
      </View>

      <View className="px-6 py-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          {event.title}
        </Text>
        {event.location ? (
          <Text className="text-lg text-gray-600 mb-4">{event.location}</Text>
        ) : null}

        <View className="mb-6">
          <Text className="text-gray-500 mb-1">Start</Text>
          <Text className="text-base text-gray-800">
            {formatDate(event.startTime)} at {formatTime(event.startTime)}
          </Text>

          {event.endTime && (
            <>
              <Text className="text-gray-500 mt-4 mb-1">End</Text>
              <Text className="text-base text-gray-800">
                {formatDate(event.endTime)} at {formatTime(event.endTime)}
              </Text>
            </>
          )}
        </View>
        
        {/* Delete */}
        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EventDetailScreen;
