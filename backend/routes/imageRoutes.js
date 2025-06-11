import express from 'express';
import multer from 'multer';
import { verifyImage, verifyImageUrl } from '../controllers/imageController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/verify', authenticateUser, upload.single('image'), verifyImage);
router.post('/verify-url', authenticateUser, verifyImageUrl);

export default router; 