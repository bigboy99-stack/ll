document.body.onload = setTimeout(initializeTheme, 100);
let inp;
document.body.onload = ()=> {
  inp = document.querySelector("#cbi");
  inp.focus();
  inp.oninput = (e) => {e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`}
};
const ld = document.querySelector(".lb");
const ht = document.querySelector("html");
const sb = document.querySelector(".sb");
const sv = document.querySelector(".sbs");
const hb = document.querySelector("#sb-btn");
const prj = document.querySelector(".prj");
const pd2 = document.querySelector(".pd2");
const ema = document.querySelector("#ema");
const cs = document.querySelector("#cs");
const f = document.querySelector(".cbf");
const sub = document.querySelector("#sub");
const ch = document.querySelector(".cbh");
const cd = document.querySelector(".cbd");
const cp = document.querySelector(".copy");

ld.onclick = two;
hb.onclick = () => {toggleDropdown(hb, sb, "sbb");};
pd2.onclick = () => {toggleDropdown(pd2, prj, "uls");};


function two () {
  const isChecked = ld.getAttribute("aria-checked") === "true";
  if (!isChecked) {
    localStorage.setItem("dark", "on");
    ld.setAttribute("aria-checked", "true");
    ht.setAttribute('data-theme', 'dark');
    ld.textContent = "light ☀️";
    ht.className = 'bd'
  } else {
    localStorage.setItem("dark", "off");
    ld.setAttribute("aria-checked", "false");
    ht.removeAttribute('data-theme')
    ld.textContent = "dark 🌙";
    ht.className = 'bl'
  }
}

function initializeTheme() {
    if (localStorage.getItem("dark") === "on") {
      const isChecked = ld.getAttribute("aria-checked") === "true";
      if (!isChecked) { ld.setAttribute("aria-checked", "true"); ht.setAttribute('data-theme', 'dark');ld.textContent = "light ☀️";ht.className = 'bd'}
    } else {ld.setAttribute("aria-checked", "false");ht.removeAttribute('data-theme');ld.textContent = "dark 🌙";ht.className = 'bl'}
}

ecopyma.onclick = () => {
  ema.select();
  ema.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ema.value);
  alert(`${ema.value} has been copied to your clip board`);
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
  if (prj.classList.contains('uls') && !prj.contains(e.target) && !pd2.contains(e.target)) {toggleDropdown(pd2, prj, "uls");}
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
    const prompt = inp.value.trim();
    if (!prompt) return;

    // 1. Store/Display User Prompt
    let ran = reply('chat user'); 
    ran.textContent += inp.value.trim();
    ch.append(ran);
    ch.scrollTop = ch.scrollHeight;
    
    inp.value = '';
    inp.style.height = 'auto'; // Reset height
    sub.disabled = true;

    let rr = reply('chat server thinking');
    rr.textContent = 'responding...'
    setTimeout(()=>ch.append(rr), 400)

    try {
        // 3. Send to Backend
        const response = await fetch('http://127.0.0.1:3004/gem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatbot: prompt })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${errorText}`);
        }

        // 4. Handle Streaming Response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let ran2 = reply('chat server');
        ch.append(ran2);
        rr.style.display = "none"
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode chunk and append to current message div
            const chunk = decoder.decode(value, { stream: true });
            ran2.textContent += chunk;
            ch.scrollTop = ch.scrollHeight;
        }

      } catch (err) {
        let ran3 = reply('chat server');
        rr.style.display = "none"
        ran3.textContent = 'too many requests, you have exceded your free tier limits';
        setTimeout(()=>ch.append(ran3), 300)
        // console.log(err.message);
      } finally {
        sub.disabled = false;
        inp.focus();
      }
});

function reply(className) {
    let ele1 = document.createElement('div');
    ele1.className = className;
    return ele1;
}

function think(className) {
    let ele1 = document.createElement('div');
    ele1.className = className;
    return ele1;
}