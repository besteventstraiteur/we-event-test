import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBlaH5EJ1Qvl1ZElSWF0LpeT0DUSc-P0nw",
  authDomain: "we-event-9c5e5.firebaseapp.com",
  projectId: "we-event-9c5e5",
  storageBucket: "we-event-9c5e5.firebasestorage.app",
  messagingSenderId: "29925625278",
  appId: "1:29925625278:web:672562ee94e1b835b3fdef",
  measurementId: "G-TK5RH3YD4S",
};

const app = initializeApp(firebaseConfig);

export const messaging: Messaging = getMessaging(app);
