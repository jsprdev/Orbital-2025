import React, { useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';
import AddIdea from '../(list)/AddIdea';
import SearchBar from '../(list)/SearchBar';
import Display from '../(list)/Display';
import { Priority } from '@/types'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';


export default function YourLyst() {
  const [filters, setFilters] = useState<{
    query: string; selectedTags: string[]; priority: Priority | null;
  }>({ query: "", selectedTags: [], priority: null });

  const [refresh, setRefresh] = useState(false);

  const refreshPage = useCallback(() => {
    setRefresh(prev => !prev);
  }, []);

  const { user } = useAuth();

  // TODO: Replace this with your actual tags
  const availableTags = ["Food", "Gifts", "Shopping", "Overseas", "Others"];

  const handleFilterChange = (filter: { query: string; selectedTags: string[]; priority: Priority | null }) => {
    setFilters(filter);
    // Use these filters to modify the idea list you're rendering
    console.log("Query:", filter.query);
    console.log("Tags:", filter.selectedTags);
    console.log("Priority:", filter.priority);
  };

  return (

    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
      {/* Header with title and Add button */}
      <View className="py-4 mb-2.5 bg-white border-b border-gray-200 relative flex-col items-center px-4">
        <Image source={require('@/assets/images/testFood.png')} style={{ width: 280, height: 280, marginBottom: -15 }} resizeMode="contain" />
        {/* <Text className="text-2xl font-bold text-gray-700 absolute left-0 right-0 text-center">
          Your Lyst
        </Text> */}
        <Text className="text-5xl shadow-xl2 font-extrabold text-gray-700 text-center mt-3">
          Welcome, {user?.displayName}
        </Text>
        <View>
          <AddIdea onSave={refreshPage} />
        </View>
      </View>

      {/* Search bar and tag filter */}
      <View className="px-4">
        <SearchBar tags={availableTags} onFilterChange={handleFilterChange} />
      </View>

      {/* Main content area */}
      <View className="flex-1 px-4 py-2">
        <Display filters={filters} key={refresh.toString()} />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}