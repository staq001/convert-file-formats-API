/**VARIABLES */

const uploadFileBtn = document.getElementById("uploadFile") as HTMLElement;
const compressPDFBtn = document.getElementById("compress-pdf") as HTMLElement;
const downloadPDFBtn = document.getElementById("download-pdf") as HTMLElement;

/**FUNCTIONS */
function toggleButton(
  button1: HTMLElement,
  button2: HTMLElement,
  value?: string | undefined
) {
  button1.style.display = "none";
  button2.style.display = "block";
  if (value) button2.setAttribute("appropos", value);
}

async function fetchUrl(
  url: string,
  message: string,
  method: string,
  error: string,
  body: FormData | undefined = undefined,
  headers: any | undefined = undefined
) {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (response.ok) {
      alert(message); // same
      return response.json();
    } else console.log(error);
  } catch (e) {
    console.error("An error occurred--", e);
  }
}

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

      const fd = new FormData();
      fd.append("file", file);

      const response = await fetchUrl(
        "/api/upload-file",
        "File uploaded successfully!",
        "POST",
        "Upload failed!",
        fd,
        {
          filename: file.name,
        }
      );
      toggleButton(uploadFileBtn, compressPDFBtn, response.id);

      console.log(response);
    }
  });

compressPDFBtn.addEventListener("click", async () => {
  const attribute = compressPDFBtn.getAttribute("appropos");

  const response = await fetchUrl(
    `/api/compress-pdf/${attribute}`,
    "PDF File compressed successfully",
    "PUT",
    "Compression Failed"
  );

  if (response.status.toLowerCase() === "success") {
    toggleButton(compressPDFBtn, downloadPDFBtn);
  }
  console.log(response);
});
