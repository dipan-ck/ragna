import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  model: 'gpt-3.5-turbo' | 'gpt-4' |  'gemini-2.0-flash' | 'Kimi-K2-Instruct' | "deepSeek-r1";
  AgentInstructions?: string;
  tokensUsed: number;
  status: 'active' | 'inactive';
  namespace: string;
  totalFiles: number;
  createdAt: Date;
  updatedAt: Date;
}


const projectSchema = new Schema<IProject>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  model: { 
    type: String, 
    enum: ['gpt-3.5-turbo', 'gpt-4', "gemini-2.0-flash", "Kimi-K2-Instruct" ,"deepSeek-r1"], 
    required: true 
  },
  AgentInstructions: { 
    type: String, 
    required : true
  },
  tokensUsed: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  namespace: {
    type: String,
    required: true,
    unique: true
  },
  totalFiles: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});



const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;
