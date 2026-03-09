// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr76chPjlXQbG0Q271vQsgcwJmX13t0hk",
  authDomain: "jectmoapp.firebaseapp.com",
  projectId: "jectmoapp",
  storageBucket: "jectmoapp.firebasestorage.app",
  messagingSenderId: "151278844774",
  appId: "1:151278844774:web:ceed81cd7bf51019ae66a7",
  measurementId: "G-LWE71VMLSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app);