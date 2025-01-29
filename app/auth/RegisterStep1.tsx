import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterStep1() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: "red" }]}>
        <Text style={styles.title}>Sign Up - Step 1</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Enter first name" />

      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Enter last name" />

      <Text style={styles.label}>Birthdate</Text>
      <TextInput style={styles.input} value={birthdate} onChangeText={setBirthdate} placeholder="MM/DD/YYYY" />

      <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/RegisterStep2")}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: { height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, marginTop: 5 },
  button: { backgroundColor: "#000", paddingVertical: 15, borderRadius: 8, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});
