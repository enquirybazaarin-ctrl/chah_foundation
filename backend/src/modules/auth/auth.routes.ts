import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from './auth.controller';
import { protect } from './auth.middleware';

const router = Router();

// In-memory rate limiting for login to prevent brute force attacks
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginRateLimiter, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

export default router;
