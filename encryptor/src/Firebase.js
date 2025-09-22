// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf0jQxfYoJl8KZSRFyqzq_1gFlmFrupbw",
  authDomain: "fileencryptor-a2f0a.firebaseapp.com",
  projectId: "fileencryptor-a2f0a",
  storageBucket: "fileencryptor-a2f0a.appspot.com", 
  messagingSenderId: "699545178960",
  appId: "1:699545178960:web:51f18a87b500905f915255",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
