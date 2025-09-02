import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración directa (temporal para testing)
const firebaseConfig = {
  apiKey: "AIzaSyBZs6_Rx2dGMyDttY11dBHvKyHwDQPKDhc",
  authDomain: "trabajodeclase-c369d.firebaseapp.com",
  projectId: "trabajodeclase-c369d",
  storageBucket: "trabajodeclase-c369d.firebasestorage.app",
  messagingSenderId: "187110573941",
  appId: "1:187110573941:web:22c8804201446a7319b53c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

export { auth, database };