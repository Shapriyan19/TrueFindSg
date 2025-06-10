import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase.js';
import axios from 'axios';

// Shopee API configuration
const SHOPEE_API = {
  baseURL: process.env.SHOPEE_API_URL,
  partnerId: process.env.SHOPEE_PARTNER_ID,
  partnerKey: process.env.SHOPEE_PARTNER_KEY
};

// Lazada API configuration
const LAZADA_API = {
  baseURL: process.env.LAZADA_API_URL,
  appKey: process.env.LAZADA_APP_KEY,
  appSecret: process.env.LAZADA_APP_SECRET
};

export const searchProducts = async (req, res) => {
  try {
    const { query, platform, minScore, maxPrice } = req.query;
    
    // Search in Firebase database first
    const productsRef = ref(database, 'products');
    let productsQuery = query(productsRef);
    
    if (platform) {
      productsQuery = query(productsRef, orderByChild('platform'), equalTo(platform));
    }
    
    const snapshot = await get(productsQuery);
    let products = [];
    
    snapshot.forEach((childSnapshot) => {
      const product = childSnapshot.val();
      if (
        (!minScore || product.authenticityScore >= minScore) &&
        (!maxPrice || product.price <= maxPrice)
      ) {
        products.push({
          id: childSnapshot.key,
          ...product
        });
      }
    });

    // If no results in database, search external APIs
    if (products.length === 0) {
      const [shopeeResults, lazadaResults] = await Promise.all([
        searchShopee(query),
        searchLazada(query)
      ]);

      products = [...shopeeResults, ...lazadaResults];
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const productRef = ref(database, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const comparePrices = async (req, res) => {
  try {
    const { productId } = req.params;
    const productRef = ref(database, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = snapshot.val();
    const priceComparisons = {
      currentPrice: product.price,
      platform: product.platform,
      priceHistory: product.priceHistory || [],
      similarProducts: product.similarProducts || []
    };

    res.status(200).json(priceComparisons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions for external API calls
const searchShopee = async (query) => {
  try {
    const response = await axios.get(`${SHOPEE_API.baseURL}/search`, {
      params: {
        keyword: query,
        partner_id: SHOPEE_API.partnerId,
        timestamp: Math.floor(Date.now() / 1000)
      },
      headers: {
        'Authorization': `Bearer ${SHOPEE_API.partnerKey}`
      }
    });

    return response.data.items.map(item => ({
      id: item.itemid,
      name: item.name,
      price: item.price,
      platform: 'shopee',
      seller: item.shop_name,
      rating: item.item_rating?.rating_star || 0,
      authenticityScore: calculateAuthenticityScore(item)
    }));
  } catch (error) {
    console.error('Shopee API error:', error);
    return [];
  }
};

const searchLazada = async (query) => {
  try {
    const response = await axios.get(`${LAZADA_API.baseURL}/search`, {
      params: {
        q: query,
        app_key: LAZADA_API.appKey,
        timestamp: Math.floor(Date.now() / 1000)
      },
      headers: {
        'Authorization': `Bearer ${LAZADA_API.appSecret}`
      }
    });

    return response.data.products.map(product => ({
      id: product.productId,
      name: product.title,
      price: product.price,
      platform: 'lazada',
      seller: product.sellerName,
      rating: product.rating || 0,
      authenticityScore: calculateAuthenticityScore(product)
    }));
  } catch (error) {
    console.error('Lazada API error:', error);
    return [];
  }
};

const calculateAuthenticityScore = (product) => {
  // Implement your authenticity scoring algorithm here
  // This is a placeholder implementation
  const baseScore = 50;
  const ratingBonus = (product.rating || 0) * 10;
  const sellerScore = product.seller_rating || 0;
  
  return Math.min(100, baseScore + ratingBonus + sellerScore);
}; 