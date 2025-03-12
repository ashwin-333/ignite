import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

/* ------------- Leaderboard Screen ------------- */
export default function Leaderboards() {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<
    Array<{ rank: number; name: string; points: number }>
  >([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get current user's friends
      const friendsRef = collection(db, "users", user.uid, "friends");
      const friendsSnapshot = await getDocs(friendsRef);
      
      // Get points data for friends and current user
      const pointsPromises = [
        // Include current user
        getDoc(doc(db, "users", user.uid)).then(doc => ({
          id: user.uid,
          name: doc.data()?.firstName || "User",
          points: doc.data()?.userPoints || 0
        })),
        // Get friends' data
        ...friendsSnapshot.docs.map(async (friendDoc) => {
          const friendId = friendDoc.id;
          const userDoc = await getDoc(doc(db, "users", friendId));
          return {
            id: friendId,
            name: userDoc.data()?.firstName || "User",
            points: userDoc.data()?.userPoints || 0
          };
        })
      ];

      const usersData = await Promise.all(pointsPromises);

      // Sort by points and add ranks
      const rankedData = usersData
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          rank: index + 1,
          name: user.name,
          points: user.points
        }));

      setLeaderboardData(rankedData);

    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const currentData = leaderboardData;
  const topThree = currentData.slice(0, 3);
  const others = currentData.slice(3);

  return (
    <View style={styles.screenContainer}>

      {/* WHITE TOP BAR, LEFT-ALIGNED TITLE */}
      <View style={styles.topBarContainer}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      {/* Gradient background for main content */}
      <LinearGradient
        colors={["#001908", "#7948FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* TOP 3 */}
          <View style={styles.topThreeContainer}>
            {/* 2ND PLACE */}
            <View style={[styles.topItemWrapper, styles.secondPlacePosition]}>
              <Image
                source={require("../../assets/images/Default_pfp.svg.png")}
                style={styles.profilePic}
              />
              <Text style={styles.nameText}>
                {topThree[1]?.name || "User"}
              </Text>
              <Image
                source={require("../../assets/images/2nd.svg")}
                style={styles.rankShape}
              />
              <View style={styles.medalBox}>
                <Image
                  source={require("../../assets/images/medal.svg")}
                  style={styles.medalIcon}
                />
                <Text style={styles.medalText}>
                  {topThree[1]?.points ?? "--"}
                </Text>
              </View>
            </View>

            {/* 1ST PLACE */}
            <View style={[styles.topItemWrapper, styles.firstPlacePosition]}>
              <Image
                source={require("../../assets/images/crown.svg")}
                style={styles.crown}
              />
              <Image
                source={require("../../assets/images/Default_pfp.svg.png")}
                style={styles.profilePic}
              />
              <Text style={styles.nameText}>
                {topThree[0]?.name || "User"}
              </Text>
              <Image
                source={require("../../assets/images/1st.svg")}
                style={styles.rankShape}
              />
              <View style={styles.medalBox}>
                <Image
                  source={require("../../assets/images/medal.svg")}
                  style={styles.medalIcon}
                />
                <Text style={styles.medalText}>
                  {topThree[0]?.points ?? "--"}
                </Text>
              </View>
            </View>

            {/* 3RD PLACE */}
            <View style={[styles.topItemWrapper, styles.thirdPlacePosition]}>
              <Image
                source={require("../../assets/images/Default_pfp.svg.png")}
                style={styles.profilePic}
              />
              <Text style={styles.nameText}>
                {topThree[2]?.name || "User"}
              </Text>
              <Image
                source={require("../../assets/images/3rd.svg")}
                style={styles.rankShape}
              />
              <View style={styles.medalBox}>
                <Image
                  source={require("../../assets/images/medal.svg")}
                  style={styles.medalIcon}
                />
                <Text style={styles.medalText}>
                  {topThree[2]?.points ?? "--"}
                </Text>
              </View>
            </View>
          </View>

          {/* Other Rankings */}
          <View style={styles.cardList}>
            {others.map((user) => (
              <View key={user.rank} style={styles.userCard}>
                <Text style={styles.userRank}>{user.rank}</Text>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userPoints}>{user.points} Points</Text>
                </View>
                <Image
                  source={require("../../assets/images/Default_pfp.svg.png")}
                  style={styles.userAvatar}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/tabs/Home")}>
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
            style={[styles.navIcon, styles.activeNavIcon]}
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

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  /* TOP BAR */
  topBarContainer: {
    backgroundColor: "#FFF",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "OpenSans-Bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "left",
  },
  /* MAIN GRADIENT AREA */
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 120,
  },
  /* TOP THREE */
  topThreeContainer: {
    width: "100%",
    height: 200,
  },
  topItemWrapper: {
    position: "absolute",
    width: 90,
    height: 160,
    alignItems: "center",
  },
  secondPlacePosition: {
    left: "10%",
    bottom: -20,
  },
  firstPlacePosition: {
    alignSelf: "center",
    bottom: 9,
  },
  thirdPlacePosition: {
    right: "10%",
    bottom: -25,
  },
  rankShape: {
    resizeMode: "contain",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    top: 0,
  },
  nameText: {
    marginTop: 60,
    marginBottom: 10,
    fontFamily: "OpenSans-Medium",
    fontSize: 14,
    color: "#fff",
  },
  crown: {
    position: "absolute",
    top: -30,
    width: 25,
    height: 25,
    resizeMode: "contain",
    zIndex: 1,
  },
  medalBox: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FFF3DA",
  },
  medalIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginRight: 2,
  },
  medalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 11,
    color: "#FEA800",
  },
  /* CARDS */
  cardList: {
    width: "90%",
    marginTop: 80,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
  },
  userRank: {
    fontFamily: "OpenSans-Medium",
    fontSize: 16,
    color: "#7948FF",
    width: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  userName: {
    fontFamily: "OpenSans-Medium",
    fontSize: 16,
    color: "#000",
  },
  userPoints: {
    fontFamily: "OpenSans-Medium",
    fontSize: 14,
    color: "#666",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  /* BOTTOM NAV */
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
