import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH as auth } from "@/FirebaseConfig";
import { Priority, Note } from "@/types";
import Card from "./card/card";
import { getNotes, deleteNote } from "@/utils/lyst.api";
import { useAuth } from "@/providers/AuthProvider";

const priorityColor: Record<Priority, string> = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

export default function Display({
  filters,
}: {
  filters: { query: string; selectedTags: string[]; priority: Priority | null };
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);

  const { token } = useAuth();
  {
    /* Listen for authentication state changes */
  }
  {
    /* This is to allow the list to continue display even when user refreshes */
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserReady(true);
      } else {
        setUserReady(false);
        setNotes([]);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userReady || !token) {
      return;
    }

    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes(token);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [userReady, token]);

  const handlePress = (id: string) => {
    console.log("Card pressed:", id);
  };
  const handleDelete = async (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    await deleteNote(id, token!);
  };

  // Filter notes based on the provided filters
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

  if (!userReady || loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      {filteredNotes.map((note) => (
        <Card
          key={note.id}
          note={note}
          onPress={(id) => handlePress(id)}
          onDelete={() => handleDelete(note.id)}
        />
      ))}
    </ScrollView>
  );
}
