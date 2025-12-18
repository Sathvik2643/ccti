import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* SAME CONFIG – DO NOT CHANGE */
const firebaseConfig = {
  apiKey: "AIzaSyAdAEDwbkapoWf5FRWywQ3Lc_yee2fLbck",
  authDomain: "project1-27eeb.firebaseapp.com",
  projectId: "project1-27eeb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= VERIFY CERTIFICATE ================= */
const btn = document.getElementById("verifyBtn");

btn?.addEventListener("click", async () => {
  const id = document
    .getElementById("certInput")
    .value.trim();

  const res = document.getElementById("certResult");
  const down = document.getElementById("certDownload");

  res.textContent = "";
  down.innerHTML = "";

  if (!id) {
    res.textContent = "Please enter certificate ID";
    res.style.color = "red";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "certificates", id));

    if (!snap.exists()) {
      res.textContent = "✖ INVALID Certificate";
      res.style.color = "red";
      return;
    }

    const data = snap.data();
    res.textContent = "✔ VALID Certificate";
    res.style.color = "green";

    const a = document.createElement("a");
    a.href = data.fileUrl;
    a.target = "_blank";
    a.className = "btn";
    a.textContent = "Download Certificate";

    down.appendChild(a);

  } catch {
    res.textContent = "Error verifying certificate";
    res.style.color = "red";
  }
});
