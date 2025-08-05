// audit-log.js
console.log("📝 audit-log.js loaded");

// 🔹 Basic audit logger
window.logAudit = function ({
  user = firebase.auth().currentUser?.email || "Unknown User",
  action = "",
  targetType = "",
  targetId = "",
  description = "",
  before = null,
  after = null,
  timestamp = null
}) {
  const db = firebase.firestore();
  const logEntry = {
    timestamp: timestamp || firebase.firestore.FieldValue.serverTimestamp(),
    user,
    action,
    targetType,
    targetId,
    description,
    before,
    after
  };

  db.collection("auditLog").add(logEntry)
    .then(() => console.log("📘 Audit log entry saved:", action))
    .catch(error => console.error("❌ Audit log failed:", error));
};

// 🔹 Log and write Firestore change
window.logFirestoreChange = async function ({
  collection,
  docId,
  action,
  newData,
  description = ""
}) {
  const db = firebase.firestore();
  const docRef = db.collection(collection).doc(docId);
  const beforeSnap = await docRef.get();
  const before = beforeSnap.exists ? beforeSnap.data() : null;

  await docRef.set(newData, { merge: true });

  logAudit({
    action,
    targetType: collection,
    targetId: docId,
    description,
    before,
    after: newData
  });
};
