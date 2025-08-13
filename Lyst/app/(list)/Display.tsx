import React from "react";
import { View, Text } from "react-native";
import { Priority, Note } from "@/types";
import Card from "./card/card";
import { deleteNote } from "@/utils/lyst.api";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useNotes } from "@/providers/NotesProvider";

const priorityColor: Record<Priority, string> = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

type DisplayProps = {
  filters: { query: string; selectedTags: string[]; priority: Priority | null };
  loading: boolean;
};

export default function Display({ filters, loading }: DisplayProps) {
  const { token } = useAuth();
  const { notes, fetchNotes } = useNotes();

  const handlePress = (id: string) => {
    router.push(`/(list)/location-details/${id}` as any);
  };
  const handleDelete = async (id: string) => {
    if (!token) {
      console.error("No token available for deletion");
      return;
    }
    await deleteNote(id, token);
    await fetchNotes();
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
