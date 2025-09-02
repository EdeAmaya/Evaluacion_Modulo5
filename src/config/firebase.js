import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWOZNHJD8t3YMgyEU3HCmqSx0-X94mpmg",
  authDomain: "evaluacion-5854e.firebaseapp.com",
  projectId: "evaluacion-5854e",
  storageBucket: "evaluacion-5854e.firebasestorage.app",
  messagingSenderId: "969360230761",
  appId: "1:969360230761:web:76173692b56162fe4f95f8"
};

// Verificar si Firebase ya está inicializado
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase inicializado por primera vez");
} else {
  app = getApp();
  console.log("🔄 Firebase ya estaba inicializado, usando instancia existente");
}

const auth = getAuth(app);
const database = getFirestore(app);

console.log("✅ Auth y Database configurados correctamente");

export { auth, database };