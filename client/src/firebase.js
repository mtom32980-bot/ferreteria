import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyBsVBrZOC3o0IqQx8NbwiotiVlZKK8WHJM",
  authDomain: "ferreteria-a0636.firebaseapp.com",
  projectId: "ferreteria-a0636",
  storageBucket: "ferreteria-a0636.firebasestorage.app",
  messagingSenderId: "926455892553",
  appId: "1:926455892553:web:4747c9e8346580df970d98"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);