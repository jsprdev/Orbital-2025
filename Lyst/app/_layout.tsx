import { Stack, useRouter } from "expo-router";
import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "@/providers/AuthProvider";
import { GalleryProvider } from "@/providers/GalleryProvider";
import { PartnerProvider } from "@/providers/PartnerProvider";
import { CalendarProvider } from "@/providers/CalendarProvider";

export default function RootLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PartnerProvider>
          <GalleryProvider>
            <CalendarProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </CalendarProvider>
          </GalleryProvider>
        </PartnerProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
