import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: function () {
            return !this.isOAuth;
        },
    },
    isOAuth: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'business'],
        default: 'free'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active'
    },
    stripeCustomerId: {
        type: String,
        default: ''
    },
    usage: {
        tokensUsed: { type: Number, default: 0 },
        filesUploaded: { type: Number, default: 0 },
        projectsCreated: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', userSchema);
export default User;
