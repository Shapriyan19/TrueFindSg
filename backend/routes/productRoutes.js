import express from 'express';
import { searchProducts, getProductDetails, comparePrices } from '../controllers/productController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/search', searchProducts);
router.get('/:productId', getProductDetails);
router.get('/:productId/compare', authenticateUser, comparePrices);

export default router; 