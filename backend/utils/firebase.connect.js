// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzxsu0jN_Ew7hZj0MV2fdQhWbmHyqAEJE",
  authDomain: "truefindsg.firebaseapp.com",
  databaseURL: "https://truefindsg-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "truefindsg",
  storageBucket: "truefindsg.firebasestorage.app",
  messagingSenderId: "1072389490184",
  appId: "1:1072389490184:web:6e28ebce6bcbb3021a33bd",
  measurementId: "G-96M9M011QC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;