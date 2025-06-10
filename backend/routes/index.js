import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import imageRoutes from './imageRoutes.js';
import reportRoutes from './reportRoutes.js';
import alertRoutes from './alertRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/images', imageRoutes);
router.use('/reports', reportRoutes);
router.use('/alerts', alertRoutes);

export default router; 