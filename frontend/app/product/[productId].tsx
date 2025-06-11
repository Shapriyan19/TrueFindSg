import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

const API_BASE_URL = Platform.select({
  web: "http://localhost:5001",
  default: "http://192.168.1.3:5001", // Replace with your computer's local IP address
});

interface Product {
  id: string;
  product_name: string;
  brand: string;
  price: number;
  authenticity_confidence_score: number;
  platform: string;
  image_url?: string; // Optional image URL
  description?: string;
}

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const url = `${API_BASE_URL}/api/products/${productId}`;
        console.log("Fetching product details from:", url);

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          setProduct(data);
        } else {
          setError(data.error || "Failed to fetch product details");
        }
      } catch (err) {
        setError("Could not connect to the server. Please try again.");
        console.error("Product details fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.product_name || "Unknown Product"}</Text>
      {product.image_url && (
        <Image source={{ uri: product.image_url }} style={styles.productImage} resizeMode="contain" />
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}><Text style={styles.label}>Brand:</Text> {product.brand}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Price:</Text> ${product.price?.toFixed(2)}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Platform:</Text> {product.platform}</Text>
        {product.authenticity_confidence_score !== undefined && (
          <Text style={styles.detailText}>
            <Text style={styles.label}>Authenticity Score:</Text> {product.authenticity_confidence_score}%
          </Text>
        )}
        {product.description && (
          <Text style={styles.detailText}><Text style={styles.label}>Description:</Text> {product.description}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4F4F4F",
    fontFamily: "Inter",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Inter",
  },
  emptyText: {
    textAlign: "center",
    color: "#4F4F4F",
    marginTop: 20,
    fontFamily: "Inter",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#161823",
    marginBottom: 20,
    fontFamily: "Inter",
    textAlign: "center",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f0f0f0", // Placeholder background for images
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  detailText: {
    fontSize: 16,
    color: "#161823",
    marginBottom: 8,
    fontFamily: "Inter",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
}); 