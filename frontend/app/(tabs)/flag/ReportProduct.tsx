import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from "../../../constants/api";


const ReportProductScreen = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  const [selectedReasons, setSelectedReasons] = useState({
    counterfeit: true,
    misleading: false,
    fakeReviews: false,
    unsafe: false,
    incorrectPricing: false,
    others: false,
  });

  useEffect(() => {
    const loadUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setUserToken(token);
        if (!token) {
          Alert.alert("Login Required", "Please log in to submit a report.");
          router.push("/(auth)/login");
        }
      } catch (error) {
        console.error("Failed to load user token:", error);
        Alert.alert("Error", "Failed to load user data. Please try again.");
      }
    };
    loadUserToken();
  }, []);

  const toggleReason = (reason: keyof typeof selectedReasons) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [reason]: !prev[reason],
    }));
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setUploadedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const handleSubmit = async () => {
    if (!userToken) {
      Alert.alert("Login Required", "Please log in to submit a report.");
      router.push("/(auth)/login");
      return;
    }

    if (!productName.trim() || !sellerName.trim()) {
      Alert.alert("Error", "Please fill in product name and seller name.");
      return;
    }

    const selectedReasonsList = Object.keys(selectedReasons).filter(
      (key) => selectedReasons[key as keyof typeof selectedReasons]
    ).map((key) => {
      if (key === 'others' && selectedReasons.others) {
        return otherReason.trim() || 'Other (unspecified)';
      }
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    });

    if (selectedReasonsList.length === 0) {
      Alert.alert("Error", "Please select at least one reason for report.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          productName,
          sellerName,
          reportType: selectedReasonsList,
          description: additionalDetails,
          evidence: uploadedImage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message || "Your report has been submitted successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
        setProductName("");
        setSellerName("");
        setAdditionalDetails("");
        setOtherReason("");
        setUploadedImage(null);
        setSelectedReasons({
          counterfeit: true, misleading: false, fakeReviews: false, unsafe: false, incorrectPricing: false, others: false,
        });
      } else {
        Alert.alert("Submission Failed", data.error || "Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Network or API error:", error);
      Alert.alert("Error", "Could not connect to the server. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#161823" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name</Text>
            <TextInput
              style={styles.textInput}
              value={productName}
              onChangeText={setProductName}
              placeholder="Enter product name"
              placeholderTextColor="#4F4F4F"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Seller Name</Text>
            <TextInput
              style={styles.textInput}
              value={sellerName}
              onChangeText={setSellerName}
              placeholder="Enter seller name"
              placeholderTextColor="#4F4F4F"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Report</Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleReason("counterfeit")}
          >
            <View
              style={[
                styles.checkbox,
                selectedReasons.counterfeit && styles.checkedBox,
              ]}
            >
              {selectedReasons.counterfeit && (
                <Icon name="check" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Counterfeit Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleReason("misleading")}
          >
            <View
              style={[
                styles.checkbox,
                selectedReasons.misleading && styles.checkedBox,
              ]}
            >
              {selectedReasons.misleading && (
                <Icon name="check" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Misleading Description</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleReason("fakeReviews")}
          >
            <View
              style={[
                styles.checkbox,
                selectedReasons.fakeReviews && styles.checkedBox,
              ]}
            >
              {selectedReasons.fakeReviews && (
                <Icon name="check" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Fake/Manipulated Reviews</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleReason("unsafe")}
          >
            <View
              style={[
                styles.checkbox,
                selectedReasons.unsafe && styles.checkedBox,
              ]}
            >
              {selectedReasons.unsafe && (
                <Icon name="check" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Unsafe Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleReason("incorrectPricing")}
          >
            <View
              style={[
                styles.checkbox,
                selectedReasons.incorrectPricing && styles.checkedBox,
              ]}
            >
              {selectedReasons.incorrectPricing && (
                <Icon name="check" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Incorrect Pricing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleReason("others")}
          >
            <View
              style={[
                styles.checkbox,
                selectedReasons.others && styles.checkedBox,
              ]}
            >
              {selectedReasons.others && (
                <Icon name="check" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Others:</Text>
            <TextInput
              style={styles.othersInput}
              value={otherReason}
              onChangeText={setOtherReason}
              placeholder=""
              placeholderTextColor="#4F4F4F"
              editable={selectedReasons.others}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          <TextInput
            style={styles.textArea}
            value={additionalDetails}
            onChangeText={setAdditionalDetails}
            placeholder="Enter additional details..."
            placeholderTextColor="#4F4F4F"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Image</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
            {uploadedImage ? (
              <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} />
            ) : (
              <Icon name="camera" size={32} color="#4F4F4F" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={loading}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 20,
    color: "#161823",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 18,
    color: "#161823",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#161823",
    marginBottom: 5,
  },
  textInput: {
    height: 48,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#161823",
    backgroundColor: "#F5F5F5",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: "#000",
  },
  checkboxLabel: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#161823",
    flex: 1,
  },
  othersInput: {
    flex: 1,
    height: 30,
    borderColor: "#E0E0E0",
    borderBottomWidth: 1,
    marginLeft: 10,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#161823",
  },
  textArea: {
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#161823",
    backgroundColor: "#F5F5F5",
  },
  uploadButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#161823",
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  submitButtonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReportProductScreen;
