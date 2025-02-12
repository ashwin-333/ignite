import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Svg, Rect, Path } from "react-native-svg";

// Inline back-button SVG
function BackButtonSvg({ width = 60, height = 60 }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
    >
      <Rect x="0.5" y="0.5" width="47" height="47" rx="15.5" fill="white" />
      <Rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="15.5"
        stroke="#EAECF0"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.9315 27.9596C27.1647 28.1969 27.1655 28.5824 26.9333 28.8207C26.7221 29.0374 26.391 29.0577 26.1573 28.8814L26.0904 28.8226L21.2824 23.9319C21.0697 23.7155 21.0504 23.3761 21.2244 23.1373L21.2824 23.069L26.0903 18.1775C26.3236 17.9402 26.701 17.941 26.9332 18.1792C27.1444 18.3959 27.1629 18.7342 26.9893 18.9722L26.9315 19.0403L22.5479 23.5006L26.9315 27.9596Z"
        fill="#040415"
      />
    </Svg>
  );
}

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];
const REAL_CURRENT_YEAR = new Date().getFullYear();
const MAX_WEEKS = 5; // 7×5 matrix

// Build a 7×5 matrix for each month: [dayOfWeek][weekIndex].
function buildCalendarMatrix(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

  const matrix = Array.from({ length: 7 }, () => Array(MAX_WEEKS).fill(null));
  for (let week = 0; week < MAX_WEEKS; week++) {
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const dayNum = week * 7 + dayOfWeek - firstDayOfWeek + 1;
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        matrix[dayOfWeek][week] = dayNum;
      }
    }
  }
  return matrix;
}

export default function HeatMapScreen() {
  const router = useRouter();
  const { habitName, details } = useLocalSearchParams();

  // Default year: 2025
  const [currentYear, setCurrentYear] = useState(2025);

  // Year nav
  const handlePrevYear = () => setCurrentYear((y) => y - 1);
  const handleNextYear = () => {
    if (currentYear < REAL_CURRENT_YEAR) {
      setCurrentYear((y) => y + 1);
    }
  };
  const disableNextArrow = currentYear >= REAL_CURRENT_YEAR;

  // Render the 12 months
  const renderMonths = () => {
    return MONTH_NAMES.map((monthName, monthIndex) => {
      const matrix = buildCalendarMatrix(currentYear, monthIndex);

      return (
        <View key={monthIndex} style={styles.monthWrapper}>
          <Text style={styles.monthTitle}>{monthName}</Text>
          {matrix.map((weekArray, dayOfWeek) => (
            <View style={styles.dayRow} key={dayOfWeek}>
              {weekArray.map((dayNum, weekIdx) => {
                // Only show green squares if it's 2025
                let isCompleted = false;
                if (currentYear === 2025 && dayNum != null) {
                  // Jan 1–24
                  if (monthIndex === 0 && dayNum <= 24) {
                    isCompleted = true;
                  }
                  // Feb 10–15
                  if (monthIndex === 1 && dayNum >= 10 && dayNum <= 15) {
                    isCompleted = true;
                  }
                }
                const isOutOfMonth = dayNum == null;

                return (
                  <View
                    key={weekIdx}
                    style={[
                      styles.square,
                      isOutOfMonth && styles.outOfMonthSquare,
                      isCompleted && styles.completedSquare
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      );
    });
  };

  return (
    <View style={styles.screenContainer}>

      {/* Header with inline SVG back-button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {/* Increase the back button size by updating these props */}
          <BackButtonSvg width={45} height={45} />
        </TouchableOpacity>

        {/* Left-aligned habit title/subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.habitTitle}>{habitName}</Text>
          <Text style={styles.habitSubtitle}>{details}</Text>
        </View>
      </View>

      {/* We'll use flex for the main content so we can pin the delete button to bottom */}
      <View style={styles.contentContainer}>
        {/* Year nav */}
        <View style={styles.yearNav}>
          <TouchableOpacity onPress={handlePrevYear}>
            <Text style={styles.yearArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.yearText}>{currentYear}</Text>
          <TouchableOpacity
            onPress={handleNextYear}
            disabled={disableNextArrow}
            style={disableNextArrow && { opacity: 0.6 }}
          >
            <Text
              style={[
                styles.yearArrow,
                disableNextArrow && { color: "#999" }
              ]}
            >
              {">"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Heatmap */}
        <View style={styles.heatmapContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={styles.monthsScrollContent}
          >
            {renderMonths()}
          </ScrollView>
        </View>

        {/* Streak info right under heatmap */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>Longest Streak: 24 🔥</Text>
          <Text style={styles.streakText}>Current Streak: 6</Text>
        </View>
      </View>

      {/* Delete button pinned at bottom with spacing */}
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
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
    paddingBottom: 20, // extra space so scrollbar won't overlap squares
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
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FFF",
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
    marginBottom: 30, // spacing from bottom
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

