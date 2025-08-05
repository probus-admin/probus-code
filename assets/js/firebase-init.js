// firebase-init.js
console.log("🔥 Initialising Firebase...");

if (typeof firebase === "undefined") {
  console.error("❌ Firebase SDK not loaded!");
} else {
  const config = {
    apiKey: "AIzaSyCXXzfX-KRAKe2w2x0w2pr7f1lsSfl-TSY",
    authDomain: "combinedprobusclubcherry-c56d8.firebaseapp.com",
    projectId: "combinedprobusclubcherry-c56d8",
    storageBucket: "combinedprobusclubcherry-c56d8.appspot.com",
    messagingSenderId: "157238849434",
    appId: "1:157238849434:web:d7821d00063c9da3429423"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
    console.log("✅ Firebase initialised.");
  } else {
    console.log("ℹ️ Firebase already initialised.");
  }

  // Expose globals
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  window.storage = firebase.storage();

  window.waitForFirestore = async function () {
    let retries = 5;
    while (!window.db && retries > 0) {
      console.warn(`⏳ Waiting for Firestore... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 500));
      retries--;
    }
    if (!window.db) console.error("❌ Firestore failed to initialize.");
  };
}
