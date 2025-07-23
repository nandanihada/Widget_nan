import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { LoginRequest, RegisterRequest, ApiResponse, AuthTokenPayload } from '../types';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      } as ApiResponse);
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      projects: []
    });

    await user.save();

    // Generate JWT token
    const tokenPayload: Omit<AuthTokenPayload, 'iat' | 'exp'> = {
      userId: (user._id as any).toString(),
      email: user.email
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      },
      message: 'User registered successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
    }

    // Generate JWT token
    const tokenPayload: Omit<AuthTokenPayload, 'iat' | 'exp'> = {
      userId: (user._id as any).toString(),
      email: user.email
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      },
      message: 'Login successful'
    } as ApiResponse);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    } as ApiResponse);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // User ID comes from auth middleware
    const userId = (req as any).user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: { user: user.toJSON() }
    } as ApiResponse);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    } as ApiResponse);
  }
};
