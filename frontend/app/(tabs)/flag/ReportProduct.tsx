import React, { useState } from "react";
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
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ReportProductScreen = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const [selectedReasons, setSelectedReasons] = useState({
    counterfeit: true, // Default checked as shown in screenshot
    misleading: false,
    fakeReviews: false,
    unsafe: false,
    incorrectPricing: false,
    others: false,
  });

  const toggleReason = (reason: keyof typeof selectedReasons) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [reason]: !prev[reason],
    }));
  };

  const handleSubmit = () => {
    if (!productName.trim() || !sellerName.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Here you would typically submit the report data
    Alert.alert("Success", "Your report has been submitted successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
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
        {/* Product Information Section */}
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

        {/* Reason for Report Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Report</Text>

          {/* Checkbox Options */}
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

          {/* Others Option with Text Input */}
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

        {/* Additional Details Section */}
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

        {/* Upload Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Image</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Icon name="camera" size={32} color="#4F4F4F" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
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
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#161823",
    fontFamily: "Inter",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter",
    color: "#161823",
    backgroundColor: "#F8F8F8",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#8A2BE2",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderStyle: "dashed",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#4F4F4F",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#161823",
    fontFamily: "Inter",
    flex: 1,
  },
  othersInput: {
    flex: 1,
    marginLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 4,
    fontSize: 14,
    fontFamily: "Inter",
    color: "#161823",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter",
    color: "#161823",
    backgroundColor: "#F8F8F8",
    height: 100,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#000",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Inter",
  },
});

export default ReportProductScreen;
