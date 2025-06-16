import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="createAccount" options={{ headerShown: false }} />
    </Stack>
  );
}
