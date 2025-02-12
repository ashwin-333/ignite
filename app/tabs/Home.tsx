import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

interface Habit {
  id: string;
  name: string;
  icon: string;
  goalValue: number;
  goalUnit: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch user's name
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setFirstName(userDoc.data().firstName);
        }

        // Fetch user's habits
        const habitsRef = collection(db, "users", user.uid, "habits");
        const habitsSnapshot = await getDocs(habitsRef);
        
        const userHabits = habitsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Habit[];
        
        setHabits(userHabits);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {firstName || "User"} 👋</Text>
        <Text style={styles.subtitle}>Let's make habits together!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.habitsContainer}>
        {habits.map((habit, index) => (
          <View key={index} style={styles.habitCard}>
            <Text style={styles.habitEmoji}>{habit.icon}</Text>
            <View style={styles.habitDetails}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitSubdetails}>{habit.goalValue} {habit.goalUnit}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkmark}
              onPress={() => router.push({ 
                pathname: "/tabs/HeatMap", 
                params: { 
                  habitName: habit.name, 
                  details: habit.goalValue + " " + habit.goalUnit 
                } 
              }
            )}>
              <Text style={styles.checkmarkText}>✔</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.bottomNavContent}>
          <TouchableOpacity>
            <Image source={require("../../assets/images/homelogo.svg")} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tabs/Explore")}>
            <Image source={require("../../assets/images/directionlogo.svg")} style={styles.navIcon} />
          </TouchableOpacity>
          
          <View style={styles.navAddButtonWrapper}>
            <TouchableOpacity 
              style={styles.navAddButton}
              onPress={() => router.push("/tabs/CreateHabits")}
            >
              <Image
                source={require("../../assets/images/Shape.svg")}
                style={styles.navAddCircle}
              />
              <Image
                source={require("../../assets/images/Shape-1.svg")}
                style={styles.navAddIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Image source={require("../../assets/images/awardslogo.svg")} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../../assets/images/profilelogo.svg")} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 15,
  },
  bottomNavContent: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  navAddButtonWrapper: {
    position: "relative",
    width: 70,
    height: 70,
  },
  navAddButton: {
    position: "absolute",
    top: 0, // Changed from -35 to -20 for better alignment
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  navAddCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#7948FF",
  },
  navAddIcon: {
    position: "absolute",
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: "#fff",
  },
});
