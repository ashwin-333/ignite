import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const habits = [
  { name: "Drink water", image: require("/Users/ftc/habit-heatmap/assets/images/droplet.png") },
  { name: "Run", image: require("/Users/ftc/habit-heatmap/assets/images/running.png") },
  { name: "Read books", image: require("/Users/ftc/habit-heatmap/assets/images/book.png") },
  { name: "Meditate", image: require("/Users/ftc/habit-heatmap/assets/images/meditate.png") },
  { name: "Study", image: require("/Users/ftc/habit-heatmap/assets/images/work.png") },
  { name: "Journal", image: require("/Users/ftc/habit-heatmap/assets/images/journal.png") },
];

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
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <View style={styles.grid}>
        {habits.map((habit, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.habitBox, selectedHabits.includes(habit.name) && styles.selected]}
            onPress={() => toggleHabit(habit.name)}
          >
            <Image source={habit.image} style={styles.habitImage} />
            <Text>{habit.name}</Text>
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
  habitBox: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderRadius: 8,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backText: {
    fontSize: 24,
    color: "#000",
  },
  selected: { backgroundColor: "#DDD" },
  habitImage: { width: 40, height: 40, marginBottom: 5 },
  button: { backgroundColor: "#000", padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff" },
});
