function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});

function toggleAccordion(index) {
  document.querySelectorAll(".accordion-content").forEach((el, i) => {
    el.style.display = i === index && el.style.display !== "block"
      ? "block"
      : "none";
  });
}
