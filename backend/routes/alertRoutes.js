import express from 'express';
import { fetchLatestAlerts, ingestAlerts } from '../controllers/alertController.js';
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', fetchLatestAlerts);
router.post('/ingest', authenticateUser, isAdmin, ingestAlerts);

export default router; 