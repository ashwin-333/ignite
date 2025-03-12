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
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  increment,
  addDoc,
} from "firebase/firestore";
import { Snackbar, Button } from "@react-native-material/core";

interface Habit {
  id: string;
  name: string;
  icon: string;
  goal: string;
  timesDone?: number;
  doneDates?: string[];
  habitPoints?: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    color: "",
    isError: false,
  });

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSnackbar) {
      timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSnackbar]);

  // Compute consecutive streak using unique YYYY-MM-DD strings
  const computeStreak = (dates: string[]): number => {
    const uniqueDays = Array.from(new Set(dates.map((d) => d.split("T")[0])));
    uniqueDays.sort(); // Lexicographical sort works for YYYY-MM-DD
    let streak = 1;
    let currentDate = new Date(uniqueDays[uniqueDays.length - 1]);
    for (let i = uniqueDays.length - 2; i >= 0; i--) {
      const prevDate = new Date(uniqueDays[i]);
      const diff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
      if (diff === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const handleCompleteHabit = async (habit: Habit) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const habitRef = doc(db, "users", user.uid, "habits", habit.id);
      const newDate = new Date().toISOString();
      // Determine if this is the first completion for today
      const todayKey = newDate.split("T")[0];
      const doneDates = habit.doneDates || [];
      const isFirstForToday = !doneDates.some((date) => date.startsWith(todayKey));

      // Update the habit document
      await updateDoc(habitRef, {
        timesDone: increment(1),
        doneDates: arrayUnion(newDate),
      });

      // Update local state
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id === habit.id) {
            const updatedTimesDone = (h.timesDone || 0) + 1;
            const updatedDates = h.doneDates ? [...h.doneDates, newDate] : [newDate];
            return {
              ...h,
              timesDone: updatedTimesDone,
              doneDates: updatedDates,
            };
          }
          return h;
        })
      );

      setSnackbarMessage({
        text: `Completed "${habit.name}" ${(habit.timesDone || 0) + 1} times!`,
        color: "#4A60FF",
        isError: false,
      });
      setShowSnackbar(true);

      // If this is the first completion today, check for a streak achievement.
      if (isFirstForToday) {
        const updatedDates = [...doneDates, newDate];
        const newStreak = computeStreak(updatedDates);
        if ([1, 7, 30].includes(newStreak)) {
          try {
            let medal = "";
            if (newStreak === 1) medal = "🥉"; // Bronze for 1 day
            else if (newStreak === 7) medal = "🥈"; // Silver for 7 days
            else if (newStreak === 30) medal = "🥇"; // Gold for 30 days

            const achievementData = {
              title: `${habit.name} - ${newStreak} Day Streak`,
              date: new Date().toISOString(),
              icon: medal,
            };

            await addDoc(
              collection(db, "users", user.uid, "achievements"),
              achievementData
            );
          } catch (achievementError) {
            console.error("Error awarding achievement:", achievementError);
            // Even if awarding fails, we still proceed.
          }
          // Navigate to the streak award screen regardless of achievement write success.
          router.push({
            pathname: "/tabs/StreakAward",
            params: { streak: newStreak.toString() },
          });
        }
      }
    } catch (error) {
      console.error("Error completing habit:", error);
      setSnackbarMessage({
        text: "Failed to complete habit",
        color: "#ff4a4a",
        isError: true,
      });
      setShowSnackbar(true);
    }
  };

  return (
    <View style={styles.screenContainer}>
      {/* Top Container */}
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
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.calendarWrapper}
                onPress={() =>
                  router.push({
                    pathname: "/tabs/HeatMap",
                    params: { habitName: habit.name, details: habit.goal },
                  })
                }
              >
                <Text style={styles.calendarText}>📆</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.completeButton, { marginLeft: 12 }]}
                onPress={() => handleCompleteHabit(habit)}
              >
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
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
      {showSnackbar && (
        <Snackbar
          message={snackbarMessage.text}
          action={
            <Button
              variant="text"
              title="Dismiss"
              color="white"
              compact
              onPress={() => setShowSnackbar(false)}
            />
          }
          style={{
            backgroundColor: snackbarMessage.color,
            position: "absolute",
            start: 16,
            end: 16,
            bottom: 16,
          }}
        />
      )}
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
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF2FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ADC6FF",
  },
  calendarText: {
    fontSize: 20,
  },
  completeButton: {
    backgroundColor: "#4A60FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
