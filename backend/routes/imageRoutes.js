import express from 'express';
import multer from 'multer';
import { uploadImage, verifyImage } from '../controllers/imageController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authenticateUser, upload.single('image'), uploadImage);
router.post('/verify', authenticateUser, verifyImage);

export default router; 