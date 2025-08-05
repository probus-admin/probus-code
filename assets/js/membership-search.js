// membership-search.js
console.log("🔍 membership-search.js loaded");

document.addEventListener("DOMContentLoaded", async function () {
  console.log("🚀 Initialising member search...");

  const searchBox = document.getElementById("searchBox");
  const searchButton = document.getElementById("searchButton");
  const clearButton = document.getElementById("clearSearchButton");
  const searchResults = document.getElementById("searchResults");
  const searchResultsCount = document.getElementById("searchResultsCount");

  if (!searchBox || !searchButton || !searchResults || !searchResultsCount || !clearButton) {
    console.warn("❌ One or more search elements not found.");
    return;
  }

  if (!window.db) {
    console.error("❌ Firestore (window.db) is not available.");
    return;
  }

  let cachedMembers = [];

  try {
    const snapshot = await window.db.collection("members").get();
    cachedMembers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Cached ${cachedMembers.length} members for fast search.`);
  } catch (error) {
    console.error("❌ Error loading members:", error);
    alert("Error loading member data.");
    return;
  }

  searchButton.addEventListener("click", function () {
    const query = searchBox.value.trim().toLowerCase();
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    searchResultsCount.style.display = "none";

    if (!query) {
      alert("Please enter a name or email to search.");
      return;
    }

    const matches = cachedMembers.filter(member => {
      const firstName = (member.firstName || "").toLowerCase();
      const lastName = (member.lastName || "").toLowerCase();
      const email = (member.email || "").toLowerCase();
      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        email.includes(query)
      );
    });

    if (matches.length === 0) {
      searchResults.innerHTML = "<p>No members found.</p>";
      searchResults.style.display = "block";
      return;
    }

    searchResultsCount.textContent = `${matches.length} r
