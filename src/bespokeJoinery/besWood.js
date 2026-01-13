document.body.onload = initializeTheme;
const ht = document.querySelector("html")
const sb = document.querySelector(".sb")
const sv = document.querySelector(".sbs")
const hb = document.querySelector("#sb-btn")
const prj = document.querySelector(".prj")
const ema = document.querySelector("#ema");
const cp = document.querySelector(".copy");

cp.onclick = () => {
  ema.select();
  ema.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ema.value);
  alert("email address copied: " + ema.value);
}
function initializeTheme () {
    if (localStorage.getItem("dark") === "on") {ht.setAttribute('data-theme', 'dark'); ht.className = 'bd'}
    else {ht.removeAttribute('data-theme'); ht.className = 'bl'}
}

function toggleDropdown(t, e, o) {
    "true" === t.getAttribute("aria-expanded") ? (e.classList.remove(o),
    t.setAttribute("aria-expanded", "false")) : (e.classList.add(o),
    t.setAttribute("aria-expanded", "true"))
}
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

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("fullImg");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-modal");

    // Select all images with class srv-img
    document.querySelectorAll('.srv-img').forEach(img => {
        img.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }
    });

    // Close when "X" is clicked
    closeBtn.onclick = () => modal.style.display = "none";

    // Close when clicking anywhere outside the image
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});