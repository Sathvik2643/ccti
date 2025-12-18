import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendEmailVerification, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, getDocs,
  deleteDoc, collection, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdAEDwbkapoWf5FRWywQ3Lc_yee2fLbck",
  authDomain: "project1-27eeb.firebaseapp.com",
  projectId: "project1-27eeb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = () => document.getElementById("email")?.value || "";
const password = () => document.getElementById("password")?.value || "";
const err = () => document.getElementById("errorMsg");

window.loginUser = async () => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email(), password());
    if (!cred.user.emailVerified) throw 0;
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    location.href = snap.data().role === "admin" ? "admin.html" : "student.html";
  } catch {
    err().textContent = "Login failed";
  }
};

window.registerUser = async () => {
  const cred = await createUserWithEmailAndPassword(auth, email(), password());
  await setDoc(doc(db, "users", cred.user.uid), {
    email: email(), role: "student", courses: []
  });
  await sendEmailVerification(cred.user);
  err().textContent = "Verify email sent";
};

window.logoutUser = async () => {
  await signOut(auth);
  location.href = "index.html";
};

let allUsers = [];

onAuthStateChanged(auth, async user => {
  if (!user || !location.pathname.includes("admin")) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.data().role !== "admin") {
    alert("Access denied");
    location.href = "login.html";
    return;
  }

  const usersSnap = await getDocs(collection(db, "users"));
  let students = 0, admins = 0;
  allUsers = [];

  usersSnap.forEach(d => {
    const u = { id: d.id, ...d.data() };
    allUsers.push(u);
    u.role === "student" ? students++ : admins++;
  });

  totalUsers.innerText = allUsers.length;
  totalStudents.innerText = students;
  totalAdmins.innerText = admins;

  drawChart(students * 4, admins * 4);
  renderUsers(allUsers);
  loadCourses();
  loadStudents();
});

window.searchUsers = txt =>
  renderUsers(allUsers.filter(u => u.email.includes(txt)));

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
  confirm("Delete user?") && deleteDoc(doc(db,"users",id)).then(()=>location.reload());

async function loadCourses() {
  courseList.innerHTML = courseSelect.innerHTML = "";
  const snap = await getDocs(collection(db,"courses"));
  snap.forEach(d => {
    courseList.innerHTML += `<li>${d.data().name}</li>`;
    courseSelect.innerHTML += `<option value="${d.id}">${d.data().name}</option>`;
  });
}

window.addCourse = async () => {
  await addDoc(collection(db,"courses"), {
    name: courseName.value,
    description: courseDesc.value
  });
  courseName.value = courseDesc.value = "";
  loadCourses();
};

async function loadStudents() {
  studentSelect.innerHTML = "";
  const snap = await getDocs(collection(db,"users"));
  snap.forEach(d => d.data().role==="student" &&
    (studentSelect.innerHTML += `<option value="${d.id}">${d.data().email}</option>`));
}

window.assignCourse = async () => {
  const ref = doc(db,"users",studentSelect.value);
  const snap = await getDoc(ref);
  const courses = snap.data().courses || [];
  if (!courses.includes(courseSelect.value)) {
    courses.push(courseSelect.value);
    await setDoc(ref,{courses},{merge:true});
  }
};

window.addCertificate = async () =>
  setDoc(doc(db,"certificates",certId.value),{
    studentEmail: certEmail.value,
    course: certCourse.value,
    fileUrl: certLink.value
  }).then(()=>alert("Certificate added"));

function drawChart(stu, adm) {
  const c = userChart.getContext("2d");
  c.clearRect(0,0,300,150);
  c.fillStyle="#2563eb"; c.fillRect(40,150-stu,80,stu);
  c.fillStyle="#06b6d4"; c.fillRect(160,150-adm,80,adm);
}
