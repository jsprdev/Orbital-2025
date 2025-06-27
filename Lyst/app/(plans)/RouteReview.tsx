import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RouteReview() {
    const { routeData } = useLocalSearchParams();
    const dateRoute = routeData ? JSON.parse(routeData as string) : null;
  
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <Text className="text-2xl font-bold">Review Your Date Route</Text>
                {dateRoute && (
                <Text selectable style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {JSON.stringify(dateRoute, null, 2)}
                </Text>
                )}
            
            </ScrollView>
        </SafeAreaView>
      
    );
  }