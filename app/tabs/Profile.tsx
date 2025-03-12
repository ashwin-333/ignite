import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

interface Friend {
  friendId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  friendPoints: number;
}

interface ActivityDoc {
  dateKey: string;
  type: string;
  points: number;
  timestamp: string;
  description: string;
  trend?: string;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  goal: string;
  timesDone?: number;
  doneDates?: string[];
  habitPoints?: number;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [myUserPoints, setMyUserPoints] = useState(0);

  // Removed "Achievements" from the type since it's no longer used.
  const [activeTab, setActiveTab] = useState<"Activity" | "Friends">("Friends");

  const [friends, setFriends] = useState<Friend[]>([]);

  const [activityItems, setActivityItems] = useState<ActivityDoc[]>([]);

  const [allHabits, setAllHabits] = useState<Habit[]>([]);

  // ---------------- 1) Fetch user’s doc
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setFirstName(data.firstName || "User");
        setLastName(data.lastName || "");
        setProfilePicture(data.profilePicture || "");
        setMyUserPoints(data.userPoints || 0);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const friendsRef = collection(db, "users", user.uid, "friends");
      const snapshot = await getDocs(friendsRef);

      const friendList: Friend[] = [];
      for (const docSnap of snapshot.docs) {
        const friendData = docSnap.data();
        const friendId = docSnap.id;

        let friendPoints = 0;
        const friendDocSnap = await getDoc(doc(db, "users", friendId));
        if (friendDocSnap.exists()) {
          friendPoints = friendDocSnap.data().userPoints || 0;
        }

        friendList.push({
          friendId,
          firstName: friendData.firstName || "Unknown",
          lastName: friendData.lastName || "",
          profilePicture: friendData.profilePicture || "",
          friendPoints,
        });
      }
      setFriends(friendList);
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchHabits = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const habitsRef = collection(db, "users", user.uid, "habits");
      const snap = await getDocs(habitsRef);

      const loaded = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Habit[];

      setAllHabits(loaded);
    };
    fetchHabits();
  }, []);

  useEffect(() => {
    fetchActivitySubcollection();
  }, []);

  const fetchActivitySubcollection = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const activitiesRef = collection(db, "users", user.uid, "activities");
    const snap = await getDocs(activitiesRef);

    const loaded: ActivityDoc[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      loaded.push({
        dateKey: docSnap.id, // "2023-06-24"
        type: data.type || "points",
        points: data.points || 0,
        timestamp: data.timestamp || "",
        description: data.description || "points earned!",
        trend: data.trend || "up",
      });
    });

    loaded.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    setActivityItems(loaded);
  };

  function getDateKey(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  function formatTime(isoString: string) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  }

  const handleRemoveFriend = async (friendUid: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "friends", friendUid));
      await deleteDoc(doc(db, "users", friendUid, "friends", currentUser.uid));
      setFriends((prev) => prev.filter((f) => f.friendId !== friendUid));
    } catch (error) {
      console.log("Error removing friend:", error);
    }
  };

  const handleUpdateActivity = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const now = new Date();
    const todayKey = getDateKey(now);

    let totalDailyPoints = 0;

    allHabits.forEach((habit) => {
      const doneDates = habit.doneDates || [];
      const habitPts = habit.habitPoints || 0;

      const completionsToday = doneDates.filter((iso) =>
        isSameDay(new Date(iso), now)
      ).length;

      totalDailyPoints += completionsToday * habitPts;
    });

    const activitiesRef = collection(db, "users", user.uid, "activities");
    const activityRef = doc(activitiesRef, todayKey);

    const docSnap = await getDoc(activityRef);
    const newTimestamp = now.toISOString();

    if (docSnap.exists()) {
      await updateDoc(activityRef, {
        points: totalDailyPoints,
        timestamp: newTimestamp,
      });
    } else {
      await setDoc(activityRef, {
        type: "points",
        points: totalDailyPoints,
        timestamp: newTimestamp,
        description: "points earned today",
        trend: "up",
      });
    }

    fetchActivitySubcollection();
  };

  const renderActivityTab = () => (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.updateActivityButton}
        onPress={handleUpdateActivity}
      >
        <Text style={styles.updateActivityButtonText}>Update Activity</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.friendsContainer}>
        <Text style={styles.friendsTitle}>Your Daily Points</Text>

        {activityItems.map((act) => {
          const dateObj = new Date(act.timestamp);
          const shortTime = formatTime(act.timestamp);

          const isToday = isSameDay(dateObj, new Date());

          return (
            <View key={act.dateKey} style={styles.friendCard}>
              <View style={styles.friendInfo}>
                <View>
                  <Text style={styles.friendName}>
                    {act.points} {act.points === 1 ? "Point" : "Points"}
                  </Text>
                  <Text style={styles.friendPoints}>
                    {isToday ? "Today" : act.dateKey}, {shortTime}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderFriendsTab = () => (
    <ScrollView contentContainerStyle={styles.friendsContainer}>
      <Text style={styles.friendsTitle}>{friends.length} Friends</Text>
      {friends.map((friend) => {
        const friendDisplayName = `${friend.firstName} ${friend.lastName}`.trim();
        return (
          <View key={friend.friendId} style={styles.friendCard}>
            <View style={styles.friendInfo}>
              <Image
                source={
                  friend.profilePicture
                    ? { uri: friend.profilePicture }
                    : require("../../assets/images/profile-avatar.svg")
                }
                style={styles.friendAvatar}
              />
              <View>
                <Text style={styles.friendName}>
                  {friendDisplayName || "Unknown"}
                </Text>
                <Text style={styles.friendPoints}>
                  {friend.friendPoints} Points
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.trashButtonBox}
              onPress={() => handleRemoveFriend(friend.friendId)}
            >
              <Image
                source={require("../../assets/images/trash.svg")}
                style={styles.trashIcon}
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );

  const displayName = `${firstName} ${lastName}`.trim() || "User";

  return (
    <View style={styles.screenContainer}>
      {/* TOP */}
      <View style={styles.topContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Your Profile</Text>
          <TouchableOpacity
            style={styles.logoutButtonBox}
            onPress={() => router.push("/")}
          >
            <Image
              source={require("../../assets/images/logout.svg")}
              style={styles.logoutIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoRow}>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : require("../../assets/images/profile-avatar.svg")
            }
            style={styles.profileImage}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{displayName}</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsMedal}>🏅</Text>
              <Text style={styles.pointsText}>{myUserPoints} Points</Text>
            </View>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabPill}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === "Activity" && styles.activeTab]}
            onPress={() => setActiveTab("Activity")}
          >
            <Text
              style={
                activeTab === "Activity" ? styles.activeTabText : styles.tabText
              }
            >
              Activity
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === "Friends" && styles.activeTab]}
            onPress={() => setActiveTab("Friends")}
          >
            <Text
              style={
                activeTab === "Friends" ? styles.activeTabText : styles.tabText
              }
            >
              Friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {activeTab === "Activity" && renderActivityTab()}
      {activeTab === "Friends" && renderFriendsTab()}

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
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/tabs/Profile")}>
          <Image
            source={require("../../assets/images/profilelogo.svg")}
            style={[styles.navIcon, styles.activeNavIcon]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// -------------- STYLES --------------
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F7FE",
  },
  topContainer: {
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#232323",
  },
  logoutButtonBox: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "#FFF3D0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  pointsMedal: {
    fontSize: 16,
    marginRight: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DAA520",
  },
  tabPill: {
    flexDirection: "row",
    backgroundColor: "#E5E7ED",
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  activeTabText: {
    color: "#4A60FF",
    fontWeight: "600",
  },
  friendsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  friendsTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  friendCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  friendPoints: {
    fontSize: 14,
    color: "#777",
  },
  trashButtonBox: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  trashIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  updateActivityButton: {
    backgroundColor: "#4A60FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  updateActivityButtonText: {
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
    tintColor: "#fff",
    left: 13,
    top: 13,
  },
});
