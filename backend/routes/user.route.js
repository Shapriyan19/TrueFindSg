const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/firebaseAuth');
const userCtrl = require('../controllers/userController');

router.use(verifyFirebaseToken);

// Profile
router.post('/profile', userCtrl.saveUserProfile);
router.get('/profile', userCtrl.getUserProfile);

// Verified Products
router.post('/verified', userCtrl.addToVerified);
router.get('/verified', userCtrl.getVerified);

// Watchlist
router.post('/watchlist', userCtrl.addToWatchlist);
router.get('/watchlist', userCtrl.getWatchlist);

// Reports
router.post('/report', userCtrl.submitUserReport);
router.get('/reports', userCtrl.getUserReports);

module.exports = router;
