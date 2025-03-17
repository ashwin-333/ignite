import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, db, googleProvider } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure();

export default function RegisterStep1() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        profilePicture: null,
      });

      console.log("User created:", user.uid);

      router.push("/auth/RegisterStep2");

    } catch (error) {
      console.error("Sign-up Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };
  const handleGoogleSignUp = async () => {
    try {
      const result = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      if (!tokens.idToken) {
        throw new Error("Google Sign-In didn't return an ID token");
      }
      
      // Create a Firebase credential with the Google ID token
      const credential = GoogleAuthProvider.credential(tokens.idToken);
      
      // Sign in to Firebase with the Google credential
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      
      // Now use the Firebase UID for Firestore operations
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      // Get user info from Google sign-in
      if (!result.data) {
        throw new Error("Google Sign-In didn't return user data");
      }
      const googleUser = result.data.user;
      const firstName = googleUser.givenName || "Unknown";
      const lastName = googleUser.familyName || "Unknown";

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          firstName,
          lastName,
          email: googleUser.email,
          profilePicture: googleUser.photo || null,
        });
      }

      console.log("Google user signed up:", firebaseUser.uid);
      router.push("/auth/RegisterStep2");

    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      alert("Error signing up with Google. Please try again.");
    }
  };




  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
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

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#A1A1A1"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.googleIcon}
        />
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#A1A1A1',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#A1A1A1',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 8,
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
