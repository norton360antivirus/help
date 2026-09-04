const nav = document.getElementById("nav");
const menuToggle = document.querySelector(".menu-toggle");
menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const currency = document.getElementById("currency");
function updateCurrency() {
  const type = currency.value;
  document.querySelectorAll("[data-inr]").forEach(el => {
    el.textContent = type === "USD" ? el.dataset.usd : el.dataset.inr;
    const parent = el.closest(".price");
    parent.querySelector(".currency").textContent = type === "USD" ? "$" : "₹";
  });
}
currency?.addEventListener("change", updateCurrency);

document.querySelectorAll(".faq-item").forEach(item => {
  item.addEventListener("click", () => item.classList.toggle("open"));
});

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const closeSearch = document.getElementById("closeSearch");
searchBtn?.addEventListener("click", () => {
  searchBox.classList.add("open");
  searchInput.focus();
});
closeSearch?.addEventListener("click", () => searchBox.classList.remove("open"));

function toast(text) {
  const el = document.getElementById("toast");
  el.textContent = text;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3200);
}

document.querySelectorAll(".plan-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    toast(`${btn.dataset.plan} selected. Please submit the support request below.`);
  });
});

document.getElementById("supportForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  toast(`Thanks ${name || "there"}! Your request is ready. Connect this form to your email/form service to receive submissions.`);
  e.target.reset();
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if (id && id !== "#top") {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:"smooth", block:"start"});
      }
    }
  });
});
