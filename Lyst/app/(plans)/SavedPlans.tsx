import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { getDatePlans, deleteDatePlan, updateDatePlanStatus } from "@/utils/datePlans.api";
import { DatePlan } from "@/types";
import Feather from "@expo/vector-icons/Feather";

export default function SavedPlans() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<DatePlan[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchPlans = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const data = await getDatePlans(token);
      setPlans(data);
    } catch (e) {
      console.error("Error fetching plans:", e);
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans, token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteDatePlan(id, token);
      fetchPlans();
    } catch (e) {
      console.error("Error deleting plan:", e);
    }
  };

  const handleMarkCompleted = async (id: string) => {
    if (!token) return;
    try {
      await updateDatePlanStatus(id, true, token);
      fetchPlans();
    } catch (e) {
      console.error("Error marking plan as completed:", e);
    }
  };

  const handleMarkUncompleted = async (id: string) => {
    if (!token) return;
    try {
      await updateDatePlanStatus(id, false, token);
      fetchPlans();
    } catch (e) {
      console.error("Error marking plan as uncompleted:", e);
    }
  };

  // separate completed and uncompleted plans
  const completedPlans = plans.filter(plan => plan.completed);
  const uncompletedPlans = plans.filter(plan => !plan.completed);

  const renderPlanCard = (plan: DatePlan) => (
    <View key={plan.id} className="mb-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative">
      <View className="absolute top-2 right-2 z-10 flex-row">
        {!plan.completed ? (



          <TouchableOpacity
            className="bg-pink-500 rounded-lg px-3 py-1 mr-2"
            onPress={() => handleMarkCompleted(plan.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-white text-xs font-semibold">Done</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-gray-500 rounded-lg px-3 py-1 mr-2"
            onPress={() => handleMarkUncompleted(plan.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-white text-xs font-semibold">Undo</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="p-1"
          onPress={() => handleDelete(plan.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="trash-2" size={20} color="#ef4444" /> 
        </TouchableOpacity>
      </View>
      
      <Text className="font-bold text-lg mb-2 pr-20">{plan.title}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {plan.locations.map((location, index) => (
          <View key={index} className="mr-3 bg-gray-50 rounded-lg p-3 min-w-[150px]">
            <Text className="font-semibold text-sm mb-1" numberOfLines={1}>
              {location.name}
            </Text>
            <Text className="text-xs text-gray-600" numberOfLines={2}>
              {location.address}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView
      className="flex-1"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPlans} />}
    >
      {plans.length === 0 ? (
        <Text className="text-gray-400 text-center mt-8">No saved plans yet. Create one!</Text>
      ) : (
        <View>
          <View className="flex-row bg-white border-b border-gray-200 mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 ${!showCompleted ? 'border-b-2 border-pink-500' : ''}`}
              onPress={() => setShowCompleted(false)}
            >
              <Text className={`text-center font-semibold ${!showCompleted ? 'text-pink-500' : 'text-gray-500'}`}>
                Uncompleted ({uncompletedPlans.length})
              </Text>
            </TouchableOpacity>
            
            <View className="w-px bg-gray-300" />
            
            <TouchableOpacity
              className={`flex-1 py-3 px-4 ${showCompleted ? 'border-b-2 border-pink-500' : ''}`}
              onPress={() => setShowCompleted(true)}
            >
              <Text className={`text-center font-semibold ${showCompleted ? 'text-pink-500' : 'text-gray-500'}`}>
                Completed ({completedPlans.length})
              </Text>
            </TouchableOpacity>
          </View>






          {!showCompleted ? (
            uncompletedPlans.map(renderPlanCard)
          ) : (
            completedPlans.map(renderPlanCard)
          )}
        </View>
      )}
    </ScrollView>
  );
}