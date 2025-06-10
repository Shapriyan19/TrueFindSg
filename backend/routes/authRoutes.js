import express from 'express';
import { signup, login, logout, resetPassword, resendVerification } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);

export default router; 