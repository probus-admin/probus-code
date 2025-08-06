// custom-header.js
console.log("🧩 custom-header.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  function insertHeader(html) {
    const header = document.createElement("header");
    header.className = "custom-probus-header";
    header.innerHTML = html;
    document.body.insertBefore(header, document.body.firstChild);
  }

  // Define shared links
  const sharedLinks = `
    <a href="/home">Home</a>
    <a href="/events">Events</a>
    <a href="/documents">Documents</a>
  `;

  // Define header variants
  const headers = {
    committee: `
      <nav class="probus-nav committee-nav">
        ${sharedLinks}
        <a href="/committee-only">Committee Hub</a>
        <a href="/administration">Admin</a>
      </nav>
    `,
    members: `
      <nav class="probus-nav members-nav">
        ${sharedLinks}
        <a href="/members">Members Hub</a>
        <a href="/edit-my-profile">My Profile</a>
      </nav>
    `,
    activity: `
      <nav class="probus-nav activity-nav">
        ${sharedLinks}
        <a href="/activities">Activities</a>
        <a href="/activity-management">Manage Activities</a>
      </nav>
    `,
    help: `
      <nav class="probus-nav help-nav">
        <a href="/help">Help Index</a>
        <a href="/helpdesk-my-tickets">My Tickets</a>
        <a href="/help-admin">Help Admin</a>
      </nav>
    `
  };

  // Route based on URL path
  if (path.startsWith("/committee-only") || path.startsWith("/administration")) {
    insertHeader(headers.committee);
  } else if (path.startsWith("/members")) {
    insertHeader(headers.members);
  } else if (path.startsWith("/activities") || path.startsWith("/activity-management")) {
    insertHeader(headers.activity);
  } else if (path.startsWith("/help") || path.includes("helpdesk")) {
    insertHeader(headers.help);
  }

  // Optional: hide Squarespace's native header
  const hideNativeHeader = true;
  if (hideNativeHeader) {
    const style = document.createElement("style");
    style.textContent = `
      .Header, .header-wrapper, .sqs-block.header { display: none !important; }
    `;
    document.head.appendChild(style);
  }
});
