import { Stack, useRouter } from "expo-router";
import "./global.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler"; 


export default function RootLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(gallery)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

