import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
