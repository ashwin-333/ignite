import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
      <Stack.Screen name="auth/Login" options={{ title: 'Log In', headerShown: false }} />
      <Stack.Screen name="auth/Register" options={{ title: 'Sign Up', headerShown: false }} />
    </Stack>
  );
}
