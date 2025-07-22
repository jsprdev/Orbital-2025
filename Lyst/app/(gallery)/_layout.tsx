import { Stack } from "expo-router";

export default function GalleryLayout() {
  return (
    <Stack>
      <Stack.Screen name="AddImage" options={{ headerShown: false }} />
      <Stack.Screen name="AlbumView" options={{ headerShown: false }} />
    </Stack>
  );
}
