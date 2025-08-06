// probus-loader.js
console.log("📦 Running Probus conditional script loader...");

function loadScript(url, callback = null) {
  const script = document.createElement("script");
  script.src = url;
  script.defer = true;
  if (callback) script.onload = callback;
  document.head.appendChild(script);
}

// Load Tippy.js globally
loadScript("https://unpkg.com/@popperjs/core@2");
loadScript("https://unpkg.com/tippy.js@6");
