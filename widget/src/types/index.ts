export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'boolean';
  required: boolean;
  options?: string[];
}

export interface ProjectSettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
  };
  behavior?: {
    showProgressBar?: boolean;
    allowBack?: boolean;
  };
  branding?: {
    showPoweredBy?: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  questions: Question[];
  settings?: ProjectSettings;
}
