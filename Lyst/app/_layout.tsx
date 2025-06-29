import { Stack, useRouter } from "expo-router";
import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler"; 

import { AuthProvider } from "@/providers/AuthProvider";
import { GalleryProvider } from "@/providers/GalleryProvider";

export default function RootLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <GalleryProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(gallery)" options={{ headerShown: false }} />
            <Stack.Screen name="(plans)" options={{ headerShown: false }} />
          </Stack>
        </GalleryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

