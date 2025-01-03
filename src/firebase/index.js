// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKbIblCdwYXi6rrEbogHcy3EBtc-VD6Fg",
  authDomain: "clone-ai-c09c5.firebaseapp.com",
  projectId: "clone-ai-c09c5",
  storageBucket: "clone-ai-c09c5.firebasestorage.app",
  messagingSenderId: "654181001423",
  appId: "1:654181001423:web:e2fbcd12a498cba301efba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup,db };
