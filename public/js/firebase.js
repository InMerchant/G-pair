// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
// Import the Auth module from Firebase
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHDLToy27276ecWXRitLxjG12_U4Qpn7Y",
  authDomain: "look-b1624.firebaseapp.com",
  databaseURL: "https://look-b1624-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "look-b1624",
  storageBucket: "look-b1624.appspot.com",
  messagingSenderId: "118997797112",
  appId: "1:118997797112:web:c3c5fabf767d0d620ad30d",
  measurementId: "G-H6ZHRY2DV2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the storage service
export const storage = getStorage(app);

// Get a reference to the Firestore service
export const db = getFirestore(app);

// Initialize Firebase Auth and export it
export const auth = getAuth(app);