document.body.onload = setTimeout(initializeTheme, 100);
let sbi;
document.body.onload = ()=> {
  sbi = document.querySelector("#sbi");
  sbi.focus();
  sbi.oninput = (e) => {e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`}
};
const ld = document.querySelector(".lb");
const ht = document.querySelector("html");
const sb = document.querySelector(".sb");
const sv = document.querySelector(".sbs");
const hb = document.querySelector("#sb-btn");
const ema = document.querySelector("#ema");
const searchForm = document.querySelector(".sbf");
const sub = document.querySelector("#sub");
const resultsContainer = document.querySelector('.result');
const ulres = document.querySelector('.res');
// const ch = document.querySelector(".cbh");
// const cd = document.querySelector(".cbd");

ld.onclick = two;
hb.onclick = () => {toggleDropdown(hb, sb, "sbb");};

function initializeTheme() {
    if (localStorage.getItem("dark") === "on") {
      const isChecked = ld.getAttribute("aria-checked") === "true";
      if (!isChecked) { ld.setAttribute("aria-checked", "true"); ht.setAttribute('data-theme', 'dark');ld.textContent = "light ☀️";ht.className = 'bd'}
    } else {ld.setAttribute("aria-checked", "false");ht.removeAttribute('data-theme');ld.textContent = "dark 🌙";ht.className = 'bl'}
}

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


const BACKEND_URL = 'http://localhost:3004'; 
const videoContainer = document.getElementById('video-container');


searchForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop the default form submission and page reload
    
    const query = searchInput.value.trim();
    if (!query) {
        resultsContainer.textContent = 'Please enter a search query';
        return;
    }

    resultsContainer.textContent = 'Searching...';
    sub.disabled = true;

    try {
        // Fetch data from your backend's search route
        const response = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const mediaItems = await response.json();
        // Call displayResults with the fetched items
        displayResults(mediaItems);

    } catch (error) {
        console.error('Search failed:', error);
        resultsContainer.textContent = `Error: Could not connect to the streaming service`;
    }
});

function displayResults(items) {
    if (items.length === 0) {
        resultsContainer.innerHTML = '<p aria-live="polite">No media found matching your query.</p>';
        return;
    }

    const listHtml = items.map(item => `
        <li 
            class="media-result-item" 
            role="button" 
            tabindex="0"
            aria-label="Play ${item.title}"
            data-s3key="${item.s3Key}" 
        >
            <a href=\`http://localhost:3004/show?content=${item.title}\`>
              <h3>${item.title}</h3>
              <p>${item.snippet || 'Click to play stream'}</p>
            </a>
        </li>
    `).join('');

    ulres += listHtml;
    
    // Attach click and keyboard listeners to all new result items
    document.querySelectorAll('.media-result-item').forEach(item => {
        const s3Key = item.dataset.s3key; // Retrieve s3Key directly from the element

        item.addEventListener('click', () => {
            loadStream(s3Key);
        });
        
        // Allow keyboard interaction (Enter key) for accessibility
        item.addEventListener('keydown', (e) => {
             if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadStream(s3Key);
             }
        });
    });
}

/*
 * Injects or updates the HTML5 video element to load the stream URL.
 */
function loadStream(s3Key) {
    const streamUrl = `${BACKEND_URL}/api/stream/${s3Key}`;
    
    // Clear any previous content
    videoContainer.innerHTML = ''; 

    // Create and configure the video element
    const videoElement = document.createElement('video');
    videoElement.id = 'streamingVideoPlayer';
    videoElement.src = streamUrl;
    videoElement.setAttribute('width', '100%'); 
    videoElement.setAttribute('controls', '');
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('aria-label', `Video player for ${s3Key}`);
    
    // Append the video element to the container
    videoContainer.appendChild(videoElement);

    // Focus the player for better user experience
    videoElement.focus();
    
    console.log(`Stream URL loaded: ${streamUrl}`);
}


function createDownloadButton(s3Key) {
    const downloadUrl = `${BACKEND_URL}/api/download/${s3Key}`;
    const button = document.createElement('a');
    button.href = downloadUrl;
    button.textContent = 'Download Original File';
    button.classList.add('download-btn');
    button.setAttribute('download', ''); // Prompts a save dialog
    return button;
}

// NOTE: To use the download button, you would uncomment the following lines 
// and integrate the call to createDownloadButton into your loadStream function 
// if you wanted it to appear next to the player.
/*
function loadStream(s3Key) {
    // ... video creation code ...
    videoContainer.appendChild(videoElement);
    
    // Append the download link after the video player
    const downloadBtn = createDownloadButton(s3Key);
    videoContainer.appendChild(downloadBtn); 
    // ...
}
*/

/* ------------------------------------- */

function reply(className) {
    let ele1 = document.createElement('div');
    ele1.className = className;
    // let ele2 = document.createElement('span');
    // ele2.className = 'cbs'
    // ele2.textContent = sender;
    // ele1.append(ele2)
    return ele1;
}