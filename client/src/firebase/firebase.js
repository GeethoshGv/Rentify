// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "rentify-mern.firebaseapp.com",
    projectId: "rentify-mern",
    storageBucket: "rentify-mern.appspot.com",
    messagingSenderId: "268657005127",
    appId: "1:268657005127:web:79f4dfc3e69e33d91f1762"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);