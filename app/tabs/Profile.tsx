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
  deleteDoc,
} from "firebase/firestore";

interface Friend {
  friendId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);

  // 1) Fetch current user's profile info
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFirstName(data.firstName || "User");
        setLastName(data.lastName || "");
        setProfilePicture(data.profilePicture || "");
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
      const friendList: Friend[] = snapshot.docs.map((doc) => {
        const friendData = doc.data();
        return {
          friendId: doc.id,
          firstName: friendData.firstName || "Unknown",
          lastName: friendData.lastName || "",
          profilePicture: friendData.profilePicture || "",
        };
      });
      setFriends(friendList);
    };

    fetchFriends();
  }, []);

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

  const displayName = `${firstName} ${lastName}`.trim() || "User";

  return (
    <View style={styles.screenContainer}>
      {/* TOP CONTAINER */}
      <View style={styles.topContainer}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Your Profile</Text>
          <TouchableOpacity
            style={styles.logoutButtonBox}
            onPress={() => router.push("/")} // route to root
          >
            <Image
              source={require("../../assets/images/logout.svg")}
              style={styles.logoutIcon}
            />
          </TouchableOpacity>
        </View>

        {/* User Info */}
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
              <Text style={styles.pointsText}>1452 Points</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabPill}>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
            <Text style={styles.activeTabText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>Achievements</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FRIENDS LIST */}
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
                  {/* Static points for now */}
                  <Text style={styles.friendPoints}>912 Points</Text>
                </View>
              </View>
              {/* Trash button => remove friend mutually */}
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

      {/* OVAL BOTTOM NAV */}
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
        <TouchableOpacity onPress={() => router.push("/tabs/StreakAward")}>
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

/* ------------------ STYLES ------------------ */
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
