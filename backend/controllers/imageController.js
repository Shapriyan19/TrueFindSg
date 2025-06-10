import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase.js';
import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL;

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { buffer, originalname } = req.file;
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalname}`;
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `product-images/${filename}`);
    await uploadBytes(storageRef, buffer);
    const downloadURL = await getDownloadURL(storageRef);

    // Process image with OpenRouter API
    const verificationResult = await verifyImageWithOpenRouter(downloadURL);

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: downloadURL,
      verificationResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    const verificationResult = await verifyImageWithOpenRouter(imageUrl);
    res.status(200).json(verificationResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyImageWithOpenRouter = async (imageUrl) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        image_url: imageUrl,
        task: 'product_verification'
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { match_percentage, discrepancy_flags, analysis } = response.data;

    return {
      matchPercentage: match_percentage,
      discrepancyFlags: discrepancy_flags,
      analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to verify image');
  }
}; 