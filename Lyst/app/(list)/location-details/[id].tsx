import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { Note } from "@/types";
import { getNotes } from "@/utils/api";
import { useAuth } from "@/providers/AuthProvider";

export default function LocationDetails() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      const notes = await getNotes(token);
      setNote(notes.find((n: Note) => n.id === id));
    };
    fetchNote();
  }, [id]);

  if (!note) return <Text>Loading...</Text>;

  return (
    <View>
      
      <Text>Location: {note.place}</Text>
      
    </View>
  );
}