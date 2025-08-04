import { PLAN_LIMITS } from 'config/Plans';
import User from 'models/User';
export default async function checkProjectLimit(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const currentProjects = user.usage.projectsCreated;
        const limits = PLAN_LIMITS[user.plan];
        if (!limits)
            return res.status(403).json({ success: false, message: 'Unknown plan' });
        if (currentProjects >= limits.maxProjects) {
            return res.status(403).json({ success: false, message: `Project limit exceeded. Max projects for ${user.plan} plan is ${limits.maxProjects}` });
        }
        const { model } = req.body;
        if (!model)
            return res.status(400).json({ success: false, message: 'Model not specified' });
        if (!limits.allowedModels.includes(model)) {
            return res.status(403).json({ succes: false, message: `Model ${model} is not allowed for your plan` });
        }
        next();
    }
    catch (error) {
        console.error('Error checking project limit:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
