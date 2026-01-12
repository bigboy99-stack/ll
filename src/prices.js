document.body.onload = initializeTheme,
setTimeout( () => pd2.focus(), 200);
setTimeout( () => {if (pd2) pd2.focus()}, 200);
const ld = document.querySelector(".lb")
const ht = document.querySelector("html")
const sb = document.querySelector(".sb")
const sv = document.querySelector(".sbs")
const hb = document.querySelector("#sb-btn")
const prj = document.querySelector(".prj")
const pd2 = document.querySelector(".pd2");
const ema = document.querySelector("#ema");
const btc = document.querySelector(".btcwal");
const copy = Array.from(document.querySelectorAll(".copy"));
const pages = Array.from(document.querySelectorAll(".pages"));
const s3 = Array.from(document.querySelectorAll(".sel3"));
const num = document.querySelector(".num");
const total = Array.from(document.querySelectorAll('.total'));
const host = document.querySelector(".host");
const sel = document.querySelector("#sel");
const selii = document.querySelector("#sel-ii");
const iniPayment = document.querySelector(".ini");
const remPayment = document.querySelector(".rem");
const hstchk = document.querySelector("#check");
const currencyToggle = document.querySelector("#currency-toggle");
const curSym = Array.from(document.querySelectorAll("#currency-symbol"));
const seliii = document.querySelector(".sel-iii");
let exchangeRate = 0.80;
let val = 500;

// const sa = ["SB","EC","ED","HC","RE","PE","EN","LF", 'HS', "CI", "BJ"];
const pm = "PAGES MINIMUM";
const p = "PAGES";
let remaining;
let initial;

// 1. Data Map: Defines min pages and hosting for each specific sub-type
const subTypeConfig = {
    'roofing': { min: 8, host: 400 },
    'septic': { min: 6, host: 300 },
    'foundation': { min: 10, host: 500 },
    'scaffolding': { min: 6, host: 300 },
    'commercial': { min: 7, host: 350 },
    'bespoke': { min: 6, host: 300 }
};

sel.onchange = () => {
    selii.selectedIndex = 0;
    seliii.selectedIndex = 0;

    // Toggle Sub-category dropdown
    if (["HS", "CI", "SC"].includes(sel.value)) {
        seliii.classList.add('s3');
        // Set specific sub-options based on main category
        if (sel.value === 'HS') {
            s3[0].textContent = 'Roofing'; s3[0].value = 'roofing';
            s3[1].textContent = 'Septic Tank'; s3[1].value = 'septic';
            s3[2].textContent = 'Foundation'; s3[2].value = 'foundation';
        } else if (sel.value === 'CI') {
            s3[0].textContent = 'Scaffolding Hire'; s3[0].value = 'scaffolding';
            s3[1].textContent = 'Commercial Cleaning'; s3[1].value = 'commercial';
            s3[2].textContent = ''; s3[2].value = '';
        } else if (sel.value === 'SC') {
            s3[0].textContent = 'Bespoke Joinery'; s3[0].value = 'bespoke';
            s3[1].textContent = ''; s3[1].value = '';
            s3[2].textContent = ''; s3[2].value = '';
        }
        fl(subTypeConfig[seliii.value].min);
    } else {
        seliii.classList.remove('s3');
        // Standard page updates
        if (sel.value === "PE") fl(1);
        else if (sel.value === "EC") fl(10);
        else fl(5);
    }
    refreshCalculations();
};

seliii.onchange = () => {
    selii.selectedIndex = 0;
    const config = subTypeConfig[seliii.value];
    if (config) {
        fl(config.min);
    }
    refreshCalculations();
};

selii.onchange = refreshCalculations;
hstchk.onchange = refreshCalculations;
currencyToggle.onchange = () => { refreshCalculations(); };

ld.onclick = two;
hb.onclick = () => {toggleDropdown(hb, sb, "sbb")};
pd2.onclick = () => {toggleDropdown(pd2, prj, "uls")};

copy[0].onclick = () => {
  btc.select();
  btc.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(btc.value);
  alert("bitcoin wallet copied to your clip board " + btc.value);
}

copy[1].onclick = () => {
    ema.select();
    ema.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(ema.value);
    alert
    ("Copied the email: " + ema.value);
}

copy[2].onclick = () => {
  btc.select();
  btc.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(btc.value);
  alert("bitcoin wallet copied to your clip board " + btc.value);
}

copy[3].onclick = () => {
  ema.select();
  ema.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ema.value);
  alert
  ("Copied the email: " + ema.value);
}

document.addEventListener("keydown", t => {
    "Escape" === t.key && sb.classList.contains("sbb") && toggleDropdown(hb, sb, "sbb"),
    "Escape" === t.key && prj.classList.contains("uls") && toggleDropdown(pd2, prj, "uls")
}
)
document.addEventListener("click", t => {
    !sb.classList.contains("sbb") || sb.contains(t.target) || hb.contains(t.target) || toggleDropdown(hb, sb, "sbb"),
    !prj.classList.contains("uls") || prj.contains(t.target) || pd2.contains(t.target) || toggleDropdown(pd2, prj, "uls")
}
);

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
    pages[0].textContent = `${num} ${pm}`;
    for (let i = 1; i<pages.length; i++) {num++;pages[i].textContent = `${num} ${p}`;}
}
function tot(varr) {
    const usdVal = Number(varr);
    const gbpVal = usdVal * exchangeRate;
    
    const displayValue = currencyToggle.checked ? `${gbpVal.toFixed(0)}` : `${usdVal.toFixed(0)}`;
    for (let i of total) { i.textContent = displayValue;}
}

function updatePaymentSplits() {   
    const usdInitial = val * 0.3;
    const usdRemaining = val * 0.7;

    if (currencyToggle.checked === true) {
        iniPayment.textContent = `${(usdInitial * exchangeRate).toFixed(0)}`;
        remPayment.textContent = `${(usdRemaining * exchangeRate).toFixed(0)}`;
    } else {
        iniPayment.textContent = `${usdInitial.toFixed(0)}`;
        remPayment.textContent = `${usdRemaining.toFixed(0)}`;
    }
}

function refreshCalculations() {
    let pageCount = Number(selii.value.match(/\d+/)) || 1;
    let hostingCostUSD = 50; // Default base in USD

    // 1. Determine base USD hosting cost
    if (sel.value === "PE") hostingCostUSD = 50;
    else if (sel.value === "EC") hostingCostUSD = 500;
    else if (["HS", "CI", "SC"].includes(sel.value)) {
        const config = subTypeConfig[seliii.value];
        if (config) hostingCostUSD = config.host;
    } else {
        hostingCostUSD = 250;
    }

    // 2. Handle the Hosting UI display conversion
    if (currencyToggle.checked) {
        host.textContent = (hostingCostUSD * exchangeRate).toFixed(0);
        for (let i of curSym) {i.textContent = '£'}
    } else {
        host.textContent = hostingCostUSD;
        for (let i of curSym) {i.textContent = '$'}
    }

    // 3. Calculate Totals
    val = 500 * pageCount; // Base project value in USD
    let finalTotalUSD = hstchk.checked ? (val + hostingCostUSD) : val;

    // 4. Update the rest of the UI
    tot(finalTotalUSD.toString());
    updatePaymentSplits();
    updateRem();
}

function updateRem() {
    // 1. Start with the base 70% of the project value (USD)
    let remUSD = val * 0.7;

    // 2. Add hosting only if the checkbox is checked
    // Note: We use the raw 'host' value logic here to keep math consistent
    if (hstchk.checked === true) {
        // We calculate what the hosting is in USD first
        // If your 'host.textContent' is already converted, we need to 'un-convert' it 
        // OR simply pull the base hosting value. Let's use the UI value logic:
        remUSD += Number(host.textContent) / (currencyToggle.checked ? exchangeRate : 1);
    }

    // 3. Final Output: Convert the total USD remainder to the selected currency
    if (currencyToggle.checked === true) {
        let remGBP = remUSD * exchangeRate;
        remPayment.textContent = `${remGBP.toFixed(0)}`;
    } else {
        remPayment.textContent = `${remUSD.toFixed(0)}`;
    }
}