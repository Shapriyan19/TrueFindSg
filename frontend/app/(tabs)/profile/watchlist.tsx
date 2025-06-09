import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Sample data for watchlist products
const watchlistProducts = [
  {
    id: 1,
    name: "Air Pods Pro",
    description: "Amazon",
    price: "$289.00",
    verification: "Original",
    verificationColor: "#34C759",
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Samsung T7 USB",
    description: "Lazada",
    price: "$159.00",
    verification: "Original",
    verificationColor: "#34C759",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100&h=100&fit=crop",
  },
];

const WatchlistScreen = () => {
  const router = useRouter();

  const renderProductItem = (item: any) => (
    <View key={item.id} style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
      <View
        style={[
          styles.verificationBadge,
          { backgroundColor: item.verificationColor },
        ]}
      >
        <Text style={styles.verificationText}>{item.verification}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#161823" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Watchlist</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerColumn}>ITEMS</Text>
        <Text style={styles.headerColumn}>DESCRIPTION</Text>
        <Text style={styles.headerColumn}>Verification</Text>
      </View>

      {/* Products List */}
      <ScrollView
        style={styles.productsList}
        showsVerticalScrollIndicator={false}
      >
        {watchlistProducts.map(renderProductItem)}

        {/* Empty state if needed */}
        {watchlistProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="bookmark-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>
              No items in your watchlist yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Products you bookmark will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerColumn: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#4F4F4F",
    fontFamily: "Inter",
    textTransform: "uppercase",
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productContent: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: "#4F4F4F",
    fontFamily: "Inter",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
  },
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  verificationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Inter",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#4F4F4F",
    fontFamily: "Inter",
    textAlign: "center",
  },
});

export default WatchlistScreen;
