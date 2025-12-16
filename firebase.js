// Firebase CDN SDKs (WORKS ON GITHUB PAGES)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ YOUR FIREBASE CONFIG (PASTED & FIXED)
const firebaseConfig = {
  apiKey: "AIzaSyAdAEDwbkapoWf5FRWywQ3Lc_yee2fLbck",
  authDomain: "project1-27eeb.firebaseapp.com",
  projectId: "project1-27eeb",
  storageBucket: "project1-27eeb.appspot.com",
  messagingSenderId: "372685998416",
  appId: "1:372685998416:web:ed24ead6124ef88c028455"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= REGISTER =================
window.registerUser = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // store role (default = student)
    await setDoc(doc(db, "users", cred.user.uid), {
      role: "student",
      email: email
    });

    alert("Registration successful. You can now login.");
  } catch (error) {
    alert(error.message);
  }
};

// ================= LOGIN =================
window.loginUser = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
    closeLogin();
    showSection("student");
  } catch (error) {
    alert(error.message);
  }
};
