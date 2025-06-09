import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ImageVerification = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={26} color="#161823" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Image Verification Result</Text>
        <View style={{ width: 26 }} />
      </View>
      {/* Image Preview */}
      {/* <Image
        source={require("../../assets/logo.png")}
        style={styles.productImage}
      /> */}
      {/* Status Row */}
      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>
          Authenticity Match: <Text style={{ fontWeight: "bold" }}>HIGH</Text>
        </Text>
      </View>
      <Text style={styles.confidenceText}>
        Matches official product images with 98% confidence.
      </Text>
      <Text style={styles.confidenceText}>
        No significant visual discrepancies found.
      </Text>
      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxText}>
          This product appears genuine based on visual inspection. Always
          consider other authenticity factors.
        </Text>
      </View>
      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Report this product</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 24,
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
  productImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 18,
    borderRadius: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1ED760",
    marginRight: 10,
  },
  statusText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#161823",
  },
  confidenceText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#161823",
    textAlign: "center",
    marginBottom: 2,
  },
  infoBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 14,
    marginVertical: 18,
    width: "100%",
  },
  infoBoxText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#161823",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  doneButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  doneButtonText: {
    color: "#161823",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  reportButtonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ImageVerification;
