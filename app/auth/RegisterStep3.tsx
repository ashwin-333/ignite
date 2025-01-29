import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const habits = ["Drink water", "Run", "Read books", "Meditate", "Study", "Journal"];

export default function RegisterStep3() {
  const router = useRouter();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const toggleHabit = (habit: string) => {
    setSelectedHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your First Habits</Text>
      <Text style={styles.subtitle}>You may add more habits later</Text>

      <View style={styles.grid}>
        {habits.map((habit, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.habitBox, selectedHabits.includes(habit) && styles.selected]}
            onPress={() => toggleHabit(habit)}
          >
            <Text>{habit}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  habitBox: { padding: 15, margin: 5, borderWidth: 1, borderRadius: 8 },
  selected: { backgroundColor: "#DDD" },
  button: { backgroundColor: "#000", padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff" },
});
