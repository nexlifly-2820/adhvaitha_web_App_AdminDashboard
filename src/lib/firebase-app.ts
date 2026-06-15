import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once to prevent errors in Next.js hot-reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Helper references exclusively for the Flutter App
const appCollection = collection(db, "app_data");
const appProductsCollection = collection(db, "products_app");
const appOrdersCollection = collection(db, "orders_app");
// Note: We moved coupons into app_data, but keeping the old collection reference just in case.
const couponsCollection = collection(db, "coupons");

export { 
  app, 
  db, 
  storage,
  appCollection,
  appProductsCollection,
  appOrdersCollection,
  couponsCollection
};
