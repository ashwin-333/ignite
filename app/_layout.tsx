import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
      <Stack.Screen name="auth/RegisterStep1" options={{ headerShown: false }} />
      <Stack.Screen name="auth/RegisterStep2" options={{ headerShown: false }} />
      <Stack.Screen name="auth/RegisterStep3" options={{ headerShown: false }} />
      <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
    </Stack>
  );
}