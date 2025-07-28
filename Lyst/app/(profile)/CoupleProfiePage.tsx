import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { usePartner } from "@/providers/PartnerProvider";
import { useGallery } from "@/providers/GalleryProvider";
import { useCalendar } from "@/providers/CalendarProvider";
import { getDatePlans } from "@/utils/datePlans.api";
import { getExpenseSections } from "@/utils/expenses.api";
import { useFocusEffect } from "@react-navigation/native";
import { formatDate, formatTime } from "@/utils/calendar.api";

const CoupleProfile = () => {
  const { user, token } = useAuth();
  const { partnerName } = usePartner();
  const { photos } = useGallery();
  const { events, fetchEvents } = useCalendar();
  const [completedPlansCount, setCompletedPlansCount] = useState(0);
  const [totalAmountSpent, setTotalAmountSpent] = useState(0);
  const [nextDate, setNextDate] = useState<{
    time: string;
    date: string;
    days: string;
    hours: string;
    minutes: string;
  } | null>(null);
  const [nextEventTitle, setNextEventTitle] = useState<string>("");

  // Calculate next event
  useEffect(() => {
    if (events.length === 0) return;

    const now = new Date().getTime();
    const nextEvent = events
      .filter((event) => {
        try {
          return new Date(event.startTime).getTime() > now;
        } catch {
          return false;
        }
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )[0];

    if (!nextEvent) {
      setNextDate(null);
      setNextEventTitle("Nothing Planned Yet");
      return;
    }

    // get the time difference
    const diffMs = new Date(nextEvent.startTime).getTime() - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    setNextDate({
      time: formatTime(nextEvent.startTime),
      date: formatDate(nextEvent.startTime),
      days: String(diffDays).padStart(2, "0"),
      hours: String(diffHours).padStart(2, "0"),
      minutes: String(diffMinutes).padStart(2, "0"),
    });
    setNextEventTitle(nextEvent.title || "Upcoming Plan");
  }, [events]);

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        if (!token) return;
        try {
          // refetching events
          await fetchEvents();

          // calculate completed plans
          const plans = await getDatePlans(token);
          const completedCount = plans.filter(
            (plan: any) => plan.completed
          ).length;
          setCompletedPlansCount(completedCount);

          // calculate total amount spent
          const expenses = await getExpenseSections(token);
          let total = 0;
          expenses.forEach((section: any) => {
            section.items.forEach((item: any) => {
              const cleaned = (item.amount || "").replace(/[^0-9.-]+/g, "");
              const amount = parseFloat(cleaned);
              if (!isNaN(amount)) {
                total += amount;
              }
            });
          });
          setTotalAmountSpent(total);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
    }, [token])
  );

  return (
    <View>
      <View className="items-center py-3">
        <Image
          source={require("@/assets/images/profilePage/SampleProfilePicture.jpg")}
          className="w-36 h-36 rounded-full bg-gray-200 mb-2"
        />
        <Text className="text-3xl font-bold">
          {`${user?.displayName} & ${partnerName}`}
        </Text>
        <Text className="text-xl font-light">Together since XXXX</Text>
      </View>

      <View className="border-b border-gray-200 mb-6 ml-6 mr-8"></View>

      {!nextDate ? (
        <View className="ml-6 mr-8 mb-2">
          <Text className="text-2xl text-gray-600 font-bold">Next: </Text>
          <Text className="text-lg text-gray-500">
            No upcoming events scheduled
          </Text>
        </View>
      ) : (
        <>
          <View className="flex-row justify-between items-center ml-6 mr-8 mb-3">
            <Text className="text-lg text-gray-400 font-bold">Next up:</Text>
            <Text className="text-lg text-gray-400 font-bold">
              {nextDate.time}, {nextDate?.date}
            </Text>
          </View>
          <Text className="text-2xl text-gray-600 font-bold ml-6 mr-8 mb-3">
            {nextEventTitle}
          </Text>

          <View className="bg-white p-4 rounded-lg border border-gray-200 ml-6 mr-8">
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-gray-500 text-sm">Days</Text>
                <Text className="text-2xl font-bold">
                  {nextDate?.days}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 text-sm">Hours</Text>
                <Text className="text-2xl font-bold">
                  {nextDate?.hours}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 text-sm">Minutes</Text>
                <Text className="text-2xl font-bold">
                  {nextDate?.minutes}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      <Text className="text-2xl text-gray-600 font-bold mb-6 ml-6 mr-8 mt-6">
        Relationship Stats
      </Text>
      <View className="ml-6 mr-8">
        <View className="flex-row justify-between">
          {/* Dates Completed */}
          <View className="bg-white rounded-xl w-[47%] p-6 mr-2 shadow-sm border border-gray-200">
            <Text className="text-gray-500 text-lg mb-1">Dates</Text>
            <Text className="text-gray-500 text-lg mb-1">Completed</Text>
            <Text className="text-3xl font-bold mt-2">
              {completedPlansCount}
            </Text>
          </View>

          {/* Photos */}
          <View className="bg-white rounded-xl w-[47%] p-6 ml-4 shadow-sm border border-gray-200">
            <Text className="text-gray-500 text-lg mb-1">Photos</Text>
            <Text className="text-gray-500 text-lg mb-1">Added</Text>
            <Text className="text-3xl font-bold mt-2">{photos.length}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-8">
          {/* Anniversary */}
          <View className="bg-white rounded-xl w-[47%] p-6 mr-2  shadow-sm border border-gray-200">
            <Text className="text-gray-500 text-lg mb-1">Anniversary</Text>
            <Text className="font-bold text-3xl">Oct 12,</Text>
            <Text className="font-bold text-3xl">2021</Text>
          </View>

          {/* Amount Spent */}
          <View className="bg-white rounded-xl w-[47%] p-6 ml-4  shadow-sm border border-gray-200">
            <Text className="text-gray-500 text-lg mb-1">Amount Spent</Text>
            <Text
              className="font-bold text-3xl"
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              numberOfLines={1}
            >
              ${totalAmountSpent.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CoupleProfile;
