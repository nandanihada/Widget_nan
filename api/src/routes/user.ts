import express from 'express';
import { getUserProjects, deleteProject, getProjectResponses } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's projects
router.get('/projects', getUserProjects);

// Delete a project
router.delete('/projects/:projectId', deleteProject);

// Get project responses
router.get('/projects/:projectId/responses', getProjectResponses);

export default router;
