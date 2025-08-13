import { Stack } from "expo-router";
import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "@/providers/AuthProvider";
import { NotesProvider } from "@/providers/NotesProvider";
import { GalleryProvider } from "@/providers/GalleryProvider";
import { PartnerProvider } from "@/providers/PartnerProvider";
import { CalendarProvider } from "@/providers/CalendarProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PartnerProvider>
          <NotesProvider>
            <GalleryProvider>
              <CalendarProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </CalendarProvider>
            </GalleryProvider>
          </NotesProvider>
        </PartnerProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
