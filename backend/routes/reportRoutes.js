import express from 'express';
import { submitReport, getReports, updateReportStatus, getPublicReports, upvoteReport, downvoteReport } from '../controllers/reportController.js';
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, submitReport);
router.get('/', authenticateUser, getReports);
router.get('/public', getPublicReports);
router.put('/:reportId/status', authenticateUser, isAdmin, updateReportStatus);
router.post('/:reportId/upvote', authenticateUser, upvoteReport);
router.post('/:reportId/downvote', authenticateUser, downvoteReport);

export default router; 