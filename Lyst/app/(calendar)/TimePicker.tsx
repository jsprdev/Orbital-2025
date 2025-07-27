import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimeRangePickerProps {
  date: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

export const TimePicker = ({ 
  date, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimeRangePickerProps) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(startTime.getHours() + 1)));

  const handleTimeChange = (type: 'start' | 'end', selectedTime?: Date) => {
    if (!selectedTime) return;

    if (type === 'start') {
      setStartTime(selectedTime);
      setEndTime(new Date(selectedTime.setHours(selectedTime.getHours() + 1)));
      onStartTimeChange(`${date}T${formatTime(selectedTime)}`);
      onEndTimeChange(`${date}T${formatTime(new Date(selectedTime.setHours(selectedTime.getHours() + 1)))}`);
      setShowStartPicker(false);
    } else {
      setEndTime(selectedTime);
      onEndTimeChange(`${date}T${formatTime(selectedTime)}`);
      setShowEndPicker(false);
    }
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;
  };

  return (
    <View className="flex-row justify-between mb-4">
      <View className="flex-1 mr-2">
        <Text className="text-gray-700 mb-1">Start Time</Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <Text>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            onChange={(_, time) => handleTimeChange('start', time)}
          />
        )}
      </View>

      <View className="flex-1 ml-2">
        <Text className="text-gray-700 mb-1">End Time</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <Text>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            minimumDate={startTime}
            onChange={(_, time) => handleTimeChange('end', time)}
          />
        )}
      </View>
    </View>
  );
};