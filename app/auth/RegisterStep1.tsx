import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function RegisterStep1() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        console.log("User signed up:", result.user);
        router.push("/auth/RegisterStep3"); // Navigate to step 3
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Google Sign-Up Error:", error.message);
        alert("Error signing up with Google: " + error.message);
      } else {
        console.error("Unknown error occurred during Google Sign-Up", error);
        alert("An unknown error occurred during Google Sign-Up");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Sign up</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
        placeholderTextColor="#A1A1A1"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
        placeholderTextColor="#A1A1A1"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="#A1A1A1"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth/RegisterStep2")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      {/* Sign up with Google */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
        <Image source={require("../../assets/images/google.png")} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#1A1A1A",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#7948FF",
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A1A1A1",
    flexDirection: "row",
    justifyContent: "center",
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
});

