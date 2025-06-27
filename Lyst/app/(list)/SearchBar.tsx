import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Priority } from "@/types"; 

type Props = {
  tags: string[];
  onFilterChange: (filter: {
    query: string;
    selectedTags: string[];
    priority: Priority | null;
  }) => void;
};

export default function SearchBarWithTags({ tags, onFilterChange }: Props) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priority, setPriority] = useState<Priority | null>(null);

  // pass the changed fields to the parent component
  const emit = (query: string, selectedTags: string[], priority: Priority | null) => {
    onFilterChange({ query, selectedTags, priority });
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    emit(text, selectedTags, priority);
  };

  const clearQuery = () => {
    setQuery("");
    emit("", selectedTags, priority);
  };

  
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
    emit(query, selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag], priority);
  };

  
  const cyclePriority = () => {
    const next: Priority | null =
      priority === null
        ? "low"
        : priority === "low"
        ? "medium"
        : priority === "medium"
        ? "high"
        : null;
    setPriority(next);
    emit(query, selectedTags, next);
  };

  return (
    <View className="mb-4">

      
      <View className="flex-row items-center border border-gray-300 rounded px-3">
        <TextInput
          placeholder="Search ideas..."
          className="flex-1 py-2"
          value={query}
          onChangeText={handleQueryChange}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearQuery} className="mr-2">
            <Feather name="x" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setShowFilters((v) => !v)}>
          <Image
              source={require('../../assets/icons/filter.png')}  
              className="w-6 h-6"            
          />
        </TouchableOpacity>
      </View>

      
      {showFilters && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-2">

          
          <View>
            <TouchableOpacity onPress={cyclePriority} className={`mr-2 px-3 py-1 rounded-full border ${ 
              priority
                ? priority === "low"
                  ? "bg-green-500 border-green-400"
                  : priority === "medium"
                  ? "bg-yellow-500 border-yellow-400"
                  : "bg-red-500 border-red-400"
                : "border-gray-400"
            }`}>

              <Text className={`${ priority ? "text-white font-semibold" : "text-gray-800"}`} >
                {priority ? `Priority: ${priority}` : "Priority"}
              </Text>

            </TouchableOpacity>
          </View>

            {/* tag */}
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity key={tag} onPress={() => toggleTag(tag)}
                  className={ `mr-2 px-3 py-1 rounded-full border ${
                    isSelected 
                      ? "bg-blue-400 border-blue-500" 
                      : "border-gray-400"
                  }` }
                >
                  <Text className={ isSelected ? "text-white" : "text-gray-800" }>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
}
