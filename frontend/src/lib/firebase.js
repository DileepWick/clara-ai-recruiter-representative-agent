// src/lib/firebase/firebase.js (or similar path)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth for Authentication

// Your web app's Firebase configuration
// (You'll find this in your Firebase project settings in the console)
const firebaseConfig = {
  apiKey: "AIzaSyAupC0d8k3ganIb7KH14U1vehnP9QlydJM",
  authDomain: "clara-recruiter-rep.firebaseapp.com",
  projectId: "clara-recruiter-rep",
  storageBucket: "clara-recruiter-rep.firebasestorage.app",
  messagingSenderId: "283187403534",
  appId: "1:283187403534:web:659cd45e75a5fb0540955f",
  measurementId: "G-WETVFKV4P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
export const auth = getAuth(app); // Export the auth instance
