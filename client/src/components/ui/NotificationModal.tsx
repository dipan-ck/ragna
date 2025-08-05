'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react'; // Import more icons
import { useNotificationUnreadCheck } from "@/lib/hooks/useNotificationUnreadCheck";
import Loader from './Loader';

// Define a type for notification
type NotificationType = 'warning' | 'info' | 'success' | 'default';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
  type?: NotificationType;
}

function getIconForType(type: NotificationType | undefined) {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="text-yellow-400 w-5 h-5" />;
    case 'info':
      return <Info className="text-blue-400 w-5 h-5" />;
    case 'success':
      return <CheckCircle className="text-green-400 w-5 h-5" />;
    default:
      return <Bell className="text-gray-400 w-5 h-5" />;
  }
}

export default function NotificationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const {refetch : notificationStatus} = useNotificationUnreadCheck();

  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notification/get-notifications`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notification/${id}/read`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      notificationStatus()
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 custom-scrollbar right-16 w-96 bg-black border border-neutral-800 rounded-xl shadow-2xl z-50 py-4 max-h-[30rem] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-medium pl-4 text-lg">Notifications</h2>
        <button onClick={onClose} className="text-sm px-3 text-gray-400 hover:text-gray-200">
          Close
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader/>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`flex items-start gap-3 p-3 my-2  border-t ${
              n.read ? 'bg-[#000] border-neutral-800' : 'bg-[#000000] border-neutral-700'
            }`}
          >
            <div className="pt-1">
              {getIconForType(n.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white leading-snug">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              {!n.read && (
                <button
                  className="mt-2 text-xs text-blue-400 hover:underline"
                  onClick={() => markAsRead(n._id)}
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
