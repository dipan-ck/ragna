import mongoose from 'mongoose';
const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    feedback: { type: String, required: true },
}, { timestamps: true });
export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
