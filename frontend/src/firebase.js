// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNJ-lhjdD2yIiNcTxXdn8PWF8cwoPQrB8",
  authDomain: "owennsofu.com",
  databaseURL: "https://socialai-69b8f-default-rtdb.firebaseio.com",
  projectId: "socialai-69b8f",
  storageBucket: "socialai-69b8f.firebasestorage.app",
  messagingSenderId: "492544638101",
  appId: "1:492544638101:web:1fd711edcc68ec524e6f9c",
  measurementId: "G-K1BS01QYEB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com"); // Apple OAuth provider

export { auth, googleProvider, appleProvider };
export default app;
