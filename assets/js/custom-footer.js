// custom-footer.js
console.log("🔻 custom-footer.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  const footer = document.createElement("footer");
  footer.className = "custom-probus-footer";

  const currentYear = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-inner">
      <p>&copy; ${currentYear} Combined Probus Club of Cherrybrook. All rights reserved.</p>
      <p class="footer-links">
        <a href="/privacy">Privacy</a> |
        <a href="/help">Help</a> |
        <a href="/contact">Contact</a>
      </p>
    </div>
  `;

  document.body.appendChild(footer);

  // Optional: Hide native Squarespace footer
  const hideNativeFooter = true;
  if (hideNativeFooter) {
    const style = document.createElement("style");
    style.textContent = `
      footer.Footer, .sqs-block.footer, .footer-wrapper { display: none !important; }
    `;
    document.head.appendChild(style);
  }
});
