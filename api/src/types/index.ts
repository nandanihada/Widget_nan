// Local types for the Dynamic Widget API

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
  questions?: IQuestion[];
  settings?: Partial<IProjectSettings>;
}

export interface IQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'boolean';
  options?: string[];
  required: boolean;
  order: number;
}

export interface IProjectSettings {
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
