import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function HeatMapScreen() {
  const router = useRouter();
  const { habitName, details } = useLocalSearchParams(); // Get habit details from navigation

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Habit Title */}
      <Text style={styles.title}>{habitName}</Text>
      <Text style={styles.subtitle}>{details}</Text>

      {/* Heatmap Placeholder */}
      <View style={styles.heatmapContainer}>
        <Text style={styles.heatmapText}>[Heatmap Visualization]</Text>
      </View>

      {/* Delete Habit Button */}
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5", alignItems: "center" },
  backButton: { position: "absolute", top: 50, left: 20 },
  backButtonText: { fontSize: 24, color: "#000" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 80 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  heatmapContainer: { width: "100%", height: 200, backgroundColor: "#DDD", justifyContent: "center", alignItems: "center", marginTop: 20 },
  heatmapText: { fontSize: 16, color: "#333" },
  deleteButton: { backgroundColor: "#E63946", padding: 15, borderRadius: 8, marginTop: 30, width: "80%", alignItems: "center" },
  deleteButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
