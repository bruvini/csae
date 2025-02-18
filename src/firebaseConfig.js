// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP55rYzepvZO_uqmvkGFQIEoENJRtxZeM",
  authDomain: "csaefloripa.firebaseapp.com",
  projectId: "csaefloripa",
  storageBucket: "csaefloripa.firebasestorage.app",
  messagingSenderId: "906236888423",
  appId: "1:906236888423:web:45e50392a83ca3333a9bc2",
  measurementId: "G-BQDMRCR89V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
