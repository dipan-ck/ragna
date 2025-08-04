import { Notification } from "../models/Notification";
export const sendNotification = async (userId, type, message) => {
    try {
        await Notification.create({ userId, type, message });
    }
    catch (err) {
        console.error("Failed to send notification:", err);
    }
};
