import React, { useState } from "react";
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

// Sample data for My Reports
const myReports = [
  {
    id: 1,
    item: "Boss Headphones",
    description: "Lazada",
    status: "Under Review",
    statusColor: "#FF9500",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    item: "LongChamp Handbag",
    description: "Shopee",
    status: "Pending",
    statusColor: "#007AFF",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    item: "Converse Black",
    description: "Shopee",
    status: "Action Taken",
    statusColor: "#FF3B30",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
  },
];

// Sample data for Public Reports
const publicReports = [
  {
    id: 1,
    item: "Fossil Tillie Watch BQ3497",
    description: "Shopee",
    status: "Upvote Flag",
    statusColor: "#4F4F4F",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    item: "Hong Thai Herbal Inhaler",
    description: "Shopee",
    status: "Upvote Flag",
    statusColor: "#4F4F4F",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    item: "Fiji Digicam",
    description: "Lazada",
    status: "Upvote Flag",
    statusColor: "#4F4F4F",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    item: "PS4 Controller",
    description: "Shopee",
    status: "Upvote Flag",
    statusColor: "#4F4F4F",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=100&fit=crop",
  },
];

const ReportsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("My Reports");

  const currentReports = activeTab === "My Reports" ? myReports : publicReports;

  const renderReportItem = (item: any) => (
    <View key={item.id} style={styles.reportItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.item}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
        <Text style={styles.statusText}>{item.status}</Text>
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
        <Text style={styles.headerTitle}>Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "My Reports" && styles.activeTab]}
          onPress={() => setActiveTab("My Reports")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "My Reports" && styles.activeTabText,
            ]}
          >
            My Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "Public Reports" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Public Reports")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Public Reports" && styles.activeTabText,
            ]}
          >
            Public Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerColumn}>ITEMS</Text>
        <Text style={styles.headerColumn}>DESCRIPTION</Text>
        <Text style={styles.headerColumn}>STATUS</Text>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
      >
        {currentReports.map(renderReportItem)}
      </ScrollView>

      {/* Report New Product Button */}
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => router.push("/(tabs)/flag/ReportProduct")}
      >
        <Icon name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.reportButtonText}>Report New Product</Text>
      </TouchableOpacity>
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#4F4F4F",
    fontFamily: "Inter",
  },
  activeTabText: {
    color: "#161823",
    fontWeight: "600",
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
  reportsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#161823",
    fontFamily: "Inter",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: "#4F4F4F",
    fontFamily: "Inter",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Inter",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  reportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
  },
});

export default ReportsScreen;
