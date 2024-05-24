// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi36V9-iBxEXIRk2MLnF7VrFL14J_AAOk",
  authDomain: "diettracking-e18a0.firebaseapp.com",
  projectId: "diettracking-e18a0",
  storageBucket: "diettracking-e18a0.appspot.com",
  messagingSenderId: "370630811319",
  appId: "1:370630811319:web:5777b6a079033859c5b732"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Authentication
export const auth = getAuth(app);
//Database
export const db = getFirestore(app);
//Bucket storage
export const storage = getStorage(app);
export default app;