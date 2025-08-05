// image-upload.js

console.log("📸 image-upload.js loaded");

window.initializeImageUpload = function (
  uploadButtonId,
  fileInputId,
  previewContainerId,
  dropZoneId,
  textareaId = "imageURLs"
) {
  console.log("🚀 initializeImageUpload() was called!");

  const uploadButton = document.getElementById(uploadButtonId);
  const fileInput = document.getElementById(fileInputId);
  const previewContainer = document.getElementById(previewContainerId);
  const dropZone = document.getElementById(dropZoneId);

  if (!uploadButton || !fileInput || !previewContainer || !dropZone) {
    console.error("❌ One or more upload elements are missing. Aborting initialization.");
    return;
  }

  if (!window.imageURLs) window.imageURLs = [];

  const currentPath = window.location.pathname;
  const allowMultiple = currentPath.includes("/supplier-management")
    || currentPath.includes("/event-management")
    || currentPath.includes("/help-admin");

  function handleFiles(files) {
    if (!files || files.length === 0) {
      console.warn("⚠️ No files selected.");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`❌ "${file.name}" is not a valid image.`);
        continue;
      }

      if (!allowMultiple && window.imageURLs.length >= 1) {
        alert("⚠️ Only one image is allowed.");
        break;
      }

      previewAndUploadImage(file);
    }
  }

  function previewAndUploadImage(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("image-preview");

      const img = document.createElement("img");
      img.src = event.target.result;
      img.alt = "Uploaded Image";
      img.style = "width: 150px; border-radius: 8px; margin-right: 10px;";

      imageWrapper.appendChild(img);
      previewContainer.appendChild(imageWrapper);

      uploadToImgBB(file)
        .then(url => {
          window.imageURLs.push(url);
          console.log("✅ Uploaded to ImgBB:", url);

          const outputField = document.getElementById(textareaId);
          if (outputField) outputField.value = window.imageURLs.join("\n");

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-image");
          deleteButton.innerHTML = "×";
          deleteButton.setAttribute("data-tippy-content", "Remove image");

          deleteButton.addEventListener("click", function (event) {
            event.preventDefault();
            imageWrapper.remove();
            window.imageURLs = window.imageURLs.filter(u => u !== url);
            if (outputField) outputField.value = window.imageURLs.join("\n");
          });

          imageWrapper.appendChild(deleteButton);

          if (typeof tippy === "function") {
            tippy(deleteButton, {
              content: "Remove image",
              placement: "top",
              theme: "custom",
              animation: "shift-away",
              duration: [200, 150],
            });
          }
        })
        .catch(error => {
          console.error("❌ ImgBB upload failed:", error);
          alert("❌ Failed to upload image.");
          imageWrapper.remove();
        });
    };

    reader.readAsDataURL(file);
  }

  uploadButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (!fileInput.hasAttribute("disabled")) fileInput.click();
  });

  fileInput.addEventListener("change", function (event) {
    handleFiles(event.target.files);
  });

  dropZone.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", function () {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", function (event) {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
    const files = event.dataTransfer.files;
    handleFiles(files);
  });
};

window.uploadToImgBB = async function (file, pageSlug = null, docId = null) {
  console.log("🛠️ Starting ImgBB upload for:", file.name);

  const apiKey = "73b1e1247b0396f76d0cd3ae5928272f"; // ✅ No access risk if Firestore rules protect write access
  const formData = new FormData();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];
      formData.append("image", base64String);

      try {
        document.body.classList.add("uploading-image");

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        document.body.classList.remove("uploading-image");

        if (result.success) {
          const imageUrl = result.data.url;
          const user = firebase.auth().currentUser;
          const uploadedBy = user ? user.email : "unknown";

          const imageDoc = {
            url: imageUrl,
            thumbnail: imageUrl,
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy,
            category: "Newsletter",
            archived: false,
            pageSLUGs: pageSlug ? [pageSlug] : [],
            docIds: docId ? [docId] : []
          };

          await firebase.firestore().collection("imageUploads").add(imageDoc);
          resolve(imageUrl);
        } else {
          console.error("❌ ImgBB upload failed:", result.error);
          reject("ImgBB upload failed.");
        }
      } catch (error) {
        document.body.classList.remove("uploading-image");
        reject(error);
      }
    };

    reader.readAsDataURL(file);
  });
};
