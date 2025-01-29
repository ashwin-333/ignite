import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function RegisterStep2() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Sign up</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Image source={require("/Users/ftc/habit-heatmap/assets/images/Default_pfp.svg.png")} style={styles.placeholderImage} />
          </View>
          
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={styles.setProfileButton}>
        <Text style={styles.setProfileText}>SET PROFILE PICTURE</Text>
      </TouchableOpacity>

      <TextInput style={styles.hiddenInput} autoFocus={false} />

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/auth/RegisterStep3")}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  backText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    width: 50,
    height: 50,
    tintColor: "#9CA3AF",
  },
  setProfileButton: {
    marginTop: 10,
    backgroundColor: "#1F2937",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  setProfileText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  hiddenInput: {
    width: "100%",
    height: 40,
    backgroundColor: "transparent",
    marginTop: 20,
  },
  nextButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#000",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

