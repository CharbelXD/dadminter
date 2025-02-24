// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKxtFfZRSar5vboGA2u0uvf27seYajwAM",
  authDomain: "minter-demo.firebaseapp.com",
  projectId: "minter-demo",
  storageBucket: "minter-demo.firebasestorage.app",
  messagingSenderId: "478022043797",
  appId: "1:478022043797:web:2a9d7f5c856e877f4df39c",
  measurementId: "G-37D47T6S6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app,db}
