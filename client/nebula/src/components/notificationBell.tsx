/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";

interface Notification {
  id: number;
  type: string;
  payload: Record<string, any>;
  read: boolean;
  created: string;
}

interface NotificationBellProps {
  urlBase: string;
  fetchWithToken: (url: string, options?: RequestInit) => Promise<Response>;
}

const NotificationBell = ({
  urlBase,
  fetchWithToken,
}: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetchWithToken(
        `${urlBase}/notifications/unread-count`,
      );
      if (response.ok) {
        const count = await response.json();
        setUnreadCount(count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetchWithToken(`${urlBase}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetchWithToken(`${urlBase}/notifications/${notificationId}/read`, {
        method: "POST",
      });
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, [isOpen]);

  const formatNotification = (notification: Notification) => {
    if (notification.type === "PROJECT_STARRED") {
      return `Someone starred your project "${notification.payload.projectName}"`;
    }
    return "New notification";
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        className="rounded-full hover:bg-hover dark:hover:bg-opacity-30"
      >
        <i className="bx bx-bell text-xl h-8 w-8 flex items-center justify-center" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-80 bg-cardWhite dark:bg-card rounded-lg  border border-gray-200 dark:border-gray-500 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No notifications
              </p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read
                        ? "bg-gray-50 dark:bg-gray-700"
                        : "bg-blue-50 dark:bg-blue-900"
                    }`}
                  >
                    <p className="text-sm">
                      {formatNotification(notification)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.created).toLocaleDateString()}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 dark:text-blue-400 mt-2"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
