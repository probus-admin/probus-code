// probus-loader.js
console.log("📦 Running Probus conditional script loader...");

function loadScript(url, callback = null) {
  const script = document.createElement("script");
  script.src = url;
  script.defer = true;
  if (callback) script.onload = callback;
  document.head.appendChild(script);
}

// Load Firebase init on all pages (unless editing)
if (!window.location.hostname.includes("squarespace.com")) {
  loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", () => {
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js");
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js");
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js");
  });
}

// Load Tippy.js globally
loadScript("https://unpkg.com/@popperjs/core@2");
loadScript("https://unpkg.com/tippy.js@6");
