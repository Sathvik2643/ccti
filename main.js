let certificates = [];

// Load certificates
fetch("certificates.json")
  .then(res => res.json())
  .then(data => certificates = data);

// Navigation
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// Lock Student Corner
function openStudent() {
  alert("Please login as student to access Student Corner");
  openLogin();
}

// Verify Certificate (Public)
function verifyCert() {
  const id = document.getElementById("certInput").value.trim().toUpperCase();
  const res = document.getElementById("certResult");
  const down = document.getElementById("certDownload");
  down.innerHTML = "";

  const found = certificates.find(c => c.id === id);
  if (found) {
    res.textContent = "✔ VALID Certificate";
    res.style.color = "green";
    const a = document.createElement("a");
    a.href = found.file;
    a.target = "_blank";
    a.className = "btn";
    a.textContent = "Download Certificate";
    down.appendChild(a);
  } else {
    res.textContent = "✖ INVALID Certificate";
    res.style.color = "red";
  }
}

// Login Modal
function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}
function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
  closeLogin();
});
