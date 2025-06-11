import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { API_BASE_URL } from "../../../constants/api";


interface Product {
  id: string;
  product_name: string;
  brand: string;
  price: number;
  platform: string;
  image_url?: string;
  isFake: boolean;
}

const categories = [
  { id: 1, label: "Electronics", icon: "cellphone" as any },
  { id: 2, label: "Health & Beauty", icon: "heart" as any },
  { id: 3, label: "Luxury", icon: "diamond-stone" as any },
  { id: 4, label: "Apparel", icon: "tshirt-crew" as any },
];

const HomeScreen = () => {
  const router = useRouter();
  const [trendingDeals, setTrendingDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecificProducts();
  }, []);

  const fetchRandomVerifiedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/search`);
      const allProducts = await response.json();
      
      // Filter out fake products and get random 4 products
      const verifiedProducts = allProducts
        .filter((product: Product) => !product.isFake)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      setTrendingDeals(verifiedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecificProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/search`);
      const allProducts = await response.json();
      
      // Filter products by specific SKUs
      const specificProducts = allProducts.filter((product: Product) => 
        ['SKU0004', 'SKU0005', 'SKU0007', 'SKU0015'].includes(product.id)
      );

      setTrendingDeals(specificProducts);
    } catch (error) {
      console.error('Error fetching specific products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar and Icons */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Icon
            name="magnify"
            size={22}
            color="#4F4F4F"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#4F4F4F"
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="filter-variant" size={24} color="#161823" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell-outline" size={24} color="#161823" />
        </TouchableOpacity>
      </View>

      {/* Verify Product Image Button */}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => {
          router.push("/(tabs)/home/UploadImage");
        }}
      >
        <Text style={styles.verifyButtonText}>Verify Product Image</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Trending Verified Deals */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Trending Verified Deals</Text>
          <Icon name="chevron-right" size={22} color="#161823" />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dealsRow}
          >
            {trendingDeals.map((deal) => (
              <TouchableOpacity 
                key={deal.id} 
                style={styles.dealCard}
                onPress={() => router.push(`/product/${deal.id}`)}
              >
                <Image 
                  source={deal.image_url ? { uri: deal.image_url } : require("../../../assets/logo.png")} 
                  style={styles.dealImage} 
                />
                <Text style={styles.dealStore}>{deal.platform}</Text>
                <Text style={styles.dealTitle}>{deal.product_name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.dealPrice}>${deal.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Top Categories */}
        <Text style={styles.sectionHeader}>Top Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <Icon
                name={cat.icon}
                size={24}
                color="#161823"
                style={{ marginBottom: 6 }}
              />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Latest Counterfeit Alerts */}
        <Text style={styles.sectionHeader}>Latest Counterfeit Alerts</Text>
        <View style={styles.alertCard}>
          <Icon
            name="alert-circle-outline"
            size={28}
            color="#161823"
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.alertText}>
              Warning: Counterfeit 'Adidas' Shoes
            </Text>
            <Text style={styles.alertSource}>CASE/IPOS</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#161823",
  },
  iconButton: {
    marginLeft: 8,
    padding: 6,
  },
  verifyButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginBottom: 18,
  },
  verifyButtonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeader: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 18,
    color: "#161823",
    flex: 1,
  },
  dealsRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  dealCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dealImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "contain",
  },
  dealStore: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#4F4F4F",
    marginBottom: 2,
  },
  dealTitle: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 14,
    color: "#161823",
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dealPrice: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 14,
    color: "#161823",
    marginRight: 6,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 18,
    marginBottom: 12,
  },
  categoryLabel: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#161823",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  alertText: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 14,
    color: "#161823",
    marginBottom: 2,
  },
  alertSource: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#4F4F4F",
  },
  loader: {
    marginVertical: 20,
  },
});

export default HomeScreen;
