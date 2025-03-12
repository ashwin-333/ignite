import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Svg, Rect, Path } from "react-native-svg";

/* ----------------- BACK BUTTON SVG ------------------ */
function BackButtonSvg({ width = 60, height = 60 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 48 48" fill="none">
      <Rect x="0.5" y="0.5" width="47" height="47" rx="15.5" fill="white" />
      <Rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#EAECF0" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.9315 27.9596C27.1647 28.1969 27.1655 28.5824 26.9333 28.8207C26.7221 29.0374 26.391 29.0577 26.1573 28.8814L26.0904 28.8226L21.2824 23.9319C21.0697 23.7155 21.0504 23.3761 21.2244 23.1373L21.2824 23.069L26.0903 18.1775C26.3236 17.9402 26.701 17.941 26.9332 18.1792C27.1444 18.3959 27.1629 18.7342 26.9893 18.9722L26.9315 19.0403L22.5479 23.5006L26.9315 27.9596Z"
        fill="#040415"
      />
    </Svg>
  );
}

/* -------------- STREAK AWARD SCREEN -------------- */
export default function StreakAward() {
  const router = useRouter();
  const { streak } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/tabs/Home")}
      >
        <BackButtonSvg width={45} height={45} />
      </TouchableOpacity>

      {/* Medal Image */}
      <View style={styles.medalContainer}>
        <Image
          source={require("../../assets/images/accomplishment.png")}
          style={styles.medalImage}
        />
      </View>

      {/* Text content */}
      <Text style={styles.congratulationsText}>Congratulations!</Text>
      <Text style={styles.descriptionText}>
        You reached a streak of {streak} day{streak === "1" ? "" : "s"}!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC148",
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 999,
  },
  medalContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  medalImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  congratulationsText: {
    fontSize: 28,
    fontFamily: "OpenSans-Bold",
    color: "#FFF",
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 22,
    fontFamily: "OpenSans-Bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
  },
});
