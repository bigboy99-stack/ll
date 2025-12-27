document.body.onload = initializeTheme,
setTimeout( () => pd2.focus(), 200);
setTimeout( () => pd2.focus(), 200);
const ld = document.querySelector(".lb")
const ht = document.querySelector("html")
const sb = document.querySelector(".sb")
const sv = document.querySelector(".sbs")
const hb = document.querySelector("#sb-btn")
const prj = document.querySelector(".prj")
const pd2 = document.querySelector(".pd2");
const ema = document.querySelector("#ema");
const btc = document.querySelector(".btc");
const copy = Array.from(document.querySelectorAll(".copy"));
const pages = Array.from(document.querySelectorAll(".pages"));
const num = document.querySelector(".num");
const total = document.querySelector(".total");
const host = document.querySelector(".host");
const sel = document.querySelector("#sel");
const selii = document.querySelector("#sel-ii");
const iniPayment = document.querySelector(".ini");
const remPayment = document.querySelector(".rem");

const sa = ["SB","EC","ED","HC","RE","PE","EN","LF"]
const pm = "PAGES MINIMUM"
const p = "PAGES"

// 2. Update your selii.onchange to trigger the split update
selii.onchange = () => {
    const pageCount = Number(selii.value.match(/\d+/)); // Safely gets the number from "5 PAGES"
    const type = sel.value;

    // Logic to update the total based on selection
    if (type === "PE") {
        total.textContent = `$${400 * pageCount + 30}`;
    } else if (type === "SB" || type === "ED" || type === "HC" || type === "RE" || type === "LF") {
        total.textContent = `$${400 * pageCount + 150}`;
    } else if (type === "EC") {
        total.textContent = `$${400 * pageCount + 300}`;
    } else if (type === "EN") {
        total.textContent = `$${400 * pageCount + 120}`;
    }

    // After updating total, calculate the 30/70 split
    updatePaymentSplits();
};

sel.onchange = () => {
    selii.selectedIndex = 0;
    // Define your base page numbers
    let startPage1 = 1;
    let startPage4 = 4;
    let startPage5 = 5;
    let startPage10 = 10;

    switch (sel.value) {
        case "SB": // Small Business
        case "ED": // Educational
        case "HC": // Healthcare
        case "RE": // Real Estate
        case "LF": // Law Firm
            fl(startPage5);
            host.textContent = '150';
            total.textContent = `$2150`;
            pages[0].textContent = `5 ${pm}`;
            break;

        case "EC": // E-Commerce
            host.textContent = '300';
            total.textContent = `$4300`; 
            pages[0].textContent = `10 ${pm}`;
            pages[1].textContent = `12 ${p}`; 
            pages[2].textContent = `14 ${p}`;
            pages[3].textContent = `20 ${p}`;
            pages[4].textContent = `25 ${p}`;
            pages[5].textContent = `30 ${p}`;
            break;

        case "PE": // Personal
            fl(startPage1); 
            host.textContent = '30';
            total.textContent = `$430`; 
            pages[0].textContent = `1 PAGE MINIMUM`;
            break;

        case "EN": // Entertainment
            fl(startPage4); 
            host.textContent = '120'; 
            total.textContent = `$1720`; 
            pages[0].textContent = `4 ${pm}`;
            break;

        default:
            console.log("Unknown website type selected");
    }
    
    // Crucial: Update the 30/70 split immediately after the total changes
    updatePaymentSplits(); 
}

copy[0].onclick = () => {
  btc.select();
  btc.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(btc.value);
  alert("bitcoin wallet copied to your clip board " + btc.value);
}
copy[1].onclick = () => {
  btc.select();
  btc.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(btc.value);
  alert("bitcoin wallet copied to your clip board " + btc.value);
}

ema.onclick = () => {
  ema.select();
  ema.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ema.value);
  alert
  ("Copied the text: " + ema.value);
}

ld.onclick = two,
hb.onclick = () => {
    toggleDropdown(hb, sb, "sbb")
}
,
pd2.onclick = () => {
    toggleDropdown(pd2, prj, "uls")
}
,
document.addEventListener("keydown", t => {
    "Escape" === t.key && sb.classList.contains("sbb") && toggleDropdown(hb, sb, "sbb"),
    "Escape" === t.key && prj.classList.contains("uls") && toggleDropdown(pd2, prj, "uls")
}
),
document.addEventListener("click", t => {
    !sb.classList.contains("sbb") || sb.contains(t.target) || hb.contains(t.target) || toggleDropdown(hb, sb, "sbb"),
    !prj.classList.contains("uls") || prj.contains(t.target) || pd2.contains(t.target) || toggleDropdown(pd2, prj, "uls")
}
);

// 1. Create a reusable function to update the 30/70 split
function updatePaymentSplits() {
    // Extract number from "$430" string (removes the '$' and converts to Number)
    let currentTotal = Number(total.textContent.replace(/[^0-9.-]+/g, ""));
    
    if (!isNaN(currentTotal)) {
        let initial = currentTotal * 0.3;
        let remaining = currentTotal * 0.7;

        // Update the text in the HTML classes
        iniPayment.textContent = `initial payment: $${initial.toFixed(0)}`;
        remPayment.textContent = `remaining payment: $${remaining.toFixed(0)}`;
    }
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

function fl (num) {
    for (let i = 0; i<pages.length; i++) {pages[i].textContent = `${num} ${p}`;num++}
}