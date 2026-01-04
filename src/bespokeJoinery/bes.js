document.body.onload = initializeTheme;

// --- Selectors ---
const ld = document.querySelector(".lb");      // Light/Dark Toggle
const ht = document.querySelector("html");
const sb = document.querySelector(".sb");      // Sidebar Menu
const hb = document.querySelector("#sb-btn");  // Sidebar Button
const prj = document.querySelector(".prj");    // Projects Dropdown
const pd2 = document.querySelector(".pd2");    // Projects Button
const ema = document.querySelector("#ema");    // Contact Email
const copyBtn = document.querySelector(".copy"); // Copy Button

// Quote Calculator Selectors
const sel = document.querySelector("#sel");    // Project Type
const selii = document.querySelector("#sel-ii"); // Timeline
const totalSpan = document.querySelector(".total");
const hostSpan = document.querySelector(".host");
const finText = document.querySelector("#fin span");

// Focus management (Accessibility)
setTimeout(() => { if(pd2) pd2.focus() }, 200);

// --- Event Listeners ---

// 1. Dark Mode Toggle
ld.onclick = toggleTheme;

// 2. Dropdown & Sidebar Toggles
hb.onclick = () => toggleDropdown(hb, sb, "sbb");
pd2.onclick = () => toggleDropdown(pd2, prj, "uls");

// 3. Copy Email Function
if(copyBtn) {
    copyBtn.onclick = () => {
        ema.select();
        ema.setSelectionRange(0, 99999); // Mobile compatibility
        navigator.clipboard.writeText(ema.value);
        alert("Email address copied: " + ema.value);
    };
}

// 4. Quote Calculator Logic
sel.onchange = calculateQuote;
selii.onchange = calculateQuote;

function calculateQuote() {
    let basePrice = 0;
    let location = "Lagos, NG";
    let message = "";

    // Determine Base Estimate based on Project Type
    switch (sel.value) {
        case "KI": // Kitchen
            basePrice = 1500; // Placeholder values
            message = "Includes cabinetry, installation, and hardware.";
            break;
        case "WA": // Wardrobe
            basePrice = 800;
            message = "Price per linear meter (approx).";
            break;
        case "ST": // Staircase
            basePrice = 2500;
            message = "Solid hardwood construction.";
            break;
        case "FL": // Flooring
            basePrice = 100;
            message = "Price per square meter.";
            break;
        case "FU": // Furniture
            basePrice = 500;
            message = "Bespoke single unit price.";
            break;
        case "CO": // Commercial
            basePrice = 5000;
            message = "Full shop fitting estimate.";
            break;
        default:
            basePrice = 0;
    }

    // Determine Timeline Impact
    // Index 0 = Urgent, 1 = Standard, 2 = Flexible
    if (selii.selectedIndex === 0) {
        hostSpan.textContent = "Urgent";
        totalSpan.textContent = "High Demand"; 
    } else if (selii.selectedIndex === 2) {
        hostSpan.textContent = "Flexible";
        totalSpan.textContent = "Open";
    } else {
        hostSpan.textContent = "Standard";
        totalSpan.textContent = "Available";
    }

    // Update UI text
    finText.textContent = `Est. Base: $${basePrice}+ (${message})`;
}

// 5. Accessibility: Close menus on Escape or Outside Click
document.addEventListener("keydown", t => {
    if (t.key === "Escape") {
        if (sb.classList.contains("sbb")) toggleDropdown(hb, sb, "sbb");
        if (prj.classList.contains("uls")) toggleDropdown(pd2, prj, "uls");
    }
});

document.addEventListener("click", t => {
    // Close Sidebar if clicked outside
    if (sb.classList.contains("sbb") && !sb.contains(t.target) && !hb.contains(t.target)) {
        toggleDropdown(hb, sb, "sbb");
    }
    // Close Project Menu if clicked outside
    if (prj.classList.contains("uls") && !prj.contains(t.target) && !pd2.contains(t.target)) {
        toggleDropdown(pd2, prj, "uls");
    }
});

// --- Helper Functions ---

function initializeTheme() {
    const isDark = localStorage.getItem("dark") === "on";
    applyTheme(isDark);
}

function toggleTheme() {
    const isDark = ht.getAttribute("data-theme") === "dark";
    localStorage.setItem("dark", isDark ? "off" : "on");
    applyTheme(!isDark);
}

function applyTheme(isDark) {
    if (isDark) {
        ld.setAttribute("aria-checked", "true");
        ht.setAttribute("data-theme", "dark");
        ld.textContent = "light ☀️";
        ht.className = "bd";
    } else {
        ld.setAttribute("aria-checked", "false");
        ht.removeAttribute("data-theme");
        ld.textContent = "dark 🌙";
        ht.className = "bl";
    }
}

function toggleDropdown(btn, menu, activeClass) {
    const isExpanded = btn.getAttribute("aria-expanded") === "true";
    
    if (isExpanded) {
        menu.classList.remove(activeClass);
        btn.setAttribute("aria-expanded", "false");
    } else {
        menu.classList.add(activeClass);
        btn.setAttribute("aria-expanded", "true");
    }
}

// Initialize Calculator on Load
calculateQuote();