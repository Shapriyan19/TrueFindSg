import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Image source={require("../assets/logo.png")} style={styles.logo} /> */}
      <Text style={styles.appName}>TrueFind SG</Text>
      <Text style={styles.tagline}>
        Your Trust-First Product Discovery App for Authentic Online Shopping.
      </Text>
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/(auth)/signup" asChild>
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: "contain",
  },
  appName: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 32,
    color: "#161823", // lightTextTextPrimary
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 16,
    color: "#4F4F4F", // gray2
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 24,
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
  signupButton: {
    backgroundColor: "#fff", // white
    borderColor: "#000", // black
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#000", // black
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default WelcomeScreen;
