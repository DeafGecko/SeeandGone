import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
      apiKey: "AIzaSyDcfiRVm91TCMiH8RlFxnjAYqAqN8NXVbc",
      authDomain: "seeandgone.firebaseapp.com",
      projectId: "seeandgone",
      storageBucket: "seeandgone.firebasestorage.app",
      messagingSenderId: "462452861952",
      appId: "1:462452861952:web:52cec40832c5ce77fb7ce5",
      measurementId: "G-3MWN2PNMED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORT 'db' so NoteEditor and RecipientView can find it
export const db = getFirestore(app);