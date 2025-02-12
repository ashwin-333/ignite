import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

const users = [
  { name: "Suhas", added: true },
  { name: "Ashwin", added: false },
  { name: "Hemanth", added: false },
];

export default function Explore() {
  const router = useRouter(); // For navigation
  const [activeTab, setActiveTab] = useState("Explore"); // State for active tab
  const [searchText, setSearchText] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNavigate = (screen: string) => {
    setActiveTab(screen);
    if (screen === "Home") {
      router.push("/tabs/Home");
    } else if (screen === "Explore") {
      router.push("/tabs/Explore");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* User List */}
      <ScrollView contentContainerStyle={styles.userList}>
        {filteredUsers.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <View style={styles.profilePicture}>
              <Text style={styles.profileText}>{user.name[0]}</Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <TouchableOpacity
              style={[
                styles.actionButton,
                user.added ? styles.addedButton : styles.addButton,
              ]}
            >
              <Text style={user.added ? styles.addedText : styles.addText}>
                {user.added ? "✔" : "+"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => handleNavigate("Home")}>
          <Image
            source={require("../../assets/images/homelogo.svg")}
            style={[
              styles.navIcon,
              activeTab === "Home" && styles.activeNavIcon,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("Explore")}>
          <Image
            source={require("../../assets/images/directionlogo.svg")}
            style={[
              styles.navIcon,
              activeTab === "Explore" && styles.activeNavIcon,
            ]}
          />
        </TouchableOpacity>

        {/* Add Button */}
        <View style={styles.navAddButtonWrapper}>
          <TouchableOpacity style={styles.navAddButton}>
            <Image
              source={require("../../assets/images/Shape.svg")}
              style={styles.navAddCircle}
            />
            <Image
              source={require("../../assets/images/Shape-1.svg")} // Ensure this is the correct image path for the plus icon
              style={styles.navAddIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Image
            source={require("../../assets/images/awardslogo.svg")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    padding: 10,
    backgroundColor: "#F5F5F5",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userList: {
    padding: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  addText: {
    fontSize: 18,
    color: "#666",
  },
  addedButton: {
    backgroundColor: "#E8F5E9",
    borderColor: "#66BB6A",
    borderWidth: 1,
  },
  addedText: {
    fontSize: 18,
    color: "#66BB6A",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  activeNavIcon: {
    tintColor: "#7948FF",
  },
  navAddButtonWrapper: {
    position: "relative",
    width: 70,
    height: 70,
  },
  navAddButton: {
    position: "absolute",
    top: 0,
    left: 0,
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
  },
});
