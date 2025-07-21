import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn02fzIm_TYszOqFOvc4ZFjYHcttQfQ2k",
  authDomain: "final-project-df73a.firebaseapp.com",
  projectId: "final-project-df73a",
  storageBucket: "final-project-df73a.firebasestorage.app",
  messagingSenderId: "883366715261",
  appId: "1:883366715261:web:219b5a0fb7d6bd27d9f614",
  measurementId: "G-QE0H15LC33"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);