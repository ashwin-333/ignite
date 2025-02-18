import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

interface Habit {
  id: string;
  name: string;
  icon: string;
  goal: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFirstName(userDoc.data()?.firstName || "User");
        }

        const habitsRef = collection(db, "users", user.uid, "habits");
        const habitsSnapshot = await getDocs(habitsRef);
        const userHabits = habitsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Habit[];
        setHabits(userHabits);
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.greeting}>
          Hi, {firstName || "User"} <Text style={{ fontSize: 24 }}>👋</Text>
        </Text>
        <Text style={styles.subtitle}>Let's make habits together!</Text>
      </View>

      <View style={styles.habitsSection}>
        <Text style={styles.habitsTitle}>Habits</Text>
      </View>

      <ScrollView contentContainerStyle={styles.habitsContainer}>
        {habits.map((habit) => (
          <View key={habit.id} style={styles.habitCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.habitEmoji}>{habit.icon}</Text>
              <View style={styles.habitTextContainer}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitGoal}>{habit.goal}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkWrapper}
              onPress={() =>
                router.push({
                  pathname: "/tabs/HeatMap",
                  params: {
                    habitName: habit.name,
                    details: habit.goal,
                  },
                })
              }
            >
              <Text style={styles.checkText}>✔</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/tabs/Home")}>
          <Image
            source={require("../../assets/images/homelogo.svg")}
            style={[styles.navIcon, styles.activeNavIcon]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/tabs/Explore")}>
          <Image
            source={require("../../assets/images/directionlogo.svg")}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/tabs/CreateHabits")}>
          <Image
            source={require("../../assets/images/Shape.svg")}
            style={styles.plusCircle}
          />
          <Image
            source={require("../../assets/images/Shape-1.svg")}
            style={styles.plusIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/tabs/Leaderboards")}>
          <Image
            source={require("../../assets/images/awardslogo.svg")}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/tabs/Profile")}>
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
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F7FE",
  },
  topContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  habitsSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  habitsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  habitsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  habitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  habitEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  habitTextContainer: {
    flexDirection: "column",
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  habitGoal: {
    fontSize: 14,
    color: "#777",
  },
  checkWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E7F9EE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C3ECC8",
  },
  checkText: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
  bottomNav: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  activeNavIcon: {
    tintColor: "#4A60FF",
  },
  plusCircle: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  plusIcon: {
    position: "absolute",
    width: 22,
    height: 22,
    resizeMode: "contain",
    tintColor: "#fff",
    left: 13,
    top: 13,
  },
});
