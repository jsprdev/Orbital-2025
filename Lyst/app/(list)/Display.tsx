import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH as auth } from "@/FirebaseConfig";
import { Priority, Note } from "@/types";
import Card from "./card/card";
import { getNotes, deleteNote } from "@/utils/lyst.api";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";

const priorityColor: Record<Priority, string> = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

type DisplayProps = {
  filters: { query: string; selectedTags: string[]; priority: Priority | null };
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  loading: boolean;
};

export default function Display({
  filters,
  notes,
  setNotes,
  loading,
}: DisplayProps) {
  const { token } = useAuth();
  const handlePress = (id: string) => {
    console.log("Card pressed:", id);
    router.push(`/(list)/location-details/${id}` as any);
  };
  const handleDelete = async (id: string) => {
    if (!token) {
      console.error("No token available for deletion");
      return;
    }
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    await deleteNote(id, token);
  };
  // filter notes
  function applyFilters(
    notes: Note[],
    filters: {
      query: string;
      selectedTags: string[];
      priority: Priority | null;
    }
  ) {
    return notes.filter((note) => {
      const matchesQuery = note.description
        .toLowerCase()
        .includes(filters.query.toLowerCase());
      const matchesTags =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.some((tag) => note.tags?.includes(tag));
      const matchesPriority =
        !filters.priority || note.priority === filters.priority;
      return matchesQuery && matchesTags && matchesPriority;
    });
  }
  const filteredNotes = applyFilters(notes, filters);
  // display latest notes on top by default
  const sortedNotes = filteredNotes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      {sortedNotes.map((note) => (
        <Card
          key={note.id}
          note={note}
          onPress={(id) => handlePress(id)}
          onDelete={() => handleDelete(note.id)}
        />
      ))}
    </View>
  );
}
