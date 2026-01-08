document.body.onload = initializeTheme;
setTimeout(()=>pd2.focus(), 200);
setTimeout(()=>alert(`this website can only navigate with keyboard buttons.
   focus down = tab,
   focus up = shift + tab, 
   full page up = page-up
   full page down = page-down, 
   enter = select. 
   Typically simulating a disabled user point of view`), 1300);
const ht = document.querySelector("html");
const sb = document.querySelector(".sb");
const ld = document.querySelector(".lb");
const sv = document.querySelector(".sbs");
const hb = document.querySelector("#sb-btn");
const prj = document.querySelector(".prj");
const pd2 = document.querySelector(".pd2");
const ema = document.querySelector("#ema");
const cs = document.querySelector("#cs");
const cp = document.querySelector(".copy");

hb.onclick = () => {toggleDropdown(hb, sb, "sbb");};
pd2.onclick = () => {toggleDropdown(pd2, prj, "uls");};
ld.onclick = two;

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

function initializeTheme () {
 if (localStorage.getItem("dark") === "on") {ht.setAttribute('data-theme', 'dark'); ht.className = 'bd'}
 else {ht.removeAttribute('data-theme'); ht.className = 'bl'}
}
cp.onclick = () => {
  ema.select();
  ema.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ema.value);
  alert("Copied the text: " + ema.value);
}
function toggleDropdown(button, targetElement, activeClass) {
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    targetElement.classList.remove(activeClass);
    button.setAttribute("aria-expanded", "false");
  } else {
    targetElement.classList.add(activeClass);
    button.setAttribute("aria-expanded", "true");
  }
}
document.addEventListener('keydown', (e) => {
  // Sidebar (sb) close on ESC
  if (e.key === 'Escape' && sb.classList.contains('sbb')) {
    toggleDropdown(hb, sb, "sbb"); // Reuses the new toggle function
  }
  // Projects dropdown (prj) close on ESC
  if (e.key === 'Escape' && prj.classList.contains('uls')) {
    toggleDropdown(pd2, prj, "uls"); // Reuses the new toggle function
  }
});
document.addEventListener('click', (e) => {
  // Close Sidebar if click is outside the button (hb) and the menu (sb)
  if (sb.classList.contains('sbb') && !sb.contains(e.target) && !hb.contains(e.target)) {toggleDropdown(hb, sb, "sbb");}

  // Close Projects dropdown if click is outside the button (pd2) and the menu (prj)
  if (prj.classList.contains('uls') && !prj.contains(e.target) && !pd2.contains(e.target)) {toggleDropdown(pd2, prj, "uls");}
});