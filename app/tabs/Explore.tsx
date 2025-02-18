import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
} from "firebase/firestore";

interface FirestoreUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isFriend?: boolean;
}

export default function ExploreScreen() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [usersList, setUsersList] = useState<FirestoreUser[]>([]);
  const [myFriends, setMyFriends] = useState<string[]>([]);

  const currentUser = auth.currentUser;

  const fetchAllUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const allUsers: FirestoreUser[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          profilePicture: data.profilePicture || "",
          isFriend: false,
        };
      });

      const filtered = allUsers.filter((u) => u.id !== currentUser?.uid);

      setUsersList(filtered);
    } catch (error) {
      console.log("Error fetching all users:", error);
    }
  };

  const fetchMyFriends = async () => {
    if (!currentUser) return;
    try {
      const myFriendsSnap = await getDocs(
        collection(db, "users", currentUser.uid, "friends")
      );
      const friendIds = myFriendsSnap.docs.map((doc) => doc.id);
      setMyFriends(friendIds);
    } catch (error) {
      console.log("Error fetching my friends:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchMyFriends();
  }, []);

  useEffect(() => {
    const updated = usersList.map((user) => ({
      ...user,
      isFriend: myFriends.includes(user.id),
    }));
    setUsersList(updated);
  }, [myFriends]);

  const handleAddFriend = async (otherUser: FirestoreUser) => {
    if (!currentUser) return;

    try {
      const myUid = currentUser.uid;
      const friendUid = otherUser.id;

      await setDoc(
        doc(db, "users", myUid, "friends", friendUid),
        {
          friendId: friendUid,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          profilePicture: otherUser.profilePicture || "",
        },
        { merge: true }
      );

      let myData = {
        friendId: myUid,
        firstName: "Me",
        lastName: "",
        profilePicture: "",
      };
      const myDocSnap = await getDoc(doc(db, "users", myUid));
      if (myDocSnap.exists()) {
        const me = myDocSnap.data();
        myData = {
          friendId: myUid,
          firstName: me.firstName || "",
          lastName: me.lastName || "",
          profilePicture: me.profilePicture || "",
        };
      }

      await setDoc(
        doc(db, "users", friendUid, "friends", myUid),
        myData,
        { merge: true }
      );

      setMyFriends((prev) => [...prev, friendUid]);
    } catch (error) {
      console.log("Error adding friend:", error);
    }
  };

  const getDisplayName = (user: FirestoreUser) =>
    (user.firstName + " " + user.lastName).trim();

  const filteredUsers = usersList.filter((u) =>
    getDisplayName(u).toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.friendsContainer}>
        {filteredUsers.map((user) => {
          const displayName = getDisplayName(user);

          return (
            <View key={user.id} style={styles.friendCard}>
              <View style={styles.friendInfo}>
                {user.profilePicture ? (
                  <Image
                    source={{ uri: user.profilePicture }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/profile-avatar.svg")}
                    style={styles.avatarImage}
                  />
                )}
                <Text style={styles.friendName}>{displayName}</Text>
              </View>

              <View style={styles.rightIconContainer}>
                {user.isFriend ? (
                  <View style={[styles.iconBox, styles.greenBorder]}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.iconBox}
                    onPress={() => handleAddFriend(user)}
                  >
                    <Text style={styles.plusMark}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

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
            style={[styles.navIcon, styles.activeNavIcon]}
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
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#232323",
    marginBottom: 10,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7ED",
    padding: 10,
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
  friendsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 10,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "space-between",
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
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
    resizeMode: "cover",
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  rightIconContainer: {
    flexDirection: "row",
  },
  iconBox: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#E5E7ED",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greenBorder: {
    borderColor: "#63BF7C",
  },
  checkMark: {
    fontSize: 18,
    color: "#63BF7C",
    fontWeight: "bold",
  },
  plusMark: {
    fontSize: 20,
    color: "#333",
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
