import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, useRouter } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        onPress={() => {
          router.push("/(tabs)/home");
        }}
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
