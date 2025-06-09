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

const ProfileScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#161823" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=150&h=150&fit=crop&crop=face",
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.greeting}>Hello, Olivia!</Text>
        </View>

        {/* My Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Products</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/profile/verifieditems")}
          >
            <Icon name="check-circle-outline" size={24} color="#161823" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>My Verified Products</Text>
              <Text style={styles.menuItemSubtitle}>5 products</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#4F4F4F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/profile/watchlist")}
          >
            <Icon name="bookmark-outline" size={24} color="#161823" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>My Watchlist</Text>
              <Text style={styles.menuItemSubtitle}>2 products</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#4F4F4F" />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="bell-outline" size={24} color="#161823" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Notifications</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#4F4F4F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="web" size={24} color="#161823" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Language</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#4F4F4F" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help-circle-outline" size={24} color="#161823" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Help & Support</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#4F4F4F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="information-outline" size={24} color="#161823" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>About TrueFind SG</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#4F4F4F" />
          </TouchableOpacity>
        </View>
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
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#161823",
    paddingHorizontal: 16,
    marginBottom: 12,
    fontFamily: "Inter",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#161823",
    fontFamily: "Inter",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#4F4F4F",
    fontFamily: "Inter",
  },
});

export default ProfileScreen;
