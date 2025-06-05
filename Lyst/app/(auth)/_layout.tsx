import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="CreateAccount" options={{ headerShown: false }} />
    </Stack>
  );
}
