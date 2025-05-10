import { Stack, useRouter } from "expo-router";
import '../global.css';

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name='createAccount' options={{ headerShown: false }} />
    </Stack>
  );
}
