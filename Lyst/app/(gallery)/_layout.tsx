import { Stack } from "expo-router";
import { GalleryProvider } from "@/providers/GalleryProvider";

export default function GalleryLayout() {
  return (
    <Stack>
      <Stack.Screen name="AddImage" options={{ headerShown: false }} />
    </Stack>
  );
}
