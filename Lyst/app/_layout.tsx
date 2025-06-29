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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(gallery)" />
          </Stack>
        </GalleryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
