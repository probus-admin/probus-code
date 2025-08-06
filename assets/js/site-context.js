// site-context.js
console.log("🌐 site-context.js loaded");

// Detect Squarespace editor mode (via referrer)
window.isSquarespaceEditor = function () {
  return document.referrer.includes("squarespace.com");
};

// Detect local dev (localhost)
window.isLocalhost = function () {
  return window.location.hostname === "localhost";
};

// Detect live production site
window.isLiveWebsite = function () {
  return window.location.hostname === "www.combinedprobusclubofcherrybrook.org";
};

// Detect test (trial) site
window.isTestWebsite = function () {
  return window.location.hostname === "www.combinedprobusclubcherrybrook.org" || 
         window.location.hostname.includes(".squarespace.com");
};

// Return a Club ID (used for config lookup)
window.getClubID = function () {
  if (window.isLiveWebsite()) return "cherrybrook";
  if (window.isTestWebsite()) return "cherrybrook-test";
  return "unknown";
};

// Optional: Load club-level config from Firestore
window.getClubConfig = async function () {
  if (!firebase?.firestore) {
    console.warn("⚠️ Firestore not available — cannot load club config.");
    return {};
  }

  const clubId = window.getClubID();
  const docRef = firebase.firestore().collection("siteConfig").doc(clubId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    console.warn(`⚠️ No siteConfig found for club ID: ${clubId}`);
    return {};
  }

  console.log(`📄 Loaded config for club ID: ${clubId}`);
  return docSnap.data();
};
