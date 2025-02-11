import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import styles from "./SplashScreenStyles"; // Ensure correct import

export default function Index() {
  const router = useRouter(); // Import router for navigation

  return (
    <LinearGradient
      colors={["#001908", "#7948FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        {/* ✅ FIXED IMAGE IMPORT PATH */}
        <Image source={require("../assets/images/igniteee.svg")} style={styles.textLogo} />
      </View>

      <View style={styles.buttonContainer}>
        {/* ✅ REMOVED LEADING `/` IN ROUTES */}
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push("/auth/RegisterStep1")}>
          <Text style={styles.buttonTextSecondary}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push("/auth/Login")}>
          <Text style={styles.buttonTextPrimary}>Log In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
