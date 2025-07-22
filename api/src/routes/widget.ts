import express from 'express';
import { getProject, createProject, updateProject, submitResponse } from '../controllers/projectController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';

const router = express.Router();

// Public routes for widget
router.get('/:projectId', getProject);
router.post('/:projectId/submit', validate(schemas.submitResponse), submitResponse);

// Protected admin routes
router.post('/', authenticateToken, validate(schemas.createProject), createProject);
router.put('/:projectId', authenticateToken, validate(schemas.updateProject), updateProject);

export default router;
