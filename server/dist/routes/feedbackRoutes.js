import express from 'express';
import Feedback from 'models/Feedback';
const router = express.Router();
router.post('/send', async (req, res) => {
    const { name, email, feedback } = req.body;
    console.log(name, email, feedback);
    if (!name || !email || !feedback) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    try {
        await Feedback.create({ name, email, feedback });
        return res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error saving feedback:', err);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});
export default router;
