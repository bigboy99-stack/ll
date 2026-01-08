document.body.onload = initializeTheme;
const ld = document.querySelector(".lb")
const ht = document.querySelector("html")
const sb = document.querySelector(".sb")
const sv = document.querySelector(".sbs")
const hb = document.querySelector("#sb-btn")
const prj = document.querySelector(".prj")
const ema = document.querySelector("#ema");
const cp = document.querySelector(".copy");
const slides = document.querySelectorAll('.slide');
const container = document.querySelector('.testimonial-slider');

cp.onclick = () => {
  ema.select();
  ema.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ema.value);
  alert("email address copied: " + ema.value);
}
function initializeTheme() {
    "on" === localStorage.getItem("dark") ? "true" === ld.getAttribute("aria-checked") || (ld.setAttribute("aria-checked", "true"),
    ht.setAttribute("data-theme", "dark"),
    ld.textContent = "light ☀️",
    ht.className = "bd") : (ld.setAttribute("aria-checked", "false"),
    ht.removeAttribute("data-theme"),
    ld.textContent = "dark 🌙",
    ht.className = "bl")
}
function two() {
    "true" === ld.getAttribute("aria-checked") ? (localStorage.setItem("dark", "off"),
    ld.setAttribute("aria-checked", "false"),
    ht.removeAttribute("data-theme"),
    ld.textContent = "dark 🌙",
    ht.className = "bl") : (localStorage.setItem("dark", "on"),
    ld.setAttribute("aria-checked", "true"),
    ht.setAttribute("data-theme", "dark"),
    ld.textContent = "light ☀️",
    ht.className = "bd")
}
function toggleDropdown(t, e, o) {
    "true" === t.getAttribute("aria-expanded") ? (e.classList.remove(o),
    t.setAttribute("aria-expanded", "false")) : (e.classList.add(o),
    t.setAttribute("aria-expanded", "true"))
}
ld.onclick = two,
hb.onclick = () => { toggleDropdown(hb, sb, "sbb")};

document.addEventListener("keydown", t => {
    "Escape" === t.key && sb.classList.contains("sbb") && toggleDropdown(hb, sb, "sbb"),
    "Escape" === t.key && prj.classList.contains("uls") && toggleDropdown(pd2, prj, "uls")
}
);
document.addEventListener("click", t => {
    !sb.classList.contains("sbb") || sb.contains(t.target) || hb.contains(t.target) || toggleDropdown(hb, sb, "sbb");
}
);



let currentIndex = 0;
let isPaused = false;

function showNextSlide() {
    if (!isPaused) {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length; 
        slides[currentIndex].classList.add('active');
    }
}

// Change slide every 4 seconds
let slideInterval = setInterval(showNextSlide, 5000);
container.addEventListener('mouseenter', () => isPaused = true);
container.addEventListener('mouseleave', () => isPaused = false);