import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  SafeAreaView, 
  Modal, 
  ScrollView 
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

  // (Optional) You can later add state for frequency if you wish.
  // For now the UI displays a default frequency of "1 times" and "Daily" selected.

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

  // Save habit data to Firestore under the current user's habits collection.
  const saveHabitToFirebase = async () => {
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
          // You can also add frequency data here if you manage that with state.
          // For example: frequency: "Daily", count: 1
        });
        console.log("Habit added successfully!");
        router.push("/tabs/Home"); // Redirect to Home after saving the habit.
      } catch (error) {
        console.error("Error adding habit:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.push("/tabs/Home")} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>Create Custom Habit</Text>

        {/* Name Input */}
        <Text style={styles.label}>NAME</Text>
        <TextInput 
          style={styles.input} 
          value={habitName}
          onChangeText={setHabitName}
          placeholder="Enter habit name"
          placeholderTextColor="#666"
        />

        {/* Goal Input */}
        <Text style={styles.label}>GOAL</Text>
        <TextInput 
          style={styles.input} 
          value={habitGoal}
          onChangeText={setHabitGoal}
          placeholder="Enter goal (e.g., 2000 ML, 10000 steps)"
          placeholderTextColor="#666"
        />

        {/* Icon and Color Selection */}
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

        {/* Frequency Selection */}
        <Text style={styles.label}>FREQUENCY</Text>
        <View style={styles.frequencyContainer}>
          <View style={styles.frequencyCountContainer}>
            <Text style={styles.frequencyCount}>1 times</Text>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>▲</Text>
              <Text style={styles.arrow}>▼</Text>
            </View>
          </View>
          <View style={styles.frequencyOptions}>
            <TouchableOpacity style={[styles.frequencyButton, styles.frequencyButtonSelected]}>
              <Text style={styles.frequencyButtonText}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.frequencyButton}>
              <Text style={styles.frequencyButtonTextActive}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.frequencyButton}>
              <Text style={styles.frequencyButtonText}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Habit Button */}
        <TouchableOpacity style={styles.addButton} onPress={saveHabitToFirebase}>
          <Text style={styles.addButtonText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      {/* Icon Picker Modal */}
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

      {/* Color Picker Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 24,
  },
  selectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    width: "48%",
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
  frequencyContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
  },
  frequencyCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  frequencyCount: {
    fontSize: 16,
  },
  arrowContainer: {
    justifyContent: "center",
  },
  arrow: {
    fontSize: 12,
    color: "#666",
    lineHeight: 14,
  },
  frequencyOptions: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  frequencyButtonSelected: {
    backgroundColor: "#f5f5f5",
  },
  frequencyButtonText: {
    color: "#666",
  },
  frequencyButtonTextActive: {
    color: "#4169E1",
  },
  addButton: {
    backgroundColor: "#4169E1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
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
    backgroundColor: "#4169E1",
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
});
