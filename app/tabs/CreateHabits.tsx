import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";

export default function CreateHabit() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity onPress={() => router.push("/tabs/Home")} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.header}>Create Custom Habit</Text>

      {/* Habit Name */}
      <Text style={styles.label}>NAME</Text>
      <TextInput style={styles.input} placeholder="Enter habit name" />

      {/* Goal */}
      <Text style={styles.label}>GOAL</Text>
      <TextInput style={styles.input} placeholder="Enter goal (e.g., 2000 ML)" />

      {/* Frequency Selection Placeholder */}
      <Text style={styles.label}>FREQUENCY</Text>
      <View style={styles.frequencyContainer}>
        <Text>1 times</Text>
        <View style={styles.frequencyOptions}>
          <TouchableOpacity style={styles.frequencyButton}><Text>Daily</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.frequencyButton, styles.selected]}><Text>Weekly</Text></TouchableOpacity>
          <TouchableOpacity style={styles.frequencyButton}><Text>Monthly</Text></TouchableOpacity>
        </View>
      </View>

      {/* Add Habit Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
  backButton: { position: "absolute", top: 50, left: 20 },
  backButtonText: { fontSize: 24, color: "#000" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "bold", color: "#666", marginTop: 15 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginTop: 5 },
  frequencyContainer: { marginTop: 10, padding: 10, backgroundColor: "#fff", borderRadius: 8 },
  frequencyOptions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  frequencyButton: { padding: 10, borderRadius: 8, backgroundColor: "#EEE" },
  selected: { backgroundColor: "#7948FF", color: "#fff" },
  addButton: { backgroundColor: "#7948FF", padding: 15, borderRadius: 8, marginTop: 30, alignItems: "center" },
  addButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
