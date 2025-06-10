import express from 'express';
import { getProfile, updateProfile, addToWatchlist, removeFromWatchlist, getWatchlist } from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/watchlist', addToWatchlist);
router.delete('/watchlist/:watchlistItemId', removeFromWatchlist);
router.get('/watchlist', getWatchlist);

export default router; 