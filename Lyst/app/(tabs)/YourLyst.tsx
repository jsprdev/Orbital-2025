import React, { useCallback, useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import AddIdea from '../(list)/AddIdea';
import SearchBar from '../(list)/SearchBar';
import Display from '../(list)/Display';
import { Priority, Note } from '@/types'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { getNotes } from '@/utils/api';

const DEFAULT_TAGS = ["Food", "Gifts", "Shopping", "Overseas", "Others"];

export default function YourLyst() {
  const [filters, setFilters] = useState<{
    query: string; selectedTags: string[]; priority: Priority | null;
  }>({ query: "", selectedTags: [], priority: null });

  const [refresh, setRefresh] = useState(false);

  const refreshPage = useCallback(() => {
    setRefresh(prev => !prev);
  }, []);

  const { user, token } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState(DEFAULT_TAGS);

  
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
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
  }, [token, refresh]);

  // pill availableTags whenever notes change
  useEffect(() => {
    const tagsInNotes = new Set(DEFAULT_TAGS);
    notes.forEach(note => {
      (note.tags || []).forEach(tag => tagsInNotes.add(tag));
    });
    setAvailableTags(Array.from(tagsInNotes));
  }, [notes]);

  const handleAddTag = (tag: string) => {
    tag = tag.trim();
    if (!tag) return;
    tag = tag.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (!availableTags.includes(tag)) {
      setAvailableTags(prev => [...prev, tag]);
    }
  };

  const handleFilterChange = (filter: { query: string; selectedTags: string[]; priority: Priority | null }) => {
    setFilters(filter);
    
    console.log("Query:", filter.query);
    console.log("Tags:", filter.selectedTags);
    console.log("Priority:", filter.priority);
  };

  return (

    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
      
      {/* top graphic */}
      <View className="py-4 mb-2.5 bg-white border-b border-gray-200 relative flex-col items-center px-4">
        <Image source={require('@/assets/images/testFood.png')} style={{ width: 280, height: 280, marginBottom: -15 }} resizeMode="contain" />
        
        <Text className="text-5xl shadow-xl2 font-extrabold text-gray-700 text-center mt-3">
          Welcome, {user?.displayName}
        </Text>
        <View>
          <AddIdea onSave={refreshPage} availableTags={availableTags} onAddTag={handleAddTag} />
        </View>
      </View>

      
      <View className="px-4">
        <SearchBar tags={availableTags} onFilterChange={handleFilterChange} />
      </View>

      
      <View className="flex-1 px-4 py-2">
        <Display filters={filters} notes={notes} setNotes={setNotes} loading={loading} key={refresh.toString()} />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}