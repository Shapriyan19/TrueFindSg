import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Platform, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import { API_BASE_URL } from "../../constants/api";


interface Product {
  id: string;
  product_name: string;
  brand: string;
  price: number;
  authenticity_confidence_score: number;
  platform: string;
  image_url?: string;
  description?: string;
  authenticityReasons?: string;
  category?: string;
  isFake?: boolean;
  keyFeatures?: string[]; // Assuming it's an array of strings
  seller?: string;
  url?: string;
  oldPrice?: string; // Added for comparison pricing display
}

const ImageSlider = ({ imageUrls }: { imageUrls: string[] }) => {
  // For now, we only have one image, but the structure is ready for multiple
  // A full slider would involve state for current image index and touch handlers
  return (
    <View style={sliderStyles.container}>
      {imageUrls.length > 0 && (
        <Image source={{ uri: imageUrls[0] }} style={sliderStyles.image} resizeMode="contain" />
      )}
      <View style={sliderStyles.dotsContainer}>
        {imageUrls.map((_, index) => (
          <View
            key={index}
            style={[sliderStyles.dot, index === 0 && sliderStyles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
});

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
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyText}>Product not found.</Text>
      </View>
    );
  }

  const productImages = product.image_url ? [product.image_url] : [];

  const handleViewOnUrl = () => {
    if (product.url) {
      Linking.openURL(product.url).catch(err => console.error('Failed to open URL:', err));
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView style={styles.scrollViewContent}>
        <ImageSlider imageUrls={productImages} />

        <View style={styles.detailsSection}>
          <View style={styles.titlePriceRow}>
            <Text style={styles.productTitle}>{product.product_name || "Unknown Product"}</Text>
            {product.authenticity_confidence_score !== undefined && (
              <View style={styles.authenticityScoreBadge}>
                <Text style={styles.authenticityScoreText}>{Math.round(product.authenticity_confidence_score)}%</Text>
              </View>
            )}
          </View>
          <Text style={styles.soldOnText}>Sold on {product.platform}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>${product.price?.toFixed(2)}</Text>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>${product.oldPrice}</Text>
            )}
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionHeader}>Why This Score?</Text>
          <View style={styles.scoreDetailRow}>
            <Icon name="check-circle-outline" size={20} color="#4CAF50" style={styles.scoreIcon} />
            <Text style={styles.scoreText}><Text style={styles.scoreLabel}>Source:</Text> Official Brand Store (Placeholder)</Text>
          </View>
          {/* <View style={styles.scoreDetailRow}>
            <Icon name="robot-outline" size={20} color="#4F4F4F" style={styles.scoreIcon} />
            <Text style={styles.scoreText}><Text style={styles.scoreLabel}>AI Analysis:</Text> No red flags detected in image (Placeholder)</Text>
          </View> */}
          {product.authenticityReasons && (
             <View style={styles.scoreDetailRow}>
               <Icon name="information-outline" size={20} color="#FF9800" style={styles.scoreIcon} />
               <Text style={styles.scoreText}><Text style={styles.scoreLabel}>Reasons:</Text> {product.authenticityReasons}</Text>
             </View>
           )}
        </View>

        <TouchableOpacity style={styles.viewOnButton} onPress={handleViewOnUrl} disabled={!product.url}>
          <Text style={styles.viewOnButtonText}>View on {product.platform || 'Link'}</Text>
        </TouchableOpacity>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionHeader}>Product Description</Text>
          {product.description ? (
            <Text style={styles.descriptionText}>{product.description}</Text>
          ) : (
            <Text style={styles.emptyText}>No description available.</Text>
          )}
        </View>

        {product.keyFeatures && product.keyFeatures.length > 0 && (
          <View style={styles.detailsSection}>
            <Text style={styles.sectionHeader}>Key Features</Text>
            {Object.values(product.keyFeatures).map((feature, index) => (
              <Text key={index} style={styles.featureItem}>• {feature}</Text>
            ))}
          </View>
        )}

        <View style={styles.detailsSection}>
          {product.category && (
            <Text style={styles.detailText}><Text style={styles.label}>Category:</Text> {product.category}</Text>
          )}
          {product.isFake !== undefined && (
            <Text style={styles.detailText}><Text style={styles.label}>Is Fake:</Text> {product.isFake ? 'Yes' : 'No'}</Text>
          )}
          {product.seller && (
            <Text style={styles.detailText}><Text style={styles.label}>Seller:</Text> {product.seller}</Text>
          )}
          {product.url && (
            <Text style={styles.detailText}><Text style={styles.label}>Original URL:</Text> <Text style={styles.urlText} onPress={() => Linking.openURL(product.url || '')}>{product.url}</Text></Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0, // Adjusted as image is at top
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
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS notch
    left: 20,
    zIndex: 10, // Ensure it's above other content
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 5,
  },
  detailsSection: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#161823",
    fontFamily: "Inter",
    flexShrink: 1, // Allow text to wrap
  },
  authenticityScoreBadge: {
    backgroundColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  authenticityScoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Inter",
  },
  titlePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  soldOnText: {
    fontSize: 14,
    color: "#4F4F4F",
    fontFamily: "Inter",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Inter",
    marginRight: 10,
  },
  oldPrice: {
    fontSize: 16,
    color: "#4F4F4F",
    fontFamily: "Inter",
    textDecorationLine: "line-through",
  },
  sectionHeader: {
    fontFamily: "Jost",
    fontWeight: "bold",
    fontSize: 18,
    color: "#161823",
    marginBottom: 10,
  },
  scoreDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreIcon: {
    marginRight: 10,
  },
  scoreText: {
    fontSize: 14,
    color: "#161823",
    fontFamily: "Inter",
    flexShrink: 1,
  },
  scoreLabel: {
    fontWeight: "bold",
  },
  viewOnButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginBottom: 20,
  },
  viewOnButtonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: "#161823",
    fontFamily: "Inter",
    lineHeight: 24,
  },
  featureItem: {
    fontSize: 16,
    color: "#161823",
    marginLeft: 10,
    marginBottom: 4,
    fontFamily: "Inter",
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
  urlText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
}); 