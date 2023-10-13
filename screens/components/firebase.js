import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxAnG08qtWrWcHcKzc9ofWbPPMWoZsqlU",
  authDomain: "akremha-8a59d.firebaseapp.com",
  projectId: "akremha-8a59d",
  storageBucket: "akremha-8a59d.appspot.com",
  messagingSenderId: "676201414268",
  appId: "1:676201414268:web:b18b99518fc8be1b1453f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
// Initialize Firebase Auth
const auth = getAuth(app);  // Make sure this line is present
export { app, db ,auth};