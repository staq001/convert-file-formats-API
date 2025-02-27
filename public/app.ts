document.getElementById("uploadFile")?.addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;

  fileInput.click();
});

document
  .getElementById("fileInput")
  ?.addEventListener("change", async (event) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;

    if (target.files) {
      const file = target.files[0];
      console.log("Selected file: ", file);

      const fd = new FormData();
      fd.append("file", file);

      try {
        const response = await fetch("/api/upload-file", {
          method: "POST",
          headers: {
            filename: file.name,
          },
          body: fd,
        });

        if (response.ok) {
          console.log("Upload was successful");
        } else console.log("Upload failed");
      } catch (e) {
        console.error("Error during file upload:", e);
      }
    }
  });
