// tippy-init.js
function initializeTippyTooltips(selector = "[data-tippy-content]") {
  if (typeof tippy !== "function") {
    console.error("❌ Tippy.js not found.");
    return;
  }

  console.log("💬 Initialising tooltips...");
  tippy(selector, {
    delay: [100, 50],
    arrow: true,
    animation: "scale",
    theme: "probus-light",
    placement: "top",
    duration: [200, 150]
  });
}

// Auto-initialise when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeTippyTooltips();
});
