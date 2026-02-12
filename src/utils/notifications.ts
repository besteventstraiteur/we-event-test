import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    const permission: NotificationPermission =
      await Notification.requestPermission();

    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY as string,
    });

    return token ?? null;
  } catch (error) {
    console.error("FCM permission error:", error);
    return null;
  }
};
