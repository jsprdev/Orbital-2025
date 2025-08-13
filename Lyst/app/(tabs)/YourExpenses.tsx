import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  getExpenseSections,
  createExpenseSection,
  updateExpenseSection,
  deleteExpenseSection,
  SectionType,
  ExpenseItemType,
} from "@/utils/expenses.api";
import DateSection from "../(expenses)/DateSection";


export default function YourExpenses() {
  const { token } = useAuth();
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getExpenseSections(token)
      .then((data) => setSections(data))
      .finally(() => setLoading(false));
  }, [token]);

  const addSection = async () => {
    if (!token) return;
    try {
      const newSection: SectionType = { title: "New Section", items: [] };
      const created = await createExpenseSection(newSection, token);
      setSections((prev) => [created, ...prev]);
    } catch (e) {
      console.error('Error adding section:', e);
    }
  };

  const addItemToSection = async (idx: number) => {
    if (!token) return;
    const section = sections[idx];
    const updatedSection = {
      ...section,
      items: [...section.items, { name: "", amount: "" }],
    };
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? updatedSection : s))
    );
    if (section.id) {
      await updateExpenseSection(section.id, updatedSection, token);
    }
  };

  const changeItemInSection = async (
    sectionIdx: number,
    itemIdx: number,
    updated: ExpenseItemType,
    newItems?: ExpenseItemType[]
  ): Promise<void> => {
    if (!token) return;
    const section = sections[sectionIdx];
    const updatedSection = {
      ...section,
      items: newItems ? newItems : section.items.map((item, j) => (j === itemIdx ? updated : item)),
    };
    setSections((prev) =>
      prev.map((s, i) => (i === sectionIdx ? updatedSection : s))
    );
    if (section.id) {
      await updateExpenseSection(section.id, updatedSection, token);
    }
  };

  const changeSectionTitle = async (sectionIdx: number, newTitle: string) => {
    if (!token) return;
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
      await updateExpenseSection(section.id, updatedSection, token);
    }
  };

  const handleDeleteSection = async (sectionIdx: number) => {
    if (!token) return;
    const section = sections[sectionIdx];
    if (section.id) {
      await deleteExpenseSection(section.id, token);
      setSections((prev) => prev.filter((_, i) => i !== sectionIdx));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
       <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 50 }}
        enableAutomaticScroll={true}
        extraHeight={150}
      >
        
        <View className="py-4 mb-2.5 bg-white relative flex-col items-center px-4">
          <Image
            source={require("../../assets/images/piggy.png")}
            style={{ width: 280, height: 280, marginBottom: -15 }}
            resizeMode="contain"
          />
          <Text className="text-5xl shadow-xl2 font-extrabold text-gray-700 text-center mt-3">
            Your Expenses
          </Text>
          <TouchableOpacity
            className="self-center p-20 py-2 rounded-xl items-center bg-pink-500 mt-4"
            onPress={addSection}
          >
            <Text className="text-white text-lg font-semibold">Add Expense</Text>
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
                onChangeItem={(itemIdx, updated, newItems) => changeItemInSection(idx, itemIdx, updated, newItems)}
                onChangeTitle={newTitle => changeSectionTitle(idx, newTitle)}
                onDelete={() => handleDeleteSection(idx)}
                prevTitle={section.title}
              />
            ))
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
} 