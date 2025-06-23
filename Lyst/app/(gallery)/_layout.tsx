import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="AddImage" options={{ headerShown: false }} />
    </Stack>
  );
}
