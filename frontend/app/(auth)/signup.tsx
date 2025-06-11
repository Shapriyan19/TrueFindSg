import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const API_BASE_URL = Platform.select({
  web: "http://localhost:5001",
  default: "http://192.168.1.3:5001", // Replace with your computer's local IP address
});

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      alert("⚠️ Missing Fields, Please fill in all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("⚠️ Password Mismatch");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // First, upload the profile image if one was selected
      let profileImageUrl = null;
      if (profileImage) {
        const formData = new FormData();
        const imageObject = {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any;
        formData.append('image', imageObject);

        const uploadResponse = await fetch(`${API_BASE_URL}/api/images/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          profileImageUrl = uploadData.imageUrl;
        }
      }

      // Then proceed with signup
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          displayName: email.split("@")[0],
          profileImageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Signup Successful, A verification email has been sent to your inbox.");
        router.push("/(auth)/login");
      } else {
        setErrorMessage(data.error || "Signup failed. Try again.");
        alert("❌ Signup Failed, Something went wrong.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Unable to connect to server.");
      Alert.alert("🚫 Network Error", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      {/* Profile Image Upload */}
      <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Icon name="camera" size={32} color="#4F4F4F" />
            <Text style={styles.profileImageText}>Add Profile Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#4F4F4F"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#4F4F4F"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#4F4F4F"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
      />

      {errorMessage ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signupButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity>
          <Text style={styles.switchText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 32,
    color: "#161823",
    marginBottom: 32,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: '#4F4F4F',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#4F4F4F",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "Inter",
    color: "#161823",
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  toggleButton: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  toggleText: {
    color: "#4F4F4F",
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: "#000",
    width: "100%",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  switchText: {
    marginTop: 16,
    color: "#4F4F4F",
    fontSize: 14,
    fontFamily: "Inter",
  },
  loginLink: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default SignupScreen;
