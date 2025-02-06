import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const habits = [
  { name: "Drink Water", details: "2000 ML", emoji: "💧" },
  { name: "Walk", details: "10000 STEPS", emoji: "🚶‍♂️" },
  { name: "Water Plants", details: "1 TIMES", emoji: "🌿" },
  { name: "Meditate", details: "30 MIN", emoji: "🧘" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Tejas 👋</Text>
        <Text style={styles.subtitle}>Let’s make habits together!</Text>
      </View>

      {/* Habits List */}
      <ScrollView contentContainerStyle={styles.habitsContainer}>
        {habits.map((habit, index) => (
          <View key={index} style={styles.habitCard}>
            <Text style={styles.habitEmoji}>{habit.emoji}</Text>
            <View style={styles.habitDetails}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitSubdetails}>{habit.details}</Text>
            </View>
            <TouchableOpacity style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✔</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/homelogo.svg")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/tabs/Explore")}>
          <Image
            source={require("../../assets/images/directionlogo.svg")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navAddButton}>
          <Image
            source={require("../../assets/images/createlogo.svg")}
            style={styles.navAddIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/awardslogo.svg")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/profilelogo.svg")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  habitsContainer: {
    padding: 20,
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  habitSubdetails: {
    fontSize: 14,
    color: "#666",
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  navAddButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#7948FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navAddIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
