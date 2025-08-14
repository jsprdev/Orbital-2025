import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Note } from "@/types";
import { getNotes } from "@/utils/lyst.api";
import { useAuth } from "@/providers/AuthProvider";

export default function LocationDetails() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  if (!token) {
    throw Error("No token received, please Sign In again");
  }
  const [note, setNote] = useState<Note | null>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);

  useEffect(() => {
    if (!note?.place_id) return;
    const fetchDetails = async () => {
      const res = await fetch(
        `https://${process.env.EXPO_PUBLIC_HOST}:${process.env.EXPO_PUBLIC_PORT}/api/places/details?placeId=${note.place_id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setPlaceDetails(data.result);
    };
    fetchDetails();
  }, [note, token]);

  useEffect(() => {
    const fetchNote = async () => {
      const notes = await getNotes(token);
      setNote(notes.find((n: Note) => n.id === id));
    };
    fetchNote();
  }, [id, token]);

  if (!note) return <Text>Loading...</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false, // hide header for now for our design
        }}
      />

      <ScrollView>
        {placeDetails?.geometry?.location && (
          <View>
            <TouchableOpacity
              onPress={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeDetails.name + " " + placeDetails.formatted_address)}`;
                Linking.openURL(url);
              }}
            >
              <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/staticmap?center=${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}&zoom=15&size=400x200&markers=color:red%7C${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`,
                }}
                className="w-full h-80 rounded-xl mb-3"
                resizeMode="cover"
              />
            </TouchableOpacity>
            {/* to give the rounded border like login page */}
            <View
              className="absolute bottom-0 left-0 right-0 bg-white"
              style={{
                height: 20,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
              }}
            />
          </View>
        )}

        {placeDetails ? (
          <View className="bg-white h-full gap-y-3">
            <View>
              <Text className="text-3xl mx-6 font-bold text-black-500 mb-1">
                {placeDetails.name}
              </Text>
              <View className="flex-row items-center mx-6 gap-x-2">
                <Text className="text-lg text-black font-semibold">
                  {placeDetails.rating} ★
                </Text>
                <Text className="text-base text-gray-600">
                  ({placeDetails.user_ratings_total} reviews)
                </Text>
                {placeDetails.current_opening_hours?.open_now !== undefined && (
                  <Text
                    className={`text-base font-semibold ${placeDetails.current_opening_hours.open_now ? "text-green-600" : "text-red-600"}`}
                  >
                    {placeDetails.current_opening_hours.open_now
                      ? "Open Now"
                      : "Closed"}
                  </Text>
                )}
              </View>
            </View>

            {placeDetails.photos && placeDetails.photos.length > 0 && (
              <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`,
                }}
                className="w-full h-64 mb-3"
                resizeMode="cover"
              />
            )}

            <View className="gap-y-1 px-6">
              <Text className="text-xl font-bold text-black-500">Address</Text>
              <Text className="text-md text-black-500">
                {placeDetails.formatted_address}
              </Text>
            </View>
            <View className="px-6 gap-y-1">
              <Text className="text-xl font-bold text-black-500">
                Opening Hours
              </Text>
              <View>
                {placeDetails.current_opening_hours?.weekday_text ? (
                  placeDetails.current_opening_hours?.weekday_text.map(
                    (line: string, idx: number) => {
                      const [day, hours] = line.split(": ");
                      // some places have multiple time ranges that they are open, maybe close for lunch break etc
                      const hourRanges = hours ? hours.split(", ") : [""];

                      return (
                        <View key={idx}>
                          {hourRanges.map((range, i) => (
                            <View key={i} className="flex-row">
                              {/* to add whitespace to the day name */}
                              <View className="w-28">
                                {/* for the first "row" display the day name, but aft that just put whitespace */}
                                {i === 0 ? (
                                  <Text className="text-sm text-gray-500">
                                    {day}
                                  </Text>
                                ) : (
                                  <Text className="text-sm text-black-500">
                                    {" "}
                                  </Text>
                                )}
                              </View>
                              <View className="flex-1">
                                <Text className="text-sm text-black-500">
                                  {range}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      );
                    },
                  )
                ) : (
                  <Text className="text-gray-500">
                    No available information
                  </Text>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center min-h-[800px]">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        )}
      </ScrollView>
    </>
  );
}
