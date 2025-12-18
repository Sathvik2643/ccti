import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc,
  getDocs, deleteDoc, collection
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyAdAEDwbkapoWf5FRWywQ3Lc_yee2fLbck",
  authDomain: "project1-27eeb.firebaseapp.com",
  projectId: "project1-27eeb"
});

const auth = getAuth(app);
const db = getFirestore(app);

window.logoutUser = async () => {
  await signOut(auth);
  location.href = "index.html";
};

let allUsers = [];
let currentView = null;

/* ===== AUTH GUARD ===== */
onAuthStateChanged(auth, async user => {
  if (!user || !location.pathname.includes("admin")) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.data().role !== "admin") {
    alert("Access denied");
    location.href = "login.html";
    return;
  }

  const usersSnap = await getDocs(collection(db, "users"));
  allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  totalStudents.innerText = allUsers.filter(u => u.role === "student").length;
  totalAdmins.innerText = allUsers.filter(u => u.role === "admin").length;
});

/* ===== TOGGLE STUDENT / ADMIN LIST ===== */
window.toggleUserList = role => {
  const box = userListContainer;
  const search = studentSearch;

  if (currentView === role) {
    box.style.display = "none";
    search.style.display = "none";
    currentView = null;
    return;
  }

  currentView = role;
  box.style.display = "block";
  search.style.display = role === "student" ? "block" : "none";

  renderUsers(allUsers.filter(u => u.role === role));
};

/* ===== SEARCH STUDENTS ONLY ===== */
window.searchStudents = txt => {
  renderUsers(
    allUsers.filter(
      u => u.role === "student" &&
      u.email.toLowerCase().includes(txt.toLowerCase())
    )
  );
};

/* ===== RENDER TABLE ===== */
function renderUsers(users) {
  userTable.innerHTML = "";
  users.forEach(u => {
    userTable.innerHTML += `
      <tr>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <select onchange="changeUserRole('${u.id}',this.value)">
            <option value="student" ${u.role==="student"?"selected":""}>Student</option>
            <option value="admin" ${u.role==="admin"?"selected":""}>Admin</option>
          </select>
        </td>
        <td>
          <button class="btn danger" onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

window.changeUserRole = (id, role) =>
  setDoc(doc(db,"users",id),{role},{merge:true}).then(()=>location.reload());

window.deleteUser = id =>
  confirm("Delete user?") &&
  deleteDoc(doc(db,"users",id)).then(()=>location.reload());
