/* ---------- SPA NAVIGATION ---------- */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

/* ---------- LOGIN MODAL ---------- */
function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

/* ---------- CERTIFICATE VERIFY ---------- */
let certificates = [];

fetch("certificates.json")
  .then(res => res.json())
  .then(data => certificates = data)
  .catch(() => console.warn("certificates.json not found"));

function verifyCert() {
  const id = document.getElementById("certInput").value.trim().toUpperCase();
  const result = document.getElementById("certResult");
  const download = document.getElementById("certDownload");

  download.innerHTML = "";

  if (!id) {
    result.textContent = "Enter Certificate ID";
    result.style.color = "red";
    return;
  }

  const found = certificates.find(c => c.id === id);

  if (found) {
    result.textContent = "✔ VALID Certificate – " + (found.name || "");
    result.style.color = "green";

    if (found.file) {
      const a = document.createElement("a");
      a.href = found.file;
      a.target = "_blank";
      a.className = "btn";
      a.textContent = "Download Certificate";
      download.appendChild(a);
    }
  } else {
    result.textContent = "✖ INVALID Certificate";
    result.style.color = "red";
  }
}

/* ---------- INITIAL LOAD ---------- */
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
  closeLogin();
});
