import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getWeatherForecast } from '@/utils/api';
import DraggableFlatList, { NestableDraggableFlatList, RenderItemParams } from 'react-native-draggable-flatlist';

export default function RouteReview() {
    const { routeData } = useLocalSearchParams();
    const initialRoute = routeData ? JSON.parse(routeData as string) : [];
    // initialRoute is basically the raw json response from the AI
    const [data, setData] = useState(initialRoute.selectedLocations);
    const [weatherForecastForNextWeek, setWeatherForecastForNextWeek] = useState([]);

    useEffect(() => {
        const fetchWeather = async () => {
          try {
            const data = await getWeatherForecast("Singapore"); 
            console.log("Weather API response:", data);
            setWeatherForecastForNextWeek(data.forecast); 
          } catch (error) {
            console.error("failed to fetch weather forecast:", error);
          }
        };
        fetchWeather();
      }, []);

  
    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            
                <Text className="text-2xl font-bold">Review Your Date Route</Text>
                <Text className="text-lg text-gray-500 mb-3">Drag and drop to reorder</Text>
                
                <DraggableFlatList
                    className="px-6 mt-4 mb-3"
                    data={data}
                    onDragEnd={({ data }) => setData(data)}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={({ item, drag, isActive }: RenderItemParams<any>) => (
                    <TouchableOpacity
                        onLongPress={drag}
                        disabled={isActive}
                        className={`mb-4 p-4 rounded-lg border border-gray-300 bg-white shadow ${isActive ? 'bg-white/90 shadow-lg scale-105' : ''}`}
                    >
                        <Text className="font-bold text-lg mb-1">{item.name}</Text>
                        <Text className="text-gray-600 mb-1">{item.address}</Text>
                        
                    </TouchableOpacity>
                    )}
                />

                <View className="flex-col gap-y-1">
                    <Text className="font-semibold text-xl">
                        Weekly Weather Forecast
                    </Text>
                    <Text className="text-sm text-gray-500 mb-3" >
                        Data from WeatherAPI
                    </Text>
                    {weatherForecastForNextWeek.map((item: any, index) => {
                    return (
                        <View key={index} className="mb-2 flex-row gap-x-2">
                            <Text className="text-gray-600">{item.date}</Text>
                            <Text className="text-gray-500">Chance of Rain: {item.chance_of_rain}%</Text>
                            <Text className="text-gray-500">{item.condition}</Text>
                        </View>
                    );
                })}</View>


            
            
        </SafeAreaView>
      
    );
  }