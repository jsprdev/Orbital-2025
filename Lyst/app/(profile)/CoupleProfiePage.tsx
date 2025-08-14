import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Modal,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
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
  const { partnerName, anniversaryDate, uploadAnniversaryDate, fetchPartner } =
    usePartner();
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

  const [showModal, setShowModal] = useState(false);
  const [anniversaryInput, setAnniversaryInput] = useState("");

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
    }, [fetchEvents, token])
  );

  const getDaysSinceAnniversary = (
    anniversaryDate: Date | undefined
  ): number | null => {
    if (!anniversaryDate) return null;

    const today = new Date();
    const timeDiff = today.getTime() - anniversaryDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff;
  };

  const handleAnniversary = () => {
    setShowModal(true);
  };

  const handleSaveAnniversary = async () => {
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(anniversaryInput);
    if (!isValidDate) {
      Alert.alert("Invalid Date", "Please use YYYY-MM-DD format.");
      return;
    }

    const date = new Date(anniversaryInput);
    if (isNaN(date.getTime())) {
      Alert.alert("Invalid Date", "Please enter a valid date.");
      return;
    }

    try {
      await uploadAnniversaryDate(date);
      // Wait a moment for the backend to process
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchPartner();

      Alert.alert("Success", "Anniversary date updated!");
      setAnniversaryInput("");
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading anniversary date:", error);
      Alert.alert("Error", "Failed to update anniversary date.");
    }
  };

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
        {anniversaryDate && (
          <Text className="text-xl font-light">
            Together for{" "}
            <Text className="font-bold">
              {getDaysSinceAnniversary(anniversaryDate)}
            </Text>{" "}
            days
          </Text>
        )}
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
                <Text className="text-2xl font-bold">{nextDate?.days}</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 text-sm">Hours</Text>
                <Text className="text-2xl font-bold">{nextDate?.hours}</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 text-sm">Minutes</Text>
                <Text className="text-2xl font-bold">{nextDate?.minutes}</Text>
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
          <TouchableOpacity
            className="bg-white rounded-xl w-[47%] p-6 mr-2  shadow-sm border border-gray-200"
            onPress={handleAnniversary}
          >
            <Text className="text-gray-500 text-lg mb-1">Anniversary</Text>
            {anniversaryDate ? (
              <>
                <Text className="font-bold text-3xl">
                  {new Date(anniversaryDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  ,
                </Text>
                <Text className="font-bold text-3xl">
                  {new Date(anniversaryDate).getFullYear()}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-gray-500 text-m ">
                  Click here to enter your anniversary
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <View className="bg-white w-80 rounded-xl p-6 shadow-md">
                <Text className="text-xl font-bold mb-4 text-center">
                  Set Anniversary Date
                </Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  value={anniversaryInput}
                  onChangeText={setAnniversaryInput}
                  className="border border-gray-300 rounded-lg px-4 py-2 mb-4 text-lg"
                  keyboardType="numeric"
                  maxLength={10}
                />
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    className="bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-gray-700 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveAnniversary}
                    className="bg-pink-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-medium">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
