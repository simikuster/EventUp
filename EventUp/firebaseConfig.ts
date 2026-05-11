// firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbKT_3eUPWJJPVse0g523EV1rV6Kqh4WI",
    authDomain: "eventup-9d388.firebaseapp.com",
    databaseURL: "https://eventup-9d388-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "eventup-9d388",
    storageBucket: "eventup-9d388.firebasestorage.app",
    messagingSenderId: "836581101750",
    appId: "1:836581101750:web:9e03bfc1c2553f21ab5617",
};

// 🔥 Firebase initialisieren
const app = initializeApp(firebaseConfig);

// 🔥 Datenbank holen
export const db = getDatabase(app);
export const auth = getAuth(app);