import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import { API_BASE_URL } from "../../../constants/api";


interface Report {
  id: string;
  productName: string | null; // Can be null from backend
  sellerName: string | null;   // Can be null from backend
  reportType: string; // This is the comma-separated string of reasons
  description?: string; // This is the additional details text
  evidence?: string; // This will hold the image URL
  upvotes: number;
  downvotes: number;
  createdAt: string;
  userVote?: 'upvote' | 'downvote' | null;
}

const ReportsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("My Reports");
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [publicReports, setPublicReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null); // State to store user token
  const [userUID, setUserUID] = useState<string | null>(null);     // State to store user UID

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const uid = await AsyncStorage.getItem("userUID");
        setUserToken(token);
        setUserUID(uid);
        console.log("Retrieved token:", token);
        console.log("Retrieved UID:", uid);
        if (!token || !uid) {
          // Optionally, redirect to login if no token is found
          console.warn("No user token or UID found. User might not be logged in.");
          // router.push("/(auth)/login"); 
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      }
    };
    loadUserData();
  }, []); // Run once on component mount

  // Fetch reports based on active tab and user data
  useEffect(() => {
    const fetchReports = async () => {
      if (activeTab === "My Reports" && (!userToken || !userUID)) {
        // Don't fetch if My Reports is active and user data isn't loaded yet
        return;
      }

      setLoading(true);
      try {
        let url = '';
        let headers: HeadersInit = { 'Content-Type': 'application/json' };

        if (activeTab === "My Reports") {
          if (userToken) {
            headers = { ...headers, 'Authorization': `Bearer ${userToken}` };
          }
          url = `${API_BASE_URL}/api/reports?uid=${userUID}`; // Use actual userUID
        } else {
          url = `${API_BASE_URL}/api/reports/public`;
        }

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (response.ok) {
          if (activeTab === "My Reports") {
            setMyReports(data);
          } else {
            setPublicReports(data);
          }
        } else {
          Alert.alert("Error", data.error || "Failed to fetch reports.");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        Alert.alert("Error", "Could not connect to the server. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user data is available for My Reports or if on Public Reports tab
    if (activeTab === "Public Reports" || (userToken && userUID)) {
      fetchReports();
    }
  }, [activeTab, userToken, userUID]); // Re-run when activeTab or user data changes

  const handleVote = async (reportId: string, type: 'upvote' | 'downvote') => {
    try {
      if (!userToken) {
        Alert.alert("Login Required", "Please log in to cast your vote.");
        router.push("/(auth)/login");
        return;
      }

      console.log(`Attempting to ${type} report ${reportId} with token: ${userToken}`);

      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        Alert.alert("Error", "Received invalid response from server. Please try again.");
        return;
      }

      if (response.ok) {
        // Update the UI based on the vote action
        const updateReportVotes = (reports: Report[]) => {
          return reports.map(report => {
            if (report.id === reportId) {
              const newReport = { ...report };
              
              // Handle vote changes
              if (report.userVote === type) {
                // Removing vote
                newReport.userVote = null;
                if (type === 'upvote') {
                  newReport.upvotes = report.upvotes - 1;
                } else {
                  newReport.downvotes = report.downvotes - 1;
                }
              } else if (report.userVote === (type === 'upvote' ? 'downvote' : 'upvote')) {
                // Changing vote
                newReport.userVote = type;
                if (type === 'upvote') {
                  newReport.upvotes = report.upvotes + 1;
                  newReport.downvotes = report.downvotes - 1;
                } else {
                  newReport.upvotes = report.upvotes - 1;
                  newReport.downvotes = report.downvotes + 1;
                }
              } else {
                // New vote
                newReport.userVote = type;
                if (type === 'upvote') {
                  newReport.upvotes = report.upvotes + 1;
                } else {
                  newReport.downvotes = report.downvotes + 1;
                }
              }
              
              return newReport;
            }
            return report;
          });
        };

        if (activeTab === "My Reports") {
          setMyReports(prev => updateReportVotes(prev));
        } else {
          setPublicReports(prev => updateReportVotes(prev));
        }

        Alert.alert("Success", data.message);
      } else {
        console.error('Server error response:', data);
        Alert.alert("Voting Failed", data.error || "Failed to cast vote. Please try again.");
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      Alert.alert("Error", "Could not connect to the server to cast vote. Please check your network connection.");
    }
  };

  const currentReports = activeTab === "My Reports" ? myReports : publicReports;

  const renderReportItem = (item: Report) => {
    console.log(`Report ID: ${item.id}, Upvotes: ${item.upvotes}, Downvotes: ${item.downvotes}, User Vote: ${item.userVote}`);
    return (
      <View key={item.id} style={styles.reportItem}>
        {item.evidence && <Image source={{ uri: item.evidence }} style={styles.itemImage} />}
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.productName || 'N/A'}</Text>
          <Text style={styles.itemDescription}>{item.sellerName || 'N/A'}</Text>
          {item.description && (
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <Text style={styles.reportType}>{item.reportType}</Text>
        </View>
        <View style={styles.voteContainer}>
          <TouchableOpacity 
            onPress={() => handleVote(item.id, 'upvote')} 
            style={[
              styles.voteButton,
              item.userVote === 'upvote' && styles.votedButton
            ]}
          >
            <Icon 
              name={item.userVote === 'upvote' ? "arrow-up-bold-circle" : "arrow-up-bold-circle-outline"} 
              size={20} 
              color={item.userVote === 'upvote' ? "#000" : "#666"} 
            />
            <Text style={[
              styles.voteCount,
              item.userVote === 'upvote' && styles.votedCount
            ]}>{item.upvotes}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleVote(item.id, 'downvote')} 
            style={[
              styles.voteButton,
              item.userVote === 'downvote' && styles.votedButton
            ]}
          >
            <Icon 
              name={item.userVote === 'downvote' ? "arrow-down-bold-circle" : "arrow-down-bold-circle-outline"} 
              size={20} 
              color={item.userVote === 'downvote' ? "#000" : "#666"} 
            />
            <Text style={[
              styles.voteCount,
              item.userVote === 'downvote' && styles.votedCount
            ]}>{item.downvotes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
              activeTab === "My Reports" && styles.tabTextActive,
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
              activeTab === "Public Reports" && styles.tabTextActive,
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
        <Text style={[styles.headerColumn, styles.votesHeader]}>VOTES</Text>
      </View>

      {/* Reports List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : currentReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "My Reports" ? "No reports submitted yet." : "No public reports available."}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.reportsList}
          showsVerticalScrollIndicator={false}
        >
          {currentReports.map(renderReportItem)}
        </ScrollView>
      )}

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
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 20,
    color: "#161823",
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
  tabTextActive: {
    color: "#161823",
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "#4F4F4F",
    fontFamily: "Inter",
    textTransform: "uppercase",
  },
  votesHeader: {
    flex: 0.5,
    textAlign: "right",
    paddingRight: 10,
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4F4F4F",
    fontFamily: "Inter",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#4F4F4F",
    fontFamily: "Inter",
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
    backgroundColor: "#E0E0E0",
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 14,
    color: "#161823",
    marginBottom: 2,
  },
  itemDescription: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#4F4F4F",
    marginBottom: 2,
  },
  reportType: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  votedButton: {
    backgroundColor: "#F0F0F0",
  },
  voteCount: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    fontFamily: "Inter",
  },
  votedCount: {
    color: "#000",
  },
  reportButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
    flexDirection: "row",
  },
  reportButtonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReportsScreen;
