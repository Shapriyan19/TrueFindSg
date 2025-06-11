import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing the token
const API_BASE_URL = Platform.select({
  web: "http://localhost:5001",
  default: "http://192.168.1.3:5001", // Replace with your computer's local IP address
});

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [errorMessage, setErrorMessage] = useState(""); // New state for error messages
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        await AsyncStorage.setItem("userToken", data.token); // Store the ID token
        await AsyncStorage.setItem("userUID", data.user.uid); // Store UID if needed
        await AsyncStorage.setItem("userEmail", data.user.email); // Store email if needed
        // await AsyncStorage.setItem("userDisplayName", data.user.displayName); // Store displayName if needed
        // await AsyncStorage.setItem("userPhotoURL", data.user.photoURL); // Store photoURL if needed

        Alert.alert("Logged in successfully!");
        router.push("/(tabs)/home"); // Navigate to home screen
      } else {
        // Login failed (e.g., 401 Unauthorized, 400 Bad Request)
        setErrorMessage(data.error || "Login failed. Please try again.");
        alert("Login failed. Please try again.")
        setPassword(""); // Clear password field for security
      }
    } catch (error) {
      console.error("Network or API error:", error);
      setErrorMessage("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity
        onPress={() => {
          /* TODO: Forgot Password */
        }}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin} // Call the handleLogin function
        disabled={loading} // Disable the button while loading
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Link href="/(auth)/signup" asChild>
        <TouchableOpacity>
          <Text style={styles.switchText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink}>Sign Up</Text>
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
    color: "#161823", // lightTextTextPrimary
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#4F4F4F", // gray2
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "Inter",
    color: "#161823", // lightTextTextPrimary
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
    color: "#007AFF",
    fontWeight: "bold",
    fontFamily: "Inter",
    fontSize: 14,
  },
  forgotText: {
    color: "#007AFF",
    alignSelf: "flex-end",
    marginBottom: 24,
    fontFamily: "Inter",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#000", // black
    paddingVertical: 16,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff", // white
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 18,
  },
  switchText: {
    color: "#4F4F4F", // gray2
    fontFamily: "Inter",
    fontSize: 16,
    textAlign: "center",
  },
  signupLink: {
    color: "#007AFF",
    fontWeight: "bold",
    fontFamily: "Inter",
  },
});

export default LoginScreen;
