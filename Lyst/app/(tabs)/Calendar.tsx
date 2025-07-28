import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { usePartner } from "@/providers/PartnerProvider";
import { useCalendar } from "@/providers/CalendarProvider";
import { Note } from "@/types";
import { CalendarEvent } from "@/types/calendar.dto";
import { formatTime, formatDate } from "@/utils/calendar.api";
import TimePicker from "@/app/(calendar)/TimePicker";
import { useNotes } from "@/providers/NotesProvider";

const CalendarScreen = () => {
  const { token } = useAuth();
  const { notes, fetchNotes } = useNotes();
  const { partnerUserId } = usePartner();
  const { events, createEvent, fetchEvents } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString()
  );
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const loadNotes = useCallback(async () => {
    if (!token) return;
    try {
      await fetchNotes();
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [token, partnerUserId]);

  useEffect(() => {
    fetchEvents();
    loadNotes();
  }, [fetchEvents, loadNotes]);

  const handleCreateEvent = async () => {
    if (!token) return;
    if (!title || !selectedNote) {
      Alert.alert("Please enter a title or select a note.");
      return;
    }
    const newEvent: CalendarEvent = {
      title: title || selectedNote?.description || "Untitled",
      location: location || selectedNote?.place || "",
      noteId: selectedNote?.id,
      startTime: startTime || selectedDate,
      endTime: endTime || selectedDate,
      userId: "",
      createdAt: new Date(),
    };

    await createEvent(newEvent);
    setShowModal(false);
    setSelectedNote(null);
    setTitle("");
    setLocation("");
    setStartTime("");
    setEndTime("");
  };

  const eventsForSelectedDate = events.filter((e) =>
    e.startTime.startsWith(selectedDate.split("T")[0])
  );

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};

    marked[selectedDate.split("T")[0]] = {
      selected: true,
      selectedColor: "#F6339A",
      selectedTextColor: "white",
    };

    events.forEach((event) => {
      const date = event.startTime.split("T")[0];
      if (!marked[date]) {
        marked[date] = {
          dots: [
            {
              key: date,
              color: "#F6339A",
              selectedDotColor: "white",
            },
          ],
        };
      }
    });

    return marked;
  };

  const handleEventCardPress = (eventId: string) => {
    router.push(`/(calendar)/${eventId}` as any);
  };

  // Modal Config
  const [showModal, setShowModal] = useState(false);
  const { height } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(height)).current;

  const openDrawer = () => {
    setShowModal(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowModal(false);
      setSelectedNote(null);
      setTitle("");
      setLocation("");
      setStartTime("");
      setEndTime("");
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-2 ml-2 mr-2">
        <Text className="text-2xl font-bold text-gray-700">Calendar</Text>
        <TouchableOpacity onPress={() => openDrawer()}>
          <Feather name="plus" size={24} color="#F6339A" />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View className="mx-2">
        <Calendar
          theme={{
            calendarBackground: "#fff",
            selectedDayBackgroundColor: "#F6339A",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#F6339A",
            dayTextColor: "#2d3748",
            textDisabledColor: "#d1d5db",
            arrowColor: "#F6339A",
          }}
          markedDates={getMarkedDates()}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markingType="multi-dot"
        />
      </View>

      <View className="border-b border-gray-200 mt-2 ml-6 mr-8" />

      {/* Events List */}
      <View className="ml-6 mr-6 mt-4 flex-1">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Events on {formatDate(selectedDate.split("T")[0])}
        </Text>
        {eventsForSelectedDate.length === 0 ? (
          <Text className="text-gray-500">No events yet.</Text>
        ) : (
          <FlatList
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            data={eventsForSelectedDate}
            keyExtractor={(item) => item.id ?? ""}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mb-2 p-4 bg-gray-100 rounded-lg flex-row justify-between items-center"
                onPress={() => handleEventCardPress(item.id!)}
              >
                <View className="flex-1">
                  <Text
                    className="text-gray-800 font-bold"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  {item.location && (
                    <Text
                      className="text-gray-600"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.location}
                    </Text>
                  )}
                </View>

                <View className="ml-4 items-end">
                  <Text className="text-gray-700 font-medium">
                    {formatTime(item.startTime)}
                  </Text>
                  {item.endTime && (
                    <Text className="text-gray-500 text-sm">
                      {formatTime(item.endTime)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Modal */}
      <Modal transparent visible={showModal} animationType="none">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={closeDrawer}
        />

        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: height * 0.8,
            top: slideAnim,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            overflow: "hidden",
          }}
        >
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

          <Text className="text-xl font-bold mb-4">Add New Event</Text>

          <View className="mb-4">
            {!selectedNote && (
              <>
                <TextInput
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                  className="border border-gray-300 rounded-lg p-2 mb-2"
                />
                <TextInput
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                  className="border border-gray-300 rounded-lg p-2 mb-4"
                />
              </>
            )}

            <TimePicker
              date={selectedDate.split("T")[0]}
              onStartTimeChange={(time) => setStartTime(time)}
              onEndTimeChange={(time) => setEndTime(time)}
            />

            {notes.length > 0 && (
              <View className="mt-2">
                <Text className="text-sm text-gray-600 mb-2">
                  Or pick from your lyst:
                </Text>

                <View className="bg-white border border-gray-200 rounded-lg ">
                  <ScrollView
                    style={{ maxHeight: 200 }}
                    nestedScrollEnabled={true}
                  >
                    {notes.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        className={`py-3 px-3 flex-row items-center ${
                          selectedNote?.id === item.id ? "bg-pink-50" : ""
                        } ${
                          item !== notes[notes.length - 1]
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                        onPress={() => {
                          if (selectedNote?.id === item.id) {
                            setSelectedNote(null);
                            setTitle("");
                            setLocation("");
                          } else {
                            setSelectedNote(item);
                            setTitle(item.description);
                            setLocation(item.place || "");
                          }
                        }}
                      >
                        {/* Note */}
                        <View className="flex-1">
                          <Text
                            className={`font-medium ${
                              selectedNote?.id === item.id
                                ? "text-pink-600"
                                : "text-gray-800"
                            }`}
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                          {item.place && (
                            <Text
                              className="text-gray-500 text-xs mt-0.5"
                              numberOfLines={1}
                            >
                              {item.place}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            <View className="flex-row justify-between mt-8">
              <TouchableOpacity
                className="bg-gray-200 px-4 py-2 rounded-lg"
                onPress={() => {
                  setShowModal(false);
                  setSelectedNote(null);
                  setTitle("");
                  setLocation("");
                  setStartTime("");
                  setEndTime("");
                }}
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-500 px-4 py-2 rounded-lg"
                onPress={handleCreateEvent}
              >
                <Text className="text-white">Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default CalendarScreen;
