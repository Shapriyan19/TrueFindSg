import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageVerification = () => {
  const router = useRouter();
  const { verificationResult } = useLocalSearchParams();
  const result = verificationResult ? JSON.parse(verificationResult as string) : null;
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImageUri = await AsyncStorage.getItem('currentImageUri');
        if (storedImageUri) {
          setImageUri(storedImageUri);
          // Optionally clear the stored image after use if it's no longer needed
          // await AsyncStorage.removeItem('currentImageUri');
        }
      } catch (e) {
        console.error('Failed to load image from AsyncStorage', e);
      }
    };

    loadImage();
  }, []);

  const getStatusColor = (score: number) => {
    if (score >= 80) return '#34C759'; // Green for high authenticity
    if (score >= 50) return '#FF9500'; // Orange for medium authenticity
    return '#FF3B30'; // Red for low authenticity
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return 'LIKELY AUTHENTIC';
    if (score >= 50) return 'UNCERTAIN';
    return 'LIKELY COUNTERFEIT';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={26} color="#161823" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Image Verification Result</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Image Preview */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Analysis Results */}
      <View style={styles.analysisContainer}>
        <Text style={styles.sectionTitle}>Analysis Results</Text>
        
        {result ? (
          <>
            {/* Authenticity Score */}
            <View style={styles.infoBox}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[
                  styles.statusValue,
                  { color: getStatusColor(result.matchPercentage) }
                ]}>
                  {getStatusText(result.matchPercentage)}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Authenticity Score:</Text>
                <Text style={styles.statusValue}>{result.matchPercentage}%</Text>
              </View>
            </View>

            {/* Discrepancy Flags */}
            {result.discrepancyFlags && result.discrepancyFlags.length > 0 && (
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>Discrepancy Flags</Text>
                {result.discrepancyFlags.map((flag: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listItemText}>{flag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Detailed Analysis */}
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Detailed Analysis</Text>
              <Text style={styles.infoBoxText}>{result.analysis}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>No analysis results available</Text>
        )}

        <Text style={styles.timestamp}>
          Analyzed on: {result?.timestamp ? new Date(result.timestamp).toLocaleString() : 'N/A'}
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
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => router.push("/(tabs)/flag/ReportProduct")}
        >
          <Text style={styles.reportButtonText}>Report this product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
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
  imageContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  analysisContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "bold",
    color: "#161823",
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  infoBoxText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#161823",
    lineHeight: 20,
  },
  errorText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
  },
  timestamp: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#4F4F4F",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 24,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#161823",
    marginRight: 8,
  },
  statusValue: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoBoxTitle: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#161823",
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 16,
  },
  bulletPoint: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#161823",
    marginRight: 8,
  },
  listItemText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#161823",
    flex: 1,
    lineHeight: 20,
  },
});

export default ImageVerification;

