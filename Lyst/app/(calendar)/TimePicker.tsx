import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface TimeRangePickerProps {
  date: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

export default function TimePicker({
  date: dateString,
  onStartTimeChange,
  onEndTimeChange,
}: TimeRangePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Use useEffect to initialize dates when dateString changes
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    const initialDate = new Date(dateString);
    setSelectedDate(initialDate);

    // Initialize start and end times to the beginning and end of the day
    const startOfDay = new Date(initialDate);
    startOfDay.setHours(9, 0, 0, 0); // Set to 9:00 AM

    const endOfDay = new Date(initialDate);
    endOfDay.setHours(10, 0, 0, 0); // Set to 10:00 AM

    setStartTime(startOfDay);
    setEndTime(endOfDay);

    // Notify parent components
    onStartTimeChange(formatDateTime(startOfDay));
    onEndTimeChange(formatDateTime(endOfDay));
  }, [dateString]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);

      // Preserve the time
      const newStartTime = new Date(selectedDate);
      newStartTime.setHours(startTime.getHours(), startTime.getMinutes());

      const newEndTime = new Date(selectedDate);
      newEndTime.setHours(endTime.getHours(), endTime.getMinutes());

      setStartTime(newStartTime);
      setEndTime(newEndTime);

      onStartTimeChange(formatDateTime(newStartTime));
      onEndTimeChange(formatDateTime(newEndTime));
    }
  };

  const handleTimeChange = (type: "start" | "end", selectedTime?: Date) => {
    if (!selectedTime) return;

    if (type === "start") {
      setStartTime(selectedTime);
      onStartTimeChange(formatDateTime(selectedTime));
    } else {
      setEndTime(selectedTime);
      onEndTimeChange(formatDateTime(selectedTime));
    }
  };

  const formatDateTime = (date: Date) => {
    const isoString = date.toISOString();
    return isoString.slice(0, 19).replace("T", " ");
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