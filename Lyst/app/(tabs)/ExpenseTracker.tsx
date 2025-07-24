import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "@/providers/AuthProvider";
import {
  getExpenseSections,
  createExpenseSection,
  updateExpenseSection,
  deleteExpenseSection,
  SectionType,
  ExpenseItemType,
} from "@/utils/expenses.api";
import { useEffect } from "react";
import { Feather } from "@expo/vector-icons";


const centralImage = require("../../assets/images/piggy.png");

function ExpenseItem({ item, onChange }: { item: ExpenseItemType; onChange: (item: ExpenseItemType) => void }) {
  return (
    <View className="flex-row items-center mb-2">
      <TextInput
        className="flex-1 border border-gray-300 rounded-lg px-2 py-1 mr-2"
        placeholder="Item name"
        value={item.name}
        onChangeText={text => onChange({ ...item, name: text })}
      />
      <TextInput
        className="w-20 border border-gray-300 rounded-lg px-2 py-1"
        placeholder="$0.00"
        keyboardType="numeric"
        value={item.amount}
        onChangeText={text => onChange({ ...item, amount: text })}
      />
    </View>
  );
}

function DateSection({ title, items, onAddItem, onChangeItem, onChangeTitle, onDelete, prevTitle }: {
  title: string;
  items: ExpenseItemType[];
  onAddItem: () => void;
  onChangeItem: (itemIdx: number, updated: ExpenseItemType) => void;
  onChangeTitle: (newTitle: string) => void;
  onDelete: () => void;
  prevTitle: string;
}) {

  const [localTitle, setLocalTitle] = React.useState(title);
  React.useEffect(() => { setLocalTitle(title); }, [title]);

  const handleBlur = () => {
    if (!localTitle.trim()) {
      Alert.alert("Section name cannot be empty.");
      setLocalTitle(prevTitle || "New Section");
      onChangeTitle(prevTitle || "New Section");
    } else {
      onChangeTitle(localTitle);
    }
  };

  return (
    <View className="mb-6 p-4 bg-gray-100 rounded-xl">
      <View className="flex-row items-center mb-2">
        <TextInput
          className="flex-1 text-xl font-bold bg-white px-2 py-1 rounded-lg border border-pink-500"
          value={localTitle}
          onChangeText={setLocalTitle}
          onBlur={handleBlur}
          placeholder="Enter a name..."
        />
        <TouchableOpacity onPress={onDelete} className="ml-2 p-1">
          <Feather name="trash-2" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
      {items.map((item, idx) => (
        <ExpenseItem
          key={idx}
          item={item}
          onChange={updated => onChangeItem(idx, updated)}
        />
      ))}
      <TouchableOpacity
        className="mt-2 bg-pink-500 py-2 px-4 rounded-lg items-center"
        onPress={onAddItem}
      >
        <Text className="text-white font-semibold">+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ExpenseTracker() {
  const { user } = useAuth();
  const userId = user?.uid;
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getExpenseSections(userId)
      .then((data) => setSections(data))
      .finally(() => setLoading(false));
  }, [userId]);

  const addSection = async () => {
    console.log('Add Section clicked, userId:', userId);
    if (!userId) {
      console.warn('No userId, cannot add section');
      return;
    }
    try {
      const newSection: SectionType = { title: "New Section", items: [] };
      const created = await createExpenseSection(userId, newSection);
      setSections((prev) => [created, ...prev]);
      console.log('Section added:', created);
    } catch (e) {
      console.error('Error adding section:', e);
    }
  };

  const addItemToSection = async (idx: number) => {
    if (!userId) return;
    const section = sections[idx];
    const updatedSection = {
      ...section,
      items: [...section.items, { name: "", amount: "" }],
    };
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? updatedSection : s))
    );
    if (section.id) {
      await updateExpenseSection(userId, section.id, updatedSection);
    }
  };

  const changeItemInSection = async (
    sectionIdx: number,
    itemIdx: number,
    updated: ExpenseItemType
  ) => {
    if (!userId) return;
    const section = sections[sectionIdx];
    const updatedSection = {
      ...section,
      items: section.items.map((item, j) => (j === itemIdx ? updated : item)),
    };
    setSections((prev) =>
      prev.map((s, i) => (i === sectionIdx ? updatedSection : s))
    );
    if (section.id) {
      await updateExpenseSection(userId, section.id, updatedSection);
    }
  };

  const changeSectionTitle = async (sectionIdx: number, newTitle: string) => {
    if (!userId) return;
    if (!newTitle.trim()) {
      Alert.alert("Section name cannot be empty.");
      return;
    }
    const section = sections[sectionIdx];
    const updatedSection = { ...section, title: newTitle };
    setSections((prev) =>
      prev.map((s, i) => (i === sectionIdx ? updatedSection : s))
    );
    if (section.id) {
      await updateExpenseSection(userId, section.id, updatedSection);
    }
  };

  const handleDeleteSection = async (sectionIdx: number) => {
    if (!userId) return;
    const section = sections[sectionIdx];
    if (section.id) {
      await deleteExpenseSection(userId, section.id);
      setSections((prev) => prev.filter((_, i) => i !== sectionIdx));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        
        <View className="py-4 mb-2.5 bg-white relative flex-col items-center px-4">
          <Image
            source={centralImage}
            style={{ width: 280, height: 280, marginBottom: -15 }}
            resizeMode="contain"
          />
          <Text className="text-5xl shadow-xl2 font-extrabold text-gray-700 text-center mt-3">
            Expense Tracker
          </Text>
          <TouchableOpacity
            className="mt-4 bg-pink-500 py-3 px-6 rounded-lg items-center"
            onPress={addSection}
          >
            <Text className="text-white text-lg font-semibold">+ Add Section (Date)</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4">
          {loading ? (
            <Text className="text-gray-400 text-center mt-8">Loading...</Text>
          ) : sections.length === 0 ? (
            <Text className="text-gray-400 text-center mt-8">No expense dates yet. Add one!</Text>
          ) : (
            sections.map((section, idx) => (
              <DateSection
                key={section.id || idx}
                title={section.title}
                items={section.items}
                onAddItem={() => addItemToSection(idx)}
                onChangeItem={(itemIdx, updated) => changeItemInSection(idx, itemIdx, updated)}
                onChangeTitle={newTitle => changeSectionTitle(idx, newTitle)}
                onDelete={() => handleDeleteSection(idx)}
                prevTitle={section.title}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 