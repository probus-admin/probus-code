// custom-footer.js
console.log("🔻 custom-footer.js loaded");

document.addEventListener("DOMContentLoaded", async function () {
  const config = await getClubConfig();

  const footer = document.createElement("footer");
  footer.className = "custom-probus-footer";

  const currentYear = new Date().getFullYear();

  const clubName = config.clubName || "Probus Club";
  const clubNumber = config.clubNumber || "N/A";
  const district = config.rotaryDistrict || "N/A";
  const contactEmail = config.contactEmail || "";
  const incorporation = config.incorporationNumber || "";
  const probusLogo = config.probusLogo || "";
  const clubLogo = config.clubLogo || "";

  // Optional: images only if URLs exist
  const logoHTML = `
    <div class="footer-logos">
      ${probusLogo ? `<img src="${probusLogo}" alt="Probus Logo" class="footer-logo">` : ""}
      ${clubLogo ? `<img src="${clubLogo}" alt="Club Logo" class="footer-logo">` : ""}
    </div>
  `;

  footer.innerHTML = `
    <div class="footer-inner">
      ${logoHTML}
      <p>&copy; ${currentYear} ${clubName}</p>
      <p>Club No. ${clubNumber} — Rotary District ${district}</p>
      ${incorporation ? `<p>Incorporation No. ${incorporation}</p>` : ""}
      <p class="footer-links">
        ${contactEmail ? `<a href="mailto:${contactEmail}">Contact</a> | ` : ""}
        <a href="/privacy">Privacy</a> |
        <a href="/help">Help</a>
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
