import mongoose, { Schema, Document } from 'mongoose';
import { Project as IProject, Question, ProjectSettings } from '../../../shared/types';

export interface ProjectDocument extends IProject, Document {}

const QuestionSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'text', 'rating', 'boolean'],
    required: true
  },
  options: [{
    type: String
  }],
  required: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  }
}, { _id: false });

const ProjectSettingsSchema = new Schema({
  theme: {
    primaryColor: { type: String, default: '#007bff' },
    secondaryColor: { type: String, default: '#6c757d' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#333333' },
    borderRadius: { type: String, default: '8px' }
  },
  branding: {
    showPoweredBy: { type: Boolean, default: true },
    customLogo: String
  },
  behavior: {
    autoSubmit: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: true },
    allowBack: { type: Boolean, default: true }
  }
}, { _id: false });

const ProjectSchema: Schema = new Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  questions: [QuestionSchema],
  settings: {
    type: ProjectSettingsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

// Generate unique projectId before saving
ProjectSchema.pre<ProjectDocument>('save', async function(next) {
  if (!this.isNew) return next();
  
  if (!this.projectId) {
    // Generate a unique project ID
    const generateId = () => Math.random().toString(36).substr(2, 9);
    let newProjectId = generateId();
    
    // Ensure uniqueness
    while (await mongoose.model('Project').findOne({ projectId: newProjectId })) {
      newProjectId = generateId();
    }
    
    this.projectId = newProjectId;
  }
  
  next();
});

export default mongoose.model<ProjectDocument>('Project', ProjectSchema);
