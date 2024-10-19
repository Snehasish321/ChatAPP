
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBx2SsF-zwCR4S9Yy5PcRy8Rre19pJs_FY",
  authDomain: "sambandha-6cc9c.firebaseapp.com",
  projectId: "sambandha-6cc9c",
  storageBucket: "sambandha-6cc9c.appspot.com",
  messagingSenderId: "844227761442",
  appId: "1:844227761442:web:0cb95383f4cfe9b314817b",
  measurementId: "G-VYEKXKCRNJ"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);