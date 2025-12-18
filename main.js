/* ================= SECTION NAVIGATION ================= */
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = "none";
  });
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  showSection("home");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});

/* ================= MOBILE MENU ================= */
function toggleMenu() {
  document.getElementById("navMenu")?.classList.toggle("show");
}

function closeMenu() {
  document.getElementById("navMenu")?.classList.remove("show");
}

/* ================= THEME ================= */
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}
