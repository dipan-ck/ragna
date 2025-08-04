import { Notification } from "../models/Notification";

export const sendNotification = async (
  userId: string,
  type: "success" | "warning" | "info",
  message: string
) => {
  try {
    await Notification.create({ userId, type, message });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
};
