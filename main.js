function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

let certificates = [];

fetch("certificates.json")
  .then(res => res.json())
  .then(data => certificates = data);

function verifyCert() {
  const id = document.getElementById("certInput").value.trim().toUpperCase();
  const result = document.getElementById("certResult");
  const download = document.getElementById("certDownload");
  download.innerHTML = "";

  const found = certificates.find(c => c.id === id);

  if (found) {
    result.textContent = "✔ VALID Certificate";
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

document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
  closeLogin();
  document.getElementById("admin").style.display = "none";
});
