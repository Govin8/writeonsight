// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmoUPtPtdgDwfdjNeBTwzHWRgW4-a17gw",
  authDomain: "writeonsight-auth.firebaseapp.com",
  projectId: "writeonsight-auth",
  storageBucket: "writeonsight-auth.firebasestorage.app",
  messagingSenderId: "948736778354",
  appId: "1:948736778354:web:bf32eef1e1e135bab9e2eb",
  measurementId: "G-947GJLRYNH"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


export { auth, googleProvider, facebookProvider, signInWithPopup };



