import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import { Note } from "@/types";
import { getNotes } from "@/utils/api";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";


export default function LocationDetails() {
    const { id } = useLocalSearchParams();
    const { token } = useAuth();
    const [note, setNote] = useState<Note | null>(null);
    const [placeDetails, setPlaceDetails] = useState<any>(null);

    useEffect(() => {
    if (!note?.place_id) return;
    const fetchDetails = async () => {
        const res = await fetch(
        `http://${process.env.EXPO_PUBLIC_HOST}:${process.env.EXPO_PUBLIC_PORT}/api/places/details?placeId=${note.place_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setPlaceDetails(data.result);
    };
    fetchDetails();
    }, [note]);

    useEffect(() => {
        const fetchNote = async () => {
            const notes = await getNotes(token);
            setNote(notes.find((n: Note) => n.id === id));
        };
        fetchNote();
    }, [id]);

    useEffect(() => {
        if (!note?.place_id) return;
        const fetchDetails = async () => {
          const res = await fetch(
            `http://${process.env.EXPO_PUBLIC_HOST}:${process.env.EXPO_PUBLIC_PORT}/api/places/details?placeId=${note.place_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          setPlaceDetails(data.result);
        };
        fetchDetails();
      }, [note]);

    if (!note) return <Text>Loading...</Text>;

    // console.log(placeDetails)
    // SHOW ALL AVAILABLE KEYS IN THE JSON
    // console.log(Object.keys(placeDetails));

    return (
        <>
        <Stack.Screen
            options={{
                headerShown: false, // hide header for now for our design
                headerTitle: 'Your Saved Location',
                headerStyle: { backgroundColor: '#222' },
                headerTitleStyle: { color: '#fff', fontSize: 18 },
                headerTintColor: '#fff',      // back button color
            }}
        />
        
        <View>
            {placeDetails?.geometry?.location && (
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeDetails.name + ' ' + placeDetails.formatted_address)}`;
                            Linking.openURL(url);
                        }}
                    >
                        <Image
                        source={{
                            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}&zoom=15&size=400x200&markers=color:red%7C${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
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
                        <View className="flex-row items-center mx-6 space-x-4">
                            <Text className="text-lg text-black font-semibold">{placeDetails.rating} ★</Text>
                            <Text className="text-base text-gray-600">
                                ({placeDetails.user_ratings_total} reviews)
                            </Text>
                            {placeDetails.current_opening_hours?.open_now !== undefined && (
                                <Text className={`text-base font-semibold ${placeDetails.current_opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                                {placeDetails.current_opening_hours.open_now ? 'Open Now' : 'Closed'}
                                </Text>
                            )}
                        </View>
                    </View>

                     {placeDetails.photos && placeDetails.photos.length > 0 && (
                    <Image
                        source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
                        }}
                        className="w-full h-64 rounded-xl mb-3"
                        resizeMode="cover"
                    />
                    )}
                    
                    
                    <Text className="text-xl text-black-500 mx-6">
                        {placeDetails.formatted_address}
                    </Text>
                    <View className="text-sm px-6">
                        {/* since some locations they input might not have official opening hours yet */}
                        {placeDetails.current_opening_hours?.weekday_text.map((line: string, idx: number) => (
                            <Text key={idx} className="text-sm text-black-500">{line}</Text>
                            
                        ))}
                    </View>
                
                    
                </View>
                
            ) : (
                <Text>Loading place details...</Text>
            )}

            
        </View>
        </>
    );
}