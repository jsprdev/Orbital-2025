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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    const initialDate = new Date(dateString);
    setSelectedDate(initialDate);

    const start = new Date(initialDate);
    start.setHours(9, 0, 0, 0);

    const end = new Date(initialDate);
    end.setHours(10, 0, 0, 0);

    setStartTime(start);
    setEndTime(end);

    onStartTimeChange(formatDateTime(start));
    onEndTimeChange(formatDateTime(end));
  }, [dateString]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === "ios"); 

    const newStart = new Date(currentDate);
    newStart.setHours(startTime.getHours(), startTime.getMinutes());

    const newEnd = new Date(currentDate);
    newEnd.setHours(endTime.getHours(), endTime.getMinutes());

    setSelectedDate(currentDate);
    setStartTime(newStart);
    setEndTime(newEnd);

    onStartTimeChange(formatDateTime(newStart));
    onEndTimeChange(formatDateTime(newEnd));
  };

  const handleTimeChange = (type: "start" | "end", selectedTime?: Date) => {
    if (!selectedTime) return;

    if (type === "start") {
      const newStart = selectedTime;
      setStartTime(newStart);
      onStartTimeChange(formatDateTime(newStart));

      // ensure correct end time
      if (newStart >= endTime) {
        const newEnd = new Date(newStart);
        newEnd.setHours(newStart.getHours() + 1);
        setEndTime(newEnd);
        onEndTimeChange(formatDateTime(newEnd));
      }
    } else {
      const newEnd =
        selectedTime < startTime
          ? new Date(startTime.getTime() + 3600000) // +1 hour if time is invalid
          : selectedTime;

      setEndTime(newEnd);
      onEndTimeChange(formatDateTime(newEnd));
    }

    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
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
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <Text>{formatDisplayDate(selectedDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-gray-700 mb-1">Start Time</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <Text>
              {startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {(showStartPicker || Platform.OS === "ios") && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, time) => handleTimeChange("start", time)}
            />
          )}
        </View>

        <View className="flex-1 ml-2">
          <Text className="text-gray-700 mb-1">End Time</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <Text>
              {endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {(showEndPicker || Platform.OS === "ios") && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={startTime}
              onChange={(_, time) => handleTimeChange("end", time)}
            />
          )}
        </View>
      </View>
    </View>
  );
}
