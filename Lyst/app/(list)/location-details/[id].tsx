import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import { Note } from "@/types";
import { getNotes } from "@/utils/api";
import { useAuth } from "@/providers/AuthProvider";

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

    return (
        <View>
            {placeDetails?.geometry?.location && (
                <TouchableOpacity
                    onPress={() => {
                    const lat = placeDetails.geometry.location.lat;
                    const lng = placeDetails.geometry.location.lng;
                    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                    Linking.openURL(url);
                    }}
                >
                    <Image
                    source={{
                        uri: `https://maps.googleapis.com/maps/api/staticmap?center=${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}&zoom=15&size=400x200&markers=color:red%7C${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
                    }}
                    style={{ width: 300, height: 150, borderRadius: 12, marginBottom: 12 }}
                    resizeMode="cover"
                    />
                </TouchableOpacity>
            )}
            {placeDetails ? (

                

                <View>
                     {placeDetails.photos && placeDetails.photos.length > 0 && (
                    <Image
                        source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
                        }}
                        style={{ width: 300, height: 200, borderRadius: 12, marginBottom: 12 }}
                        resizeMode="cover"
                    />
                    )}
                    
                    <Text>Name: {placeDetails.name}</Text>
                    <Text>Address: {placeDetails.formatted_address}</Text>
                    
                </View>
                
            ) : (
                <Text>Loading place details...</Text>
            )}
        </View>
    );
}