// auth-session.js
console.log("🔐 auth-session.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  if (!window.isLiveWebsite || !window.isLiveWebsite()) {
    console.log("🛑 Not live site — skipping auth checks.");
    return;
  }

  const path = window.location.pathname;
  const isEditor = window.isSquarespaceEditor && window.isSquarespaceEditor();
  const isMaintenancePage = path.includes("/site-maintenance");

  const publicAccessPaths = [
    "/authenticate",
    "/members/forgot-password",
    "/members/verify-reset",
    "/administration/sync-members",
    "/public"
  ];
  const isPublicPage = publicAccessPaths.some(p => path.startsWith(p));

  const allowedAdminEmails = [
    "admin@combinedprobusclubofcherrybrook.org",
    "combinedprobusclubcherrybrook@gmail.com"
  ];

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      console.warn("❌ No Firebase user detected.");
      if (sessionStorage.getItem("impersonating") === "true") {
        console.log("🟡 Suppressing redirect due to impersonation session");
        return; // Let signInWithCustomToken finish
      }
      if (!isEditor && !isPublicPage) {
        console.log("🔁 Redirecting to /authenticate...");
        window.location.href = "/authenticate";
      } else {
        console.log("🛠️ Editor or public page — skipping redirect.");
        document.body.style.display = "block";
      }
      return;
    }

    const email = user.email || "";
    sessionStorage.setItem("probusMemberLoggedIn", "true");
    sessionStorage.setItem("probusMemberEmail", email);

    const isAdmin = allowedAdminEmails.includes(email);
    sessionStorage.setItem("isAdmin", isAdmin ? "true" : "false");
    window.isProbusAdmin = isAdmin;
    console.log(isAdmin ? "👑 Admin privileges granted" : "🔒 Not an admin");

    const isAdminPage = path.startsWith("/administration");
    if (isAdminPage && !isEditor && !isAdmin && !isMaintenancePage) {
      alert("Access denied. This page is restricted to Probus administrators.");
      window.location.href = "/home";
      return;
    }

    const cachedID = sessionStorage.getItem("probusMemberID");
    const cachedName = sessionStorage.getItem("probusMemberName");

    const isImpersonating = sessionStorage.getItem("impersonating") === "true";
    const skipCache = isImpersonating;

    if (!skipCache && cachedID && cachedName) {
      console.log(`✅ Using session-stored member: ${cachedName}`);
      const cachedIsCommittee = sessionStorage.getItem("probusCommitteeMember") === "YES";
      const cachedActivityRoles = JSON.parse(sessionStorage.getItem("probusActivityRoles") || "[]");
      if (typeof waitForNavBarThenInsertWelcome === "function") {
        waitForNavBarThenInsertWelcome(cachedName, cachedIsCommittee, cachedActivityRoles);
      }
      document.body.style.display = "block";
      return;
    }

    firebase.firestore().collection("members").where("email", "==", email.toLowerCase()).limit(1).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.warn("⚠️ No member found for", email);
          document.body.style.display = "block";
          return;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

        if (isImpersonating) {
          const banner = document.createElement("div");
          banner.textContent = `⚠️ Impersonating ${fullName}`;
          banner.style.background = "#ffcc00";
          banner.style.color = "#000";
          banner.style.padding = "10px";
          banner.style.textAlign = "center";
          banner.style.fontWeight = "bold";
          document.body.prepend(banner);
        }

        const role = data.committeeRole || "";
        const mobile = data.mobile || "";

        sessionStorage.setItem("probusMemberID", doc.id);
        sessionStorage.setItem("probusMemberName", fullName);
        sessionStorage.setItem("probusCommitteeRole", role);
        sessionStorage.setItem("probusCommitteeMember", role ? "YES" : "NO");
        sessionStorage.setItem("probusMemberMobile", mobile);
        const activityRoles = Array.isArray(data.activityLeaderRole) ? data.activityLeaderRole : [];
        sessionStorage.setItem("probusActivityRoles", JSON.stringify(activityRoles));

        if (typeof waitForNavBarThenInsertWelcome === "function") {
          waitForNavBarThenInsertWelcome(fullName, !!role, activityRoles);
        }

        document.body.style.display = "block";
      })
      .catch(err => {
        console.error("❌ Error loading member details:", err);
        document.body.style.display = "block";
      });
  });
});
