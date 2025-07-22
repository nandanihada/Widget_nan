// Shared types for the Dynamic Widget System

export interface Question {
  _id?: string;
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'boolean';
  options?: string[];
  required: boolean;
  order: number;
}

export interface Project {
  _id?: string;
  projectId: string;
  name: string;
  description?: string;
  userId: string;
  questions: Question[];
  settings: ProjectSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
  };
  branding: {
    showPoweredBy: boolean;
    customLogo?: string;
  };
  behavior: {
    autoSubmit: boolean;
    showProgressBar: boolean;
    allowBack: boolean;
  };
}

export interface User {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  projects: string[];
  createdAt?: Date;
}

export interface WidgetResponse {
  _id?: string;
  projectId: string;
  responses: Record<string, any>;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  questions?: Question[];
  settings?: Partial<ProjectSettings>;
}

export interface WidgetConfig {
  projectId: string;
  apiUrl: string;
  theme?: Partial<ProjectSettings['theme']>;
}
