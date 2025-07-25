import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ExpenseItemType } from '@/utils/expenses.api';

export default function ExpenseItem({ item, onChange, onDelete }: {
  item: ExpenseItemType;
  onChange: (item: ExpenseItemType) => void;
  onDelete: () => void;
}) {
  const handleAmountChange = (text: string) => {
    let value = text.replace(/[^\d.]/g, "");
    if (value.startsWith(".")) value = "0" + value;
    if (value) value = "$" + value;
    else value = "";
    onChange({ ...item, amount: value });
  };
  return (
    <View className="flex-row items-center mb-2">
      <TextInput
        className="flex-1 border border-gray-300 rounded-lg px-2 py-1 mr-2"
        placeholder="Item name"
        value={item.name}
        onChangeText={text => onChange({ ...item, name: text })}
      />
      <TextInput
        className="w-20 border border-gray-300 rounded-lg px-2 py-1 mr-2"
        placeholder="$0.00"
        keyboardType="numeric"
        value={item.amount}
        onChangeText={handleAmountChange}
      />
      <TouchableOpacity onPress={onDelete} className="p-1">
        <Feather name="trash-2" size={20} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
}