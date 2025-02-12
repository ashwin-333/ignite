import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

const habits = [
  { name: "Drink water", icon: "💧", goalUnit: "glasses", goalValue: 8 },
  { name: "Run", icon: "🏃", goalUnit: "miles", goalValue: 3 },
  { name: "Read books", icon: "📖", goalUnit: "pages", goalValue: 20 },
  { name: "Meditate", icon: "🧘", goalUnit: "minutes", goalValue: 15 },
  { name: "Study", icon: "💻", goalUnit: "hours", goalValue: 2 },
  { name: "Journal", icon: "📓", goalUnit: "entries", goalValue: 1 },
];

export default function RegisterStep3() {
  const router = useRouter();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const toggleHabit = (habit: string) => {
    setSelectedHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const saveHabitsToFirebase = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userHabitsRef = collection(db, "users", user.uid, "habits");
    
    // Create a batch of promises to save all habits
    const savePromises = selectedHabits.map(async (habitName) => {
      const habit = habits.find(h => h.name === habitName);
      if (!habit) return;

      await setDoc(doc(userHabitsRef), {
        name: habit.name,
        icon: habit.icon,
        goalUnit: habit.goalUnit,
        goalValue: habit.goalValue,
      });
    });

    await Promise.all(savePromises);
    
    router.push("/tabs/Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign up</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Choose your first habits</Text>
        <Text style={styles.subtitle}>You may add more habits later</Text>

        <ScrollView contentContainerStyle={styles.grid}>
          {habits.map((habit, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.habitBox, selectedHabits.includes(habit.name) && styles.selected]}
              onPress={() => toggleHabit(habit.name)}
            >
              <Text style={styles.habitEmoji}>{habit.icon}</Text>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitGoal}>{habit.goalValue} {habit.goalUnit}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.finishButton}
        onPress={saveHabitsToFirebase}
      >
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#fff", paddingVertical: 15, alignItems: "center", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  headerTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingBottom: 20 },
  habitBox: { 
    width: "45%", 
    margin: "2.5%", 
    aspectRatio: 1, 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
    borderWidth: 1, 
    borderColor: "#E0E0E0",
    padding: 10 
  },
  selected: { borderColor: "#7948FF", borderWidth: 2 },
  habitEmoji: { fontSize: 32, marginBottom: 6 },
  habitName: { fontSize: 14, fontWeight: "500", textAlign: "center", marginBottom: 4 },
  habitGoal: { fontSize: 12, color: "#666", textAlign: "center" },
  finishButton: { backgroundColor: "#000", paddingVertical: 15, borderRadius: 25, marginHorizontal: 20, marginBottom: 20, alignItems: "center" },
  finishButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});