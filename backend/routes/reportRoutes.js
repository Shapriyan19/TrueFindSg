import express from 'express';
import { submitReport, getReports, updateReportStatus, getPublicReports } from '../controllers/reportController.js';
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, submitReport);
router.get('/', authenticateUser, getReports);
router.get('/public', getPublicReports);
router.put('/:reportId/status', authenticateUser, isAdmin, updateReportStatus);

export default router; 