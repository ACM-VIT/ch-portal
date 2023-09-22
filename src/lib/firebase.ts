// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDluoN64Ybi4Xd8PjcN7qhw6ZIxU5fHxCM",
  authDomain: "cryptic-hunt-2022.firebaseapp.com",
  projectId: "cryptic-hunt-2022",
  storageBucket: "cryptic-hunt-2022.appspot.com",
  messagingSenderId: "907690053743",
  appId: "1:907690053743:web:498ea3dc5f01e4fc6a7d9a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
