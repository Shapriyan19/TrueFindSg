import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "../../../constants/api";

interface WatchlistItem {
  id: string;
  productId: string;
  platform: string;
  addedAt: string;
}

const WatchlistScreen = () => {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/api/users/watchlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setWatchlist(data);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWatchlistItem = async (itemId: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await fetch(`${API_BASE_URL}/api/users/watchlist/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setWatchlist(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const renderProductItem = (item: WatchlistItem) => (
    <View key={item.id} style={styles.productItem}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100&h=100&fit=crop",
        }}
        style={styles.productImage}
      />
      <View style={styles.productContent}>
        <Text style={styles.productName}>{item.productId}</Text>
        <Text style={styles.productDescription}>{item.platform}</Text>
      </View>
      {/* Verification Badge */}
      <View
        style={[
          styles.verificationBadge,
          { backgroundColor: "#34C759" },
        ]}
      >
        <Text style={styles.verificationText}>{"Original"}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteWatchlistItem(item.id)}>
        <Icon name="delete-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
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

      {/* Content */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} size="large" color="#000" />
      ) : (
        <ScrollView style={styles.productsList}>
          {watchlist.length > 0 ? (
            watchlist.map(renderProductItem)
          ) : (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  productsList: { flex: 1, paddingHorizontal: 16 },
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
  productContent: { flex: 1 },
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
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    marginRight: 12,
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
