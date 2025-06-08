import { Stack, useRouter } from "expo-router";
import "@/global.css";
import { AuthProvider } from "@/providers/AuthProvider";


export default function RootLayout() {
  const router = useRouter();

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

