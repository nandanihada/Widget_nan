import mongoose, { Schema, Document } from 'mongoose';

export interface IWidgetResponse {
  projectId: string;
  responses: Record<string, any>;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface WidgetResponseDocument extends Omit<IWidgetResponse, '_id'>, Document {}

const WidgetResponseSchema: Schema = new Schema({
  projectId: {
    type: String,
    required: true,
    index: true
  },
  responses: {
    type: Schema.Types.Mixed,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
WidgetResponseSchema.index({ projectId: 1, submittedAt: -1 });

export default mongoose.model<WidgetResponseDocument>('WidgetResponse', WidgetResponseSchema);
