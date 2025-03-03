/**VARIABLES */

const uploadFileBtn = document.getElementById("uploadFile") as HTMLElement;
const compressPDFBtn = document.getElementById("compress-pdf") as HTMLElement;
const downloadPDFBtn = document.getElementById("download-pdf") as HTMLElement;
const pdftoDocxBtn = document.getElementById("convert-pdf") as HTMLElement;
const docxToHtmlBtn = document.getElementById(
  "convert-docx-to-html"
) as HTMLElement;
const pdfToJpegBtn = document.getElementById(
  "convert-pdf-to-jpeg"
) as HTMLElement;
const docxToPdfBtn = document.getElementById(
  "convert-docx-to-pdf"
) as HTMLElement;

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
    } else console.error(error);
  } catch (e) {
    console.error("An error occurred--", e);
  }
}

uploadFileBtn.addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;

  fileInput.click();
});

switch (window.location.href.split("pages")[1].toString()) {
  case "/compresspdf.html":
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

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(compressPDFBtn, downloadPDFBtn);
      }
      console.log(response);
    });
    break;

  case "/pdftodocx.html":
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
          toggleButton(uploadFileBtn, pdftoDocxBtn, response.id);

          console.log(response);
        }
      });

    pdftoDocxBtn.addEventListener("click", async () => {
      const attribute = pdftoDocxBtn.getAttribute("appropos");

      const response = await fetchUrl(
        `/api/convert-pdf-to-word/${attribute}`,
        "PDF File converted to Docx successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(pdftoDocxBtn, downloadPDFBtn);
      }
      console.log(response);
    });
    break;

  case "/docxtohtml.html":
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
          toggleButton(uploadFileBtn, docxToHtmlBtn, response.id);

          console.log(response);
        }
      });

    docxToHtmlBtn.addEventListener("click", async () => {
      const attribute = docxToHtmlBtn.getAttribute("appropos");

      const response = await fetchUrl(
        `/api/convert-word-to-html/${attribute}`,
        "Docx File converted to HTML successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(docxToHtmlBtn, downloadPDFBtn);
      }
      console.log(response);
    });
    break;
  case "/pdftojpeg.html":
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
          toggleButton(uploadFileBtn, pdfToJpegBtn, response.id);

          console.log(response);
        }
      });

    pdfToJpegBtn.addEventListener("click", async () => {
      const attribute = pdfToJpegBtn.getAttribute("appropos");

      const response = await fetchUrl(
        `/api/convert-pdf-to-jpeg/${attribute}`,
        "PDF File converted to JPEG successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(pdfToJpegBtn, downloadPDFBtn);
      }
      console.log(response);
    });
    break;
  case "/docxtopdf.html":
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
          toggleButton(uploadFileBtn, docxToPdfBtn, response.id);

          console.log(response);
        }
      });

    docxToPdfBtn.addEventListener("click", async () => {
      const attribute = docxToPdfBtn.getAttribute("appropos");

      const response = await fetchUrl(
        `/api/convert-docx-to-pdf/${attribute}`,
        "DOCX File converted to PDF successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(docxToPdfBtn, downloadPDFBtn);
      }
      console.log(response);
    });
    break;
}
