import { Stack } from "expo-router";

export default function Layout() {
 return (
   <Stack>
     <Stack.Screen name="index" options={{ headerShown: false }} />
     <Stack.Screen name="auth/RegisterStep1" options={{ headerShown: false }} />
     <Stack.Screen name="auth/RegisterStep2" options={{ headerShown: false }} />
     <Stack.Screen name="auth/RegisterStep3" options={{ headerShown: false }} />
     <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
     <Stack.Screen name="tabs/Home" options={{ headerShown: false }} />
     <Stack.Screen name="tabs/Explore" options={{ headerShown: false }} />
     <Stack.Screen name="tabs/HeatMap" options={{ headerShown: false }} />
     <Stack.Screen name="tabs/CreateHabits" options={{ headerShown: false }} />
     <Stack.Screen name="tabs/Leaderboards" options={{ headerShown: false }} />
     <Stack.Screen name="tabs/StreakAward" options={{ headerShown: false }} />
     <Stack.Screen name="tabs/Profile" options={{ headerShown: false }} />

   </Stack>
 );
}
