import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, useRouter } from "expo-router";

const SignupScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
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
    
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => {
            /* TODO: Handle Signup */
            router.push("/(tabs)/home");
          }}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Link href="/(auth)/login" asChild>
        <TouchableOpacity>
          <Text style={styles.switchText}>
            Don't have an account?{" "}
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
    signupButton: {
      backgroundColor: "#000", // black
      paddingVertical: 16,
      borderRadius: 25,
      width: "100%",
      alignItems: "center",
      marginBottom: 16,
    },
    signupButtonText: {
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
    loginLink: {
      color: "#007AFF",
      fontWeight: "bold",
      fontFamily: "Inter",
    },
  });
  
  export default SignupScreen;
  
