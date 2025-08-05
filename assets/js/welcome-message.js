// welcome-message.js
console.log("👋 welcome-message.js loaded");

function insertWelcomeMessage(memberName, isCommittee = false, activityRolesContainer = []) {
  const navBar = document.querySelector("nav.header-nav-list");

  if (!navBar) {
    console.warn("❌ Nav bar not found. Retrying...");
    setTimeout(() => insertWelcomeMessage(memberName, isCommittee, activityRolesContainer), 1000);
    return;
  }

  if (document.getElementById("welcomeMessage")) {
    console.log("🔹 Welcome message already exists.");
    return;
  }

  const welcomeDiv = document.createElement("div");
  welcomeDiv.id = "welcomeMessage";

  // 🎨 Determine role and style
  let roleText = "";
  let backgroundColour = "#e3f2fd"; // Default: light blue for standard members
  let textColour = "#003366";       // Default: dark blue text

  if (isCommittee) {
    roleText = " (Committee)";
    backgroundColour = "#c62828"; // Red
    textColour = "#ffffff";       // White text
  } else if (Array.isArray(activityRolesContainer) && activityRolesContainer.length > 0) {
    roleText = " (Activity Leader)";
    backgroundColour = "#2e7d32"; // Green
    textColour = "#ffffff";       // White text
  }

  welcomeDiv.style.cssText = `
    font-size: 1.4rem;
    font-weight: bold;
    color: ${textColour};
    background-color: ${backgroundColour};
    margin-bottom: 0.4rem;
    text-align: center;
    width: 100%;
    padding: 0.6rem;
    border-radius: 6px;
  `;

  welcomeDiv.innerHTML = `Welcome, ${memberName}${roleText}`;

  const dateDiv = document.createElement("div");
  dateDiv.id = "currentDate";
  dateDiv.style.cssText = `
    text-align: center;
    padding: 10px;
    font-size: 1.2rem;
    color: #666;
  `;

  const today = new Date();
  const dateString = today.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  dateDiv.textContent = dateString;

  navBar.parentNode.insertBefore(welcomeDiv, navBar);
  navBar.parentNode.insertBefore(dateDiv, navBar);

  console.log("✅ Welcome and date message added.");
}

window.waitForNavBarThenInsertWelcome = function (memberName, isCommittee = false, activityRolesContainer = []) {
  const navBar = document.querySelector("nav.header-nav-list");
  if (navBar) {
    insertWelcomeMessage(memberName, isCommittee, activityRolesContainer);
  } else {
    const observer = new MutationObserver((_, obs) => {
      const nav = document.querySelector("nav.header-nav-list");
      if (nav) {
        insertWelcomeMessage(memberName, isCommittee, activityRolesContainer);
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
};
