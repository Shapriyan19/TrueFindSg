import { readFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { database } from '../config/firebase.js';
import { ref, set } from 'firebase/database';

const uploadCSVToFirebase = async () => {
  try {
    const filePath = './data/Updated_Product_Listings_with_Images.csv'; // Place CSV here
    const fileContent = await readFile(filePath, 'utf8');
    const records = parse(fileContent, { columns: true });

    for (const record of records) {
      const productRef = ref(database, `products/${record.product_id}`);
      
      const formattedData = {
        name: record.product_name,
        brand: record.brand,
        category: record.category,
        platform: record.listing_platform,
        seller: record.seller_name,
        url: record.listing_url,
        price: parseFloat(record.price_sgd),
        description: record.description,
        keyFeatures: JSON.parse(record.key_features.replace(/'/g, '"')),
        image_url: record.image_url,
        authenticityScore: parseFloat(record.authenticity_confidence_score),
        authenticityReasons: record.authenticity_reasons,
        isFake: record.is_fake === 'True'
      };

      await set(productRef, formattedData);
      console.log(`Uploaded: ${record.product_id}`);
    }

    console.log('✅ All products uploaded to Firebase.');
  } catch (err) {
    console.error('❌ Error uploading products:', err);
  }
};

uploadCSVToFirebase();
