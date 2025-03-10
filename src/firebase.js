// sari services jo jo chahiye import karlo
import { initializeApp } from "firebase/app";   //ye to basic hai hota hi hai
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
// import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

//initializing firebase
//basically sb services ka reference lelo jo jo import kari
// kyu?? --  to use them ek reference chahiye na
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);   //reference authentication services ke liye
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {auth, db, googleProvider, facebookProvider};


