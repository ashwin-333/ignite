import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function CreateHabit() {
  const router = useRouter();

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState({ icon: "💧", name: "Water" });
  const [selectedColor, setSelectedColor] = useState({ color: "#90EE90", name: "Light Green" });
  const [habitName, setHabitName] = useState("Drink Water");
  const [habitGoal, setHabitGoal] = useState("2000 ML");
  const [habitPoints, setHabitPoints] = useState("");
  const [pointsError, setPointsError] = useState("");

  const icons = [
    { icon: "💧", name: "Water" },
    { icon: "🏃", name: "Running" },
    { icon: "📚", name: "Reading" },
    { icon: "🧘", name: "Meditation" },
    { icon: "💪", name: "Exercise" },
    { icon: "🌿", name: "Plants" },
    { icon: "🎨", name: "Art" },
    { icon: "🎵", name: "Music" },
    { icon: "✍️", name: "Writing" },
    { icon: "🌅", name: "Morning" },
  ];

  const colors = [
    { color: "#90EE90", name: "Light Green" },
    { color: "#87CEEB", name: "Sky Blue" },
    { color: "#FFB6C1", name: "Light Pink" },
    { color: "#DDA0DD", name: "Plum" },
    { color: "#F0E68C", name: "Khaki" },
    { color: "#98FB98", name: "Pale Green" },
    { color: "#7948FF", name: "Purple" },
    { color: "#FF6B6B", name: "Coral" },
  ];

  // This function only allows numeric input and limits the value to a maximum of 10.
  const handlePointsChange = (value: string) => {
    // Remove any non-numeric characters
    let numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue !== "" && parseInt(numericValue, 10) > 10) {
      setPointsError("Maximum points is 10");
      // Optionally, clamp the value to 10
      setHabitPoints("10");
    } else {
      setPointsError("");
      setHabitPoints(numericValue);
    }
  };

  const saveHabitToFirebase = async () => {
    // Validate that the points field is provided
    if (!habitPoints) {
      setPointsError("Points field is required");
      return;
    }
    if (parseInt(habitPoints, 10) > 10) {
      setPointsError("Maximum points is 10");
      return;
    }
    setPointsError("");

    const user = auth.currentUser;
    if (user) {
      try {
        const habitsRef = collection(db, "users", user.uid, "habits");
        await addDoc(habitsRef, {
          name: habitName,
          icon: selectedIcon.icon,
          iconName: selectedIcon.name,
          color: selectedColor.color,
          colorName: selectedColor.name,
          goal: habitGoal,
          timesDone: 0,
          habitPoints: parseInt(habitPoints, 10),
        });
        console.log("Habit added successfully!");
        router.push("/tabs/Home");
      } catch (error) {
        console.error("Error adding habit:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topHeader}>
        <TouchableOpacity 
          onPress={() => router.push("/tabs/Home")} 
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Create Custom Habit</Text>
      </View>
      <ScrollView style={styles.contentContainer} bounces={false}>
        <Text style={styles.label}>NAME</Text>
        <TextInput 
          style={styles.input} 
          value={habitName}
          onChangeText={setHabitName}
          placeholder="Enter habit name"
          placeholderTextColor="#666"
        />
        <Text style={styles.label}>GOAL</Text>
        <TextInput 
          style={styles.input} 
          value={habitGoal}
          onChangeText={setHabitGoal}
          placeholder="Enter goal (e.g., 2000 ML, 10000 steps)"
          placeholderTextColor="#666"
        />
        <Text style={styles.label}>ICON AND COLOR</Text>
        <View style={styles.selectionRow}>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => setShowIconPicker(true)}
          >
            <Text style={styles.dropIcon}>{selectedIcon.icon}</Text>
            <View>
              <Text style={styles.selectionTitle}>{selectedIcon.name}</Text>
              <Text style={styles.selectionSubtitle}>Icon</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => setShowColorPicker(true)}
          >
            <View style={[styles.colorCircle, { backgroundColor: selectedColor.color }]} />
            <View>
              <Text style={styles.selectionTitle}>{selectedColor.name}</Text>
              <Text style={styles.selectionSubtitle}>Color</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>POINTS</Text>
        <TextInput
          style={styles.input}
          value={habitPoints}
          onChangeText={handlePointsChange}
          placeholder="Enter points (e.g., 10)"
          placeholderTextColor="#666"
          keyboardType="numeric"
        />
        {pointsError ? <Text style={styles.errorText}>{pointsError}</Text> : null}
        <TouchableOpacity style={styles.addButton} onPress={saveHabitToFirebase}>
          <Text style={styles.addButtonText}>Add Habit</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={showIconPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Icon</Text>
            <ScrollView>
              <View style={styles.iconGrid}>
                {icons.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.iconItem}
                    onPress={() => {
                      setSelectedIcon(item);
                      setShowIconPicker(false);
                    }}
                  >
                    <Text style={styles.iconText}>{item.icon}</Text>
                    <Text style={styles.iconName}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowIconPicker(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Color</Text>
            <ScrollView>
              <View style={styles.colorGrid}>
                {colors.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.colorItem}
                    onPress={() => {
                      setSelectedColor(item);
                      setShowColorPicker(false);
                    }}
                  >
                    <View style={[styles.colorSample, { backgroundColor: item.color }]} />
                    <Text style={styles.colorName}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F7FE", 
  },
  topHeader: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backArrow: {
    fontSize: 20,
    color: "#333",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#232323",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 6,
    marginTop: 24,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
    paddingVertical: 5,
    color: "#333",
  },
  selectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "48%",
    borderWidth: 1,
    borderColor: "#E5E7ED",
  },
  dropIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectionSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#4A60FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 40,
    marginBottom: -10,
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  iconItem: {
    width: "30%",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  iconText: {
    fontSize: 24,
    marginBottom: 5,
  },
  iconName: {
    fontSize: 12,
    color: "#666",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  colorItem: {
    width: "30%",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  colorSample: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  colorName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  modalCloseButton: {
    backgroundColor: "#4A60FF",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  modalCloseText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
  },
});
