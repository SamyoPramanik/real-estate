// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-18c63.firebaseapp.com",
    projectId: "real-estate-18c63",
    storageBucket: "real-estate-18c63.appspot.com",
    messagingSenderId: "21081172842",
    appId: "1:21081172842:web:1733a625c49ef436051313",
    measurementId: "G-EHFX46R4BZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
