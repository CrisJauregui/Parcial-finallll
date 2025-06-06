import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCAlFdhwo0XagLRpX3Ny49yhJOkV-UbxD0",
  authDomain: "asistente-personal-de-cris.firebaseapp.com",
  projectId: "asistente-personal-de-cris",
  storageBucket: "asistente-personal-de-cris.firebasestorage.app",
  messagingSenderId: "748125015786",
  appId: "1:748125015786:web:8fcff8e2566425f5ced193",
  measurementId: "G-QZ6MJDDQEE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);