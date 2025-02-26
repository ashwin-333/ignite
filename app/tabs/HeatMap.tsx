interface DayObject {
  day: number;
  completed: boolean;
}
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc, getDocs } from "firebase/firestore";
import { Svg, Rect, Path } from "react-native-svg";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
// Back Button Component
function BackButtonSvg({ width = 60, height = 60 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 48 48" fill="none">
      <Rect x="0.5" y="0.5" width="47" height="47" rx="15.5" fill="white" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.9315 27.9596C27.1647 28.1969 27.1655 28.5824 26.9333 28.8207C26.7221 29.0374 26.391 29.0577 26.1573 28.8814L26.0904 28.8226L21.2824 23.9319C21.0697 23.7155 21.0504 23.3761 21.2244 23.1373L21.2824 23.069L26.0903 18.1775C26.3236 17.9402 26.701 17.941 26.9332 18.1792C27.1444 18.3959 27.1629 18.7342 26.9893 18.9722L26.9315 19.0403L22.5479 23.5006L26.9315 27.9596Z"
        fill="#040415"
      />
    </Svg>
  );
}

// Constants
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_IN_WEEK = 7;

// Build the calendar matrix for rendering the heatmap
function buildCalendarMatrix(
  year: number,
  monthIndex: number,
  completedDatesSet: Set<string>
): (DayObject | null)[][] {  // This tells TypeScript the matrix contains DayObjects or null
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

  const matrix = Array.from(
    { length: Math.ceil((daysInMonth + firstDayOfWeek) / 7) },
    () => Array.from({ length: 7 }, (): DayObject | null => null)
  ) as (DayObject | null)[][];

  let dayCounter = 1;
  for (let week = 0; week < matrix.length; week++) {
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (week === 0 && dayOfWeek < firstDayOfWeek) continue;
      if (dayCounter <= daysInMonth) {
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
        matrix[week][dayOfWeek] = {
          day: dayCounter,
          completed: completedDatesSet.has(dateStr),
        };
        dayCounter++;
      }
    }
  }

  return matrix;
}



// Calculate streaks
function calculateStreaks(completedDatesArray) {
  const dates = completedDatesArray.map(date => new Date(date)).sort((a, b) => a - b);
  let longestStreak = 0, currentStreak = 0, tempStreak = 1;
  const today = new Date().setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    if (i > 0) {
      const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  if (dates.length && (today - dates[dates.length - 1].setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24) <= 1) {
    currentStreak = tempStreak;
  }

  return { longestStreak, currentStreak };
}

export default function HeatMapScreen() {
  const router = useRouter();
  const { habitId, habitName, details } = useLocalSearchParams();

  const [completedDates, setCompletedDates] = useState([]);
  const [streaks, setStreaks] = useState({ longestStreak: 0, currentStreak: 0 });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchHabitData = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      try {
        // 2) Use 'collection(db, ...)' to reference user’s habits
        const habitsRef = collection(db, "users", user.uid, "habits");
        const querySnapshot = await getDocs(habitsRef);

        let habitFound = false;

        querySnapshot.forEach((docSnap) => {
          if (docSnap.id === habitId) {
            habitFound = true;
            const { completedDates = [] } = docSnap.data();
            setCompletedDates(completedDates);
            setStreaks(calculateStreaks(completedDates));
          }
        });

        if (!habitFound) {
          Alert.alert("Error", "Habit not found");
        }
      } catch (error) {
        console.error("Failed to fetch habit data:", error);
      }
    };

    fetchHabitData();
  }, [habitId]);

  const handleDeleteHabit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }
    try {
      // 3) Use 'doc(db, ...)' to reference the specific document to delete
      const habitRef = doc(db, `users/${user.uid}/habits/${habitId}`);
      await deleteDoc(habitRef);
      Alert.alert("Success", "Habit deleted successfully");
      router.push("/tabs/Home");
    } catch (error) {
      console.error("Error deleting habit:", error);
      Alert.alert("Error", "Failed to delete habit.");
    }
  };

  

  const renderMonths = () => {
    const completedDatesSet = new Set(completedDates);

    return MONTH_NAMES.map((monthName, monthIndex) => {
      const matrix = buildCalendarMatrix(currentYear, monthIndex, completedDatesSet);
      
      return (
        <View key={monthIndex} style={styles.monthWrapper}>
          <Text style={styles.monthTitle}>{monthName}</Text>
          {matrix.map((week, rowIdx) => (
            <View style={styles.dayRow} key={rowIdx}>
              {week.map((dayObj: DayObject | null, colIdx) => (
                <View
                  key={colIdx}
                  style={[
                    styles.square,
                    dayObj?.completed ? styles.completedSquare : null,
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      );
    });
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackButtonSvg width={45} height={45} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.habitTitle}>{habitName}</Text>
          <Text style={styles.habitSubtitle}>{details}</Text>
        </View>
      </View>

      {/* Year Navigation */}
      <View style={styles.yearNav}>
        <TouchableOpacity onPress={() => setCurrentYear((y) => y - 1)}>
          <Text style={styles.yearArrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.yearText}>{currentYear}</Text>
        <TouchableOpacity
          onPress={() => setCurrentYear((y) => y + 1)}
          disabled={currentYear >= new Date().getFullYear()}
          style={currentYear >= new Date().getFullYear() && { opacity: 0.5 }}
        >
          <Text style={styles.yearArrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Heatmap */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthsScrollContent}
      >
        {renderMonths()}
      </ScrollView>

      {/* Streaks */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>🔥 Longest Streak: {streaks.longestStreak}</Text>
        <Text style={styles.streakText}>💪 Current Streak: {streaks.currentStreak}</Text>
      </View>

      {/* Delete Habit */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteHabit}>
        <Text style={styles.deleteButtonText}>Delete Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: 25,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 50,
    height: 60,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  habitSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "left",
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  yearNav: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingVertical: 10,
  },
  yearArrow: {
    fontSize: 20,
    color: "#000",
    paddingHorizontal: 12,
  },
  yearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  heatmapContainer: {
    maxHeight: 220,
    marginHorizontal: 20,
  },
  monthsScrollContent: {
    alignItems: "flex-start",
    paddingRight: 40,
    paddingBottom: 20,
  },
  monthWrapper: {
    alignItems: "center",
    marginRight: 40,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  dayRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  square: {
    width: 16,
    height: 16,
    backgroundColor: "#E0E0E0",
    marginRight: 3,
    borderRadius: 2,
  },
  outOfMonthSquare: {
    backgroundColor: "#f5f7fb",
    borderWidth: 1,
    borderColor: "#f5f7fb",
  },
  completedSquare: {
    backgroundColor: "#C5ECB2",
  },
  streakContainer: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  streakText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 2,
  },
  deleteButton: {
    backgroundColor: "#E63946",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
