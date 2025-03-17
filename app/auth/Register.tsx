import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <Stack initialRouteName="auth/RegisterStep1">
      <Stack.Screen name="auth/RegisterStep1" options={{ headerShown: false }} />
      <Stack.Screen name="auth/RegisterStep2" options={{ headerShown: false }} />
    </Stack>
  );
}
