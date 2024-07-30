// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwEAaXPNT9JhY-65cmdD8CbyRHfwPU0PA",
  authDomain: "thesistribe-710aa.firebaseapp.com",
  projectId: "thesistribe-710aa",
  storageBucket: "thesistribe-710aa.appspot.com",
  messagingSenderId: "1077858255940",
  appId: "1:1077858255940:web:9a2ce27362fb38cac96811"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authKey = getAuth(app)
export const database = getDatabase(app);
export const firestoreKey = getFirestore(app)
export const googleProvider = new GoogleAuthProvider();