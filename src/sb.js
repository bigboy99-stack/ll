document.body.onload = setTimeout(initializeTheme, 200);
let inp;
document.body.onload = ()=> {
  inp = document.querySelector("#sbi");
  inp.focus();
  inp.oninput = (e) => {e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`}
};
const ht = document.querySelector("html");
const sb = document.querySelector(".sb");
const sv = document.querySelector(".sbs");
const hb = document.querySelector("#sb-btn");
const ema = document.querySelector("#ema");
const f = document.querySelector(".sbf");
const sub = document.querySelector("#sub");
const res = document.querySelector(".result");
// const ch = document.querySelector(".cbh");
// const cd = document.querySelector(".cbd");

hb.onclick = () => {toggleDropdown(hb, sb, "sbb");};

function initializeTheme () {
 if (localStorage.getItem("dark") == "on") {console.log(345);ht.setAttribute('data-theme', 'dark'); ht.className = 'bd';}
 else {ht.removeAttribute('data-theme'); ht.className = 'bl';}
}

ema.onclick = () => {
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
  if (sb.classList.contains('sbb') && !sb.contains(e.target) && !hb.contains(e.target)) {toggleDropdown(hb, sb, "sbb");}
});

const nextPageLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"])');

nextPageLinks.forEach(link => {
 link.addEventListener('click', (e) => {
    e.preventDefault();
    const nextUrl = link.href;
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    if (document.startViewTransition) {
        document.startViewTransition(() => {
            setTimeout(() => {window.location.href = nextUrl;}, 50); 
        }).finished.finally(() => {
            document.documentElement.style.removeProperty('--x');
            document.documentElement.style.removeProperty('--y');
        });
    } else {
        window.location.href = nextUrl;
    }
 });
});

sub.addEventListener('click', async (e) => {
    e.preventDefault();
    const query = inp.value.trim();
    if (!query) return;

    res.textContent = 'searching...';
    res.classList.add('big-text');

    sub.disabled = true;

    try {
      // 3. Send to Backend
      const response = await fetch('https://localhost:3004/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query })
      });

      // 3. Handle HTTP Errors (e.g., 400, 500, Rate Limit 429)
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error ${response.status}: ${errorData.error || response.statusText}`);
      }

      // 4. Parse the JSON response
      const results = await response.json();

      // 5. Update UI with Results
      reply(results);

    } catch (err) {
      console.error('Fetch error:', err);
      alert(`Error: ${err.message} Please ensure your Node.js server and Qdrant database are running.`);
      res.textContent = ''
      res.classList.remove('big-text');
    } finally {
      sub.disabled = false;
      inp.focus()
      inp.textContent = 'find words closest in meaning rather than matching letters';
    }
});

let UL = document.createElement('ul');
function reply(results) {
  if (results.length === 0) {
    res.textContent = 'No semantic matches found in the corpus.';
    return;
  }
  
    let LI = document.createElement('li');
    results.map(item => {
      LI.textContent = item;
      LI.className = className;
      UL.append(LI);
    })
    
    res.innerHTML = UL;
}

