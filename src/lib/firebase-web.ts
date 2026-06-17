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

// Helper references exclusively for the React Website
const websiteCollection = collection(db, "website_data");
const webProductsCollection = collection(db, "products"); // Website uses the root 'products'
const webOrdersCollection = collection(db, "orders"); // Website uses the root 'orders'
const webRecipesCollection = collection(db, "recipes"); // Recipes collection

export { 
  app, 
  db, 
  storage,
  websiteCollection, 
  webProductsCollection,
  webOrdersCollection,
  webRecipesCollection
};
