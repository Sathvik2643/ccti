/* ================= FIREBASE IMPORTS ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore, doc, setDoc, getDoc, getDocs,
  deleteDoc, collection, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAdAEDwbkapoWf5FRWywQ3Lc_yee2fLbck",
  authDomain: "project1-27eeb.firebaseapp.com",
  projectId: "project1-27eeb"
};

/* ================= INIT ================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= HELPERS ================= */
const emailInput = () => document.getElementById("email")?.value || "";
const passwordInput = () => document.getElementById("password")?.value || "";
const errorBox = () => document.getElementById("errorMsg");

/* ================= AUTH ================= */
window.loginUser = async () => {
  try {
    const cred = await signInWithEmailAndPassword(auth, emailInput(), passwordInput());
    if (!cred.user.emailVerified) throw "Verify email";

    const snap = await getDoc(doc(db, "users", cred.user.uid));
    location.href = snap.data().role === "admin" ? "admin.html" : "student.html";
  } catch {
    errorBox().textContent = "Login failed";
  }
};

window.registerUser = async () => {
  const cred = await createUserWithEmailAndPassword(auth, emailInput(), passwordInput());
  await setDoc(doc(db, "users", cred.user.uid), {
    email: emailInput(),
    role: "student",
    courses: []
  });
  await sendEmailVerification(cred.user);
  errorBox().textContent = "Verification email sent";
};

window.logoutUser = async () => {
  await signOut(auth);
  location.href = "index.html";
};

/* ================= ADMIN GUARD ================= */
let allUsers = [];

onAuthStateChanged(auth, async user => {
  if (!user) return;

  if (location.pathname.includes("admin.html")) {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists() || snap.data().role !== "admin") {
      alert("Access denied");
      location.href = "login.html";
      return;
    }
    await loadAdminData();
  }

  if (document.getElementById("studentEmail")) {
    document.getElementById("studentEmail").innerText = user.email;
    loadStudentCourses(user.uid);
  }
});

/* ================= ADMIN USERS ================= */
async function loadAdminData() {
  const snap = await getDocs(collection(db, "users"));
  allUsers = [];

  let total = 0, students = 0, admins = 0;
  snap.forEach(d => {
    const u = { id: d.id, ...d.data() };
    allUsers.push(u);
    total++;
    if (u.role === "student") students++;
    if (u.role === "admin") admins++;
  });

  totalUsers.innerText = total;
  totalStudents.innerText = students;
  totalAdmins.innerText = admins;

  loadCourses();
  loadStudents();
}

window.filterUsers = (role) => {
  const box = document.getElementById("userListContainer");
  box.style.display = "block";
  renderUsers(role ? allUsers.filter(u => u.role === role) : allUsers);
};

function renderUsers(users) {
  const table = document.getElementById("userTable");
  table.innerHTML = "";

  users.forEach(u => {
    table.innerHTML += `
      <tr>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <select onchange="changeUserRole('${u.id}', this.value)">
            <option value="student" ${u.role === "student" ? "selected" : ""}>Student</option>
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
          </select>
        </td>
        <td>
          <button class="btn danger" onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

window.changeUserRole = async (id, role) => {
  await setDoc(doc(db, "users", id), { role }, { merge: true });
  location.reload();
};

window.deleteUser = async (id) => {
  if (!confirm("Delete user?")) return;
  await deleteDoc(doc(db, "users", id));
  location.reload();
};

/* ================= COURSES ================= */
let courseCache = [];

async function loadCourses() {
  const list = document.getElementById("courseList");
  const select = document.getElementById("courseSelect");
  list.innerHTML = "";
  select.innerHTML = "";

  const snap = await getDocs(collection(db, "courses"));
  courseCache = [];

  snap.forEach(d => {
    const c = { id: d.id, ...d.data() };
    courseCache.push(c);

    list.innerHTML += `<li><strong>${c.name}</strong><br>${c.description}</li>`;
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

window.addCourse = async () => {
  const name = courseName.value.trim();
  const desc = courseDesc.value.trim();
  if (!name || !desc) return alert("Fill all fields");

  await addDoc(collection(db, "courses"), { name, description: desc });
  courseName.value = courseDesc.value = "";
  loadCourses();
};

async function loadStudents() {
  const select = document.getElementById("studentSelect");
  select.innerHTML = "";

  const snap = await getDocs(collection(db, "users"));
  snap.forEach(d => {
    if (d.data().role === "student") {
      select.innerHTML += `<option value="${d.id}">${d.data().email}</option>`;
    }
  });
}

window.assignCourse = async () => {
  const uid = studentSelect.value;
  const cid = courseSelect.value;

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  const courses = snap.data().courses || [];

  if (!courses.includes(cid)) {
    courses.push(cid);
    await setDoc(ref, { courses }, { merge: true });
    alert("Course assigned");
  }
};

/* ================= CERTIFICATES ================= */
window.addCertificate = async () => {
  await setDoc(doc(db, "certificates", certId.value), {
    studentEmail: certEmail.value,
    course: certCourse.value,
    fileUrl: certLink.value
  });
  alert("Certificate added");
};

/* ================= STUDENT ================= */
async function loadStudentCourses(uid) {
  const box = document.getElementById("studentCourses");
  if (!box) return;

  const snap = await getDoc(doc(db, "users", uid));
  const ids = snap.data().courses || [];

  box.innerHTML = "";
  for (const id of ids) {
    const c = await getDoc(doc(db, "courses", id));
    if (c.exists()) {
      box.innerHTML += `<p><strong>${c.data().name}</strong> - ${c.data().description}</p>`;
    }
  }
}

/* ================= ACCORDION ================= */
window.toggleAccordion = index => {
  document.querySelectorAll(".accordion-content").forEach((el, i) => {
    el.style.display = i === index && el.style.display !== "block" ? "block" : "none";
  });
};
