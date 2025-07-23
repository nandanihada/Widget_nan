import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password?: string;
  name: string;
  projects: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  projects: [{
    type: String,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre<UserDocument>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<UserDocument>('User', UserSchema);
