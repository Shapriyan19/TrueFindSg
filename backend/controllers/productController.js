import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase.js';
import axios from 'axios';

export const searchProducts = async (req, res) => {
  try {
    const { query: searchQuery, platform, minScore, maxPrice } = req.query;
    console.log('Search request received:', { searchQuery, platform, minScore, maxPrice });

    // Firebase search
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    console.log('Total products in database:', snapshot.size);

    let products = [];
    snapshot.forEach((childSnapshot) => {
      const product = childSnapshot.val();
      console.log('Full product data from Firebase:', product);
      
      const productName = product.product_name || product.name || product.title || product.productName;
      console.log('Product name for search:', productName);
      console.log('Product platform:', product.platform);
      console.log('Product image URL:', product.image_url || product.imageUrl || product.photoUrl);

      const matchesQuery = searchQuery
        ? productName?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesPlatform = platform ? product.platform === platform : true;
      const matchesScore = minScore ? product.authenticity_confidence_score >= Number(minScore) : true;
      const matchesPrice = maxPrice ? product.price <= Number(maxPrice) : true;

      if (matchesQuery && matchesPlatform && matchesScore && matchesPrice) {
        products.push({ id: childSnapshot.key, ...product });
        console.log('Product matched and added to results:', childSnapshot.key);
      }
    });

    console.log('Final search results summary:', { 
      totalProducts: products.length,
      searchQuery,
      results: products.map(p => ({
        id: p.id,
        name: p.product_name || p.name || p.title || p.productName,
        platform: p.platform,
        imageUrl: p.image_url || p.imageUrl || p.photoUrl
      }))
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Search error:', error);
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
