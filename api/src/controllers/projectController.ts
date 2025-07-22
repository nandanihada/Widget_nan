import { Request, Response } from 'express';
import Project from '../models/Project';
import WidgetResponse from '../models/WidgetResponse';
import { ApiResponse, CreateProjectRequest, UpdateProjectRequest } from '../../../shared/types';
import { AuthRequest } from '../middleware/auth';

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: project.toJSON()
    } as ApiResponse);

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get project'
    } as ApiResponse);
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description }: CreateProjectRequest = req.body;
    const userId = req.user!.userId;

    const project = new Project({
      name,
      description,
      userId,
      questions: [],
      settings: {}
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project.toJSON(),
      message: 'Project created successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    } as ApiResponse);
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const updateFields: UpdateProjectRequest = req.body;

    const project = await Project.findOneAndUpdate(
      { projectId },
      { $set: updateFields },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: project.toJSON(),
      message: 'Project updated successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    } as ApiResponse);
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { responses } = req.body;

    const widgetResponse = new WidgetResponse({
      projectId,
      responses,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'Unknown'
    });

    await widgetResponse.save();

    res.status(201).json({
      success: true,
      message: 'Response submitted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit response'
    } as ApiResponse);
  }
};
