import React from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import styles from "./SplashScreenStyles"; // Ensure correct import

export default function Index() {
  const router = useRouter();

  // ✅ Load Fonts
  const [fontsLoaded] = useFonts({
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "OpenSans-Medium": require("../assets/fonts/OpenSans-Medium.ttf"),
  });

  return (
    <LinearGradient
      colors={["#001908", "#7948FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={require("../assets/images/igniteee.svg")} style={styles.textLogo} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push("/auth/RegisterStep1")}>
          <Text style={[styles.buttonTextSecondary, { fontFamily: "OpenSans-Bold" }]}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push("/auth/Login")}>
          <Text style={[styles.buttonTextPrimary, { fontFamily: "OpenSans-SemiBold" }]}>Log In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
