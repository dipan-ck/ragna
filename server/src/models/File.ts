
import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  name: string;
  fileType: 'text';
  sizeKB: number;
  uploadedAt: Date;
}

const fileSchema = new Schema<IFile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  fileType: { type: String, enum: ['application/pdf', 'text', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], required: true },
  sizeKB: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFile>('File', fileSchema);
