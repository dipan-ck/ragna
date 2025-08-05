import express from 'express';
import { Notification } from 'models/Notification.js';
import verifyAuth from 'middlewares/verifyAuth.js';


const router = express.Router();

router.get('/get-notifications', verifyAuth, async (req, res) => {
    const userId = (req as any).user.id;
  
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  });

  
  

  router.patch('/:id/read', verifyAuth, async (req, res) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
  
    await Notification.updateOne({ _id: id, userId }, { $set: { read: true } });
    res.json({ success: true });
  });


  router.get('/unread-status', verifyAuth, async (req, res) => {
    const userId = (req as any).user.id;
  
    try {
      const hasUnread = await Notification.exists({ userId, read: false });
      res.json({ hasUnread: !!hasUnread });
    } catch (err) {
      console.error("Error checking unread notifications:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

  export default router;