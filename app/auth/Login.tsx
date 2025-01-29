import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email.trim() !== "" && password.trim() !== "") {
      router.replace("/"); // Navigate to the Home (index.tsx)
    } else {
      alert("Please enter both email and password");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button to Splash Screen */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Log In</Text>

      <Text style={styles.label}>E-MAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Google Sign-In Button (Smaller) */}
      <TouchableOpacity style={styles.googleButton}>
        <Image source={require("../../assets/images/google.png")} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Next Button (Larger) */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/RegisterStep1")}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.footerLink}>Let's create!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  googleButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "#000",
    width: "70%",
    alignSelf: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    color: "#000",
    marginTop: 20,
    fontSize: 14,
  },
  footerLink: {
    color: "#7948FF",
    fontWeight: "bold",
  },
});
