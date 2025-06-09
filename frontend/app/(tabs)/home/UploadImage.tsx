import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const UploadImageScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={26} color="#161823" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Product Authenticity</Text>
        <View style={{ width: 26 }} />
      </View>

      <Text style={styles.instruction}>
        Upload a clear photo of your product (e.g., packaging, unique serial
        numbers)
      </Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push("/(tabs)/home/ImageVerification")}
      >
        <Icon
          name="camera"
          size={24}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.actionButtonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push("/(tabs)/home/ImageVerification")}
      >
        <Icon name="image" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.actionButtonText}>Upload From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.learnMoreButton}>
        <Icon
          name="information-outline"
          size={18}
          color="#161823"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.learnMoreText}>
          Learn more about image verification
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 18,
    color: "#161823",
    textAlign: "center",
    flex: 1,
  },
  instruction: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 18,
    color: "#161823",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    marginBottom: 18,
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 16,
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#161823",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 18,
  },
  learnMoreText: {
    color: "#161823",
    fontFamily: "Inter",
    fontSize: 14,
  },
});

export default UploadImageScreen;
