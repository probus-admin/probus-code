// image-preview.js
console.log("🖼️ image-preview.js loaded");

window.displayImagePreview = function (
  imageURLs,
  previewContainerId = "previewContainer",
  textareaId = "imageURLs"
) {
  const previewContainer = document.getElementById(previewContainerId);
  const imageURLsField = document.getElementById(textareaId);

  if (!previewContainer) {
    console.error("❌ previewContainer not found.");
    return;
  }

  previewContainer.innerHTML = "";

  if (!Array.isArray(imageURLs) || imageURLs.length === 0) {
    console.warn("⚠️ No images to preview.");
    return;
  }

  window.imageURLs = [...imageURLs]; // Set global reference

  imageURLs.forEach((url, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("image-preview");

    const img = document.createElement("img");
    img.src = url;
    img.alt = `Uploaded Image ${index + 1}`;
    img.style.width = "150px";
    img.style.borderRadius = "8px";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-image");
    deleteButton.innerHTML = "×";
    deleteButton.setAttribute("data-tippy-content", "Remove this image");

    deleteButton.addEventListener("click", function () {
      console.log("🗑 Removing image:", url);
      window.imageURLs = window.imageURLs.filter(imgUrl => imgUrl !== url);
      window.displayImagePreview(window.imageURLs, previewContainerId, textareaId);
    });

    wrapper.appendChild(img);
    wrapper.appendChild(deleteButton);
    previewContainer.appendChild(wrapper);

    if (typeof tippy === "function") {
      tippy(deleteButton, {
        content: "Remove this image",
        placement: "top",
        theme: "custom",
        animation: "shift-away",
        duration: [200, 150],
      });
    }
  });

  if (imageURLsField) {
    imageURLsField.value = window.imageURLs.join("\n");
  }

  console.log(`🖼️ Displayed ${imageURLs.length} image(s) in preview.`);
};
