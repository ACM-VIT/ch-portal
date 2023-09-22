// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvovLmGEPKWSqO9-r1Ko5h_UDP3HPhXCk",
  authDomain: "cryptic-hunt-6e249.firebaseapp.com",
  projectId: "cryptic-hunt-6e249",
  storageBucket: "cryptic-hunt-6e249.appspot.com",
  messagingSenderId: "748211008196",
  appId: "1:748211008196:web:9df3d6e07c8235a9edcf91",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
