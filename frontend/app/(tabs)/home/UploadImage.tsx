import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Platform.select({
  web: "http://localhost:5001",
  default: "http://192.168.1.5:5001", // Replace with your computer's local IP address
});

const UploadImageScreen = () => {
  const router = useRouter();
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const verifyImage = async (uri: string) => {
    try {
      setIsUploading(true);
      
      // Get the auth token from storage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Error', 'Please log in to continue');
        router.push('/(auth)/login');
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'verify.jpg',
      } as any);

      // Make API call
      const verifyResponse = await fetch(`${API_BASE_URL}/api/images/verify`, {
        method: 'POST',
        body: formData,
        headers:{
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Failed to verify image');
      }

      const responseData = await verifyResponse.json();

      // Store imageUri in AsyncStorage instead of passing via params
      await AsyncStorage.setItem('currentImageUri', responseData.imageUri);

      router.push({
        pathname: "/(tabs)/home/ImageVerification",
        params: {
          // Only pass verificationResult via params, imageUri is in AsyncStorage
          verificationResult: JSON.stringify(responseData.verificationResult)
        }
      });
    } catch (error) {
      console.error('Error verifying image:', error);
      Alert.alert(
        'Verification Failed',
        error instanceof Error ? error.message : 'Failed to verify image. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async (useCamera: boolean = false) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      
      if (useCamera && cameraStatus.status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera');
        return;
      }
      
      if (!useCamera && status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await (useCamera 
        ? ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          }));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setProductImage(imageUri);
        await verifyImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
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
        onPress={() => pickImage(true)}
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
        onPress={() => pickImage(false)}
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
