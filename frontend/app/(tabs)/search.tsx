import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Platform, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const API_BASE_URL = Platform.select({
  web: "http://localhost:5001",
  default: "http://192.168.1.5:5001", // Replace with your computer's local IP address
});

interface Product {
  id: string;
  product_name: string;
  brand: string;
  price: number;
  authenticity_confidence_score: number;
  platform: string;
  image_url?: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    console.log('Searching for:', searchQuery);

    try {
      const url = `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(searchQuery)}`;
      console.log('Search URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('Search response:', data);

      if (response.ok) {
        setProducts(data);
        console.log('Products found:', data.length);
      } else {
        setError(data.error || "Failed to fetch products");
        console.error('Search error:', data.error);
      }
    } catch (error) {
      setError("Could not connect to the server. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        console.log("Navigating to product:", item.id);
        router.push(`/product/${item.id}`);
      }}
    >
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productBrand}>{item.brand}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <Text style={styles.productPlatform}>
        Platform: {item.platform}
      </Text>
      {item.authenticity_confidence_score !== undefined && (
        <Text style={styles.productScore}>
          Authenticity Score: {item.authenticity_confidence_score}%
        </Text>
      )}
    </TouchableOpacity>
  );

  const EmptyListComponent = () => (
    <Text style={styles.emptyText}>
      {searchQuery ? "No products found" : "Search for products to begin"}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Products</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      )}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={!loading ? EmptyListComponent : null}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#161823",
    marginBottom: 8,
    fontFamily: "Inter",
    textAlign: "center",
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderColor: "#4F4F4F",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
    fontFamily: "Inter",
    backgroundColor: "#f9f9f9",
    color: "#161823",
  },
  searchButton: {
    backgroundColor: "#000",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Inter",
  },
  productList: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#161823",
    marginBottom: 4,
    fontFamily: "Inter",
    textAlign: "center",
  },
  productBrand: {
    fontSize: 16,
    color: "#4F4F4F",
    marginBottom: 4,
    fontFamily: "Inter",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "Inter",
    textAlign: "center",
  },
  productPlatform: {
    fontSize: 14,
    color: "#4F4F4F",
    fontFamily: "Inter",
    textAlign: "center",
    marginTop: 4,
  },
  productScore: {
    fontSize: 14,
    color: "#4F4F4F",
    fontFamily: "Inter",
    textAlign: "center",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#4F4F4F",
    marginTop: 20,
    fontFamily: "Inter",
  },
});
