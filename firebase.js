import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export { app, analytics };