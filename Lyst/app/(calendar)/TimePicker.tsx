import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface TimeRangePickerProps {
  date: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

export default function TimePicker({
  date,
  onStartTimeChange,
  onEndTimeChange,
}: TimeRangePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Parse the incoming date string
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(startTime.getHours() + 1))
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      // Update both time fields with the new date
      const dateStr = selectedDate.toISOString().split("T")[0];
      onStartTimeChange(`${dateStr}T${formatTime(startTime)}`);
      onEndTimeChange(`${dateStr}T${formatTime(endTime)}`);
    }
  };

  const handleTimeChange = (type: "start" | "end", selectedTime?: Date) => {
    if (!selectedTime) return;

    const dateStr = selectedDate.toISOString().split("T")[0];

    if (type === "start") {
      setStartTime(selectedTime);
      const newEndTime = new Date(
        selectedTime.setHours(selectedTime.getHours() + 1)
      );
      setEndTime(newEndTime);
      onStartTimeChange(`${dateStr}T${formatTime(selectedTime)}`);
      onEndTimeChange(`${dateStr}T${formatTime(newEndTime)}`);
      setShowStartPicker(false);
    } else {
      setEndTime(selectedTime);
      onEndTimeChange(`${dateStr}T${formatTime(selectedTime)}`);
      setShowEndPicker(false);
    }
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:00`;
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View className="flex-col mb-4">
      {/* Date Picker Row */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker((prev) => !prev)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <Text>{formatDisplayDate(selectedDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Time Pickers Row */}
      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-gray-700 mb-1">Start Time</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker((prev) => !prev)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <Text>
              {startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              onChange={(_, time) => handleTimeChange("start", time)}
            />
          )}
        </View>

        <View className="flex-1 ml-2">
          <Text className="text-gray-700 mb-1">End Time</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker((prev) => !prev)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <Text>
              {endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              minimumDate={startTime}
              onChange={(_, time) => handleTimeChange("end", time)}
            />
          )}
        </View>
      </View>
    </View>
  );
}
