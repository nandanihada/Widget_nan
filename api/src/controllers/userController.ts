import { Response } from 'express';
import Project from '../models/Project';
import WidgetResponse from '../models/WidgetResponse';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getUserProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    } as ApiResponse);

  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user projects'
    } as ApiResponse);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.userId;

    const project = await Project.findOneAndDelete({ 
      projectId, 
      userId 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse);
    }

    // Also delete all responses for this project
    await WidgetResponse.deleteMany({ projectId });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    } as ApiResponse);
  }
};

export const getProjectResponses = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.userId;

    // First verify the project belongs to the user
    const project = await Project.findOne({ projectId, userId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse);
    }

    const responses = await WidgetResponse.find({ projectId })
      .sort({ submittedAt: -1 })
      .limit(100); // Limit to last 100 responses

    res.json({
      success: true,
      data: responses
    } as ApiResponse);

  } catch (error) {
    console.error('Get project responses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get project responses'
    } as ApiResponse);
  }
};
