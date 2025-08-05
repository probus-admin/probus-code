// date-utils.js
console.log("📅 date-utils.js loaded");

// 🔁 String conversions
window.convertToISODate = function (ausDate) {
  if (!ausDate || typeof ausDate !== "string" || !ausDate.includes("/")) return "";
  const [day, month, year] = ausDate.split("/");
  return `${year}-${month}-${day}`;
};

window.convertToAUSDate = function (isoDate) {
  if (!isoDate || typeof isoDate !== "string" || !isoDate.includes("-")) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

// 🔁 Firestore timestamp conversions
window.convertFirestoreTimestampToAUSDate = function (timestamp) {
  if (!timestamp || !timestamp.toDate) return "";
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Australia/Sydney"
  }).format(date);
};

window.convertFirestoreTimestampToISODate = function (timestamp) {
  if (!timestamp || !timestamp.toDate) return "";
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Australia/Sydney"
  }).format(date).split("/").reverse().join("-");
};

window.convertISODateToFirestoreTimestamp = function (isoDate) {
  if (!isoDate || isoDate.length !== 10) return null;
  const [year, month, day] = isoDate.split("-");
  const date = new Date(Date.UTC(year, month - 1, day));
  return firebase.firestore.Timestamp.fromDate(date);
};

window.convertISODateTimeToFirestoreTimestamp = function (isoDateTime) {
  if (!isoDateTime || isoDateTime.length < 10) return null;
  const date = new Date(isoDateTime);
  if (isNaN(date.getTime())) {
    console.error("❌ Invalid Date-Time:", isoDateTime);
    return null;
  }
  return firebase.firestore.Timestamp.fromDate(date);
};

// 🔁 Merge date + time to Date object
window.mergeDateAndTime = function (dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    console.warn("⚠️ mergeDateAndTime received invalid input:", { dateStr, timeStr });
    return new Date("Invalid");
  }

  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);
    const merged = new Date(year, month - 1, day, hours, minutes);
    if (isNaN(merged.getTime())) throw new Error("Invalid merged Date");
    return merged;
  } catch (err) {
    console.error("❌ Failed to merge date/time:", err, { dateStr, timeStr });
    return new Date("Invalid");
  }
};

// 🔁 Pretty-formatted date string
window.formatPrettyDate = function (dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();

  function getOrdinalSuffix(n) {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  const suffix = getOrdinalSuffix(day);
  const weekday = date.toLocaleDateString("en-AU", { weekday: "long" });
  const month = date.toLocaleDateString("en-AU", { month: "long" });
  const year = date.getFullYear();

  return `${weekday} ${day}${suffix} ${month} ${year}`;
};
