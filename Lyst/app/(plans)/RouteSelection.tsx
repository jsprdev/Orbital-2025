import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/providers/AuthProvider'
import { getNotes, generateDateRoute } from '@/utils/api'
import { Note } from '@/types'
import { router, usePathname } from 'expo-router'


export default function RouteSelection() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (!token) {
          Alert.alert("Authentication Error", "Please sign in again");
          return;
        }
        
        const fetchedNotes = await getNotes(token);
        setNotes(fetchedNotes);
      } catch (error: any) {
        console.error("Error fetching notes:", error);
        if (error.response?.status === 401) {
          Alert.alert("Authentication Error", "Please sign in again");
        } else {
          Alert.alert("Error", "Failed to load your saved ideas");
        }
      }
    };
    fetchNotes();
  }, [token]);

  
  const toggleNoteSelection = (note: Note) => {
    setSelectedNotes(prev => {
      // checks if the current state alr contains the note
      const isSelected = prev.some(n => n.id === note.id);
      if (isSelected) {
        // if is alr inside then filter it out by setting state to be every note that is not the same as the current note
        return prev.filter(n => n.id !== note.id);
      } else {
        return [...prev, note];
      }
    });
  };


  // generate date route
  const handleGenerateRoute = async () => {
    if (selectedNotes.length < 3) {
      Alert.alert("select at least 3 ideas to generate a date route");
      return;
    }

    
    try {
      if (!token) {
        Alert.alert("Authentication Error", "try sign in again");
        return;
      }

      // mapping the selected activities to the cards variable, to pass into the prompt
      const cards = selectedNotes.map(note => ({
        name: note.description,
        description: note.description,
        address: note.place || "No address",
        place_id: note.place_id,
        tags: note.tags || [],
        priority: note.priority,
        id: note.id
      }));

      console.log("Sending cards to API:", cards);
      const result = await generateDateRoute(cards, token);
      console.log("Received date route result:", result);

      router.push({
        pathname: '/(plans)/RouteReview',
        params: { routeData: JSON.stringify(result) }
      });

    } catch (error: any) {
      console.error("Error generating date route:", error);
      if (error.response?.status === 401) {
        Alert.alert("Authentication Error", "try sign in again");
      } else {
        Alert.alert("Error", "Failed to generate date route.");
      }
    } 
  };

  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">

            <View className="px-4 mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  Select Ideas
                </Text>
              
              </View>

              
              <ScrollView className="h-3/4">
                {notes.map((note) => {
                  const isSelected = selectedNotes.some(n => n.id === note.id);
                  return (
                    <TouchableOpacity
                      key={note.id}
                      onPress={() => toggleNoteSelection(note)}
                      className={`p-4 mb-3 rounded-lg border-2` }
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className={"font-bold text-lg"}>
                            {note.description}
                          </Text>
                          {note.place && (
                            <Text className="text-gray-600 mt-1">
                              {note.place}
                            </Text>
                          )}
                        </View>
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                          isSelected ? 'bg-green-500 border-green-500' : 'border-black-300'
                        }`}>
                          
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              
              <TouchableOpacity
                onPress={handleGenerateRoute}
                className="bg-pink-500 rounded-lg justify-center items-center"
                >
              
                  <Text className="font-bold text-lg text-white">
                    Generate Date Route
                  </Text>
                
              </TouchableOpacity>
              

            </View>

      </View>
    </SafeAreaView>
  );
} 