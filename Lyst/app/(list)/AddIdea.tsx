import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AddIdeaButton from "./AddIdeaButton";
import { Note, Priority } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useNotes } from "@/providers/NotesProvider";

const { height } = Dimensions.get("window");

const priorityColor: Record<string, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export default function AddIdea({
  onSave,
  availableTags = [],
  onAddTag,
}: {
  onSave?: () => void;
  availableTags?: string[];
  onAddTag?: (tag: string) => void;
}) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [visible, setVisible] = useState(false);
  const { token } = useAuth();
  const { createNote } = useNotes();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [place_id, setPlaceId] = useState(""); // different naming here cos google api lmao
  const [about, setAbout] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCustomTag, setShowCustomTag] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [priority, setPriority] = useState<Priority>("low");
  const [placeInput, setPlaceInput] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const openDrawer = () => {
    setVisible(true);
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
      setVisible(false);
      setDescription("");
      setLocation("");
      setCustomTag("");
      setSelectedTags([]);
      setPriority("low");
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // formatNewTag helper function
  const formatNewTag = (str: string) => {
    str = str.trim();
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // add custom tag
  const addTag = (tag: string) => {
    tag = formatNewTag(tag);
    if (!tag) return;
    if (availableTags && !availableTags.includes(tag)) {
      if (onAddTag) onAddTag(tag);
      setSelectedTags((prev) => [...prev, tag]);
    } else if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setCustomTag("");
  };

  // for searching through saved ideas
  const fetchPlaceSuggestions = async (input: string) => {
    if (!input) {
      setPlaceSuggestions([]);
      return;
    }
    setLoadingPlaces(true);
    try {
      const res = await fetch(
        `http://${process.env.EXPO_PUBLIC_HOST}:${process.env.EXPO_PUBLIC_PORT}/api/places?input=${encodeURIComponent(input)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPlaceSuggestions(data.predictions || []);
    } catch (e) {
      console.error('Autocomplete error:', e);
      setPlaceSuggestions([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const onSavingPage = async () => {
    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }
    if (selectedTags.length === 0) {
      alert("Please select at least one tag.");
      return;
    }
    if (!priority) {
      alert("Please select a priority.");
      return;
    }

    // backend logic to save the idea
    try {
      await createNote(
        {
          description: description,
          tags: selectedTags,
          place: location,
          about,
          place_id: place_id,
          priority: priority,
          createdAt: new Date().toISOString(),
          userId: "",
        } as Note
      );

      // refresh page
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      closeDrawer();
    }
  };

  return (
    <>
      <AddIdeaButton handlePress={openDrawer} />

      <Modal transparent visible={visible} animationType="none">
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

          <Text className="text-xl font-bold mb-4">Add New Idea</Text>

          <Text className="font-semibold mb-1">Place</Text>
          <View className="mb-4" style={{ zIndex: 1000 }}>
            <TextInput
              className="border border-gray-300 rounded p-2 mb-1"
              placeholder="Search location"
              value={placeInput}
              onChangeText={(text) => {
                setPlaceInput(text);
                fetchPlaceSuggestions(text);
              }}
            />
            {loadingPlaces && (
              <ActivityIndicator
                size="small"
                color="#22c55e"
                style={{ marginVertical: 4 }}
              />
            )}
            {placeSuggestions.length > 0 && (
              <FlatList
                data={placeSuggestions}
                keyExtractor={(item) => item.place_id}
                style={{
                  maxHeight: 150,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 6,
                  marginTop: 2,
                  zIndex: 1000,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setLocation(item.description);
                      setPlaceId(item.place_id);
                      setPlaceInput(item.description);
                      setPlaceSuggestions([]);
                    }}
                    style={{ padding: 10 }}
                  >
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, marginTop: 10 }}
          >
            <Text className="font-semibold mb-1">Description</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 mb-4"
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text className="font-semibold mb-1">Tags</Text>
            <View className="flex-row flex-wrap mb-2">
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  className={`border rounded-full px-3 py-1 m-1 ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600"
                      : "border-gray-400"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedTags.includes(tag)
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setShowCustomTag((prev) => !prev)}
                className="border border-gray-400 rounded-full px-3 py-1 m-1"
              >
                <Text className="text-gray-700 text-sm">▼</Text>
              </TouchableOpacity>
            </View>

            {showCustomTag && (
              <View className="flex-row items-center mb-4">
                <TextInput
                  className="flex-1 border border-gray-300 rounded p-2 mr-2"
                  placeholder="Add custom tag"
                  value={customTag}
                  onChangeText={setCustomTag}
                  onSubmitEditing={() => addTag(customTag.trim())}
                />
                <TouchableOpacity
                  onPress={() => addTag(customTag.trim())}
                  className="bg-blue-600 rounded px-3 py-2"
                >
                  <Text className="text-white font-semibold">Add</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <Text className="font-semibold mb-1">Priority</Text>
            <View className="flex-row justify-between mb-4">
              {(["low", "medium", "high"] as Priority[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setPriority(level)}
                  className={`flex-1 mx-1 rounded-full px-4 py-2 items-center ${
                    priority === level ? priorityColor[level] : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`font-semibold capitalize ${
                      priority === level ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* save */}
            <TouchableOpacity
              onPress={onSavingPage}
              className="bg-blue-600 rounded py-3 items-center"
            >
              <Text className="text-white font-bold text-lg">Save Idea</Text>
            </TouchableOpacity>

            {/* close */}
            <TouchableOpacity
              onPress={closeDrawer}
              className="mt-3 bg-gray-300 rounded py-2 items-center"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Modal>
    </>
  );
}
