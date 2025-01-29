import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
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
      setImage(result.assets[0].uri); // Fix: Access the first asset's URI
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>Set Profile Picture</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/RegisterStep3")}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  imagePicker: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 50 },
  button: { backgroundColor: "#000", paddingVertical: 15, borderRadius: 8, marginTop: 20, alignItems: "center", width: "80%" },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
