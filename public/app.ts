/**VARIABLES */

const uploadFileBtn = document.getElementById(
  "uploadFile"
) as HTMLButtonElement;
const mergePDFBtn = document.getElementById("merge-pdf") as HTMLButtonElement;
const compressPDFBtn = document.getElementById(
  "compress-pdf"
) as HTMLButtonElement;
const downloadPDFBtn = document.getElementById(
  "download-pdf"
) as HTMLButtonElement;
const pdftoDocxBtn = document.getElementById(
  "convert-pdf"
) as HTMLButtonElement;
const docxToHtmlBtn = document.getElementById(
  "convert-docx-to-html"
) as HTMLButtonElement;
const pdfToJpegBtn = document.getElementById(
  "convert-pdf-to-jpeg"
) as HTMLButtonElement;
const docxToPdfBtn = document.getElementById(
  "convert-docx-to-pdf"
) as HTMLButtonElement;
const pdfToTxtBtn = document.getElementById("pdf-to-txt") as HTMLButtonElement;
const pdfToHtmlBtn = document.getElementById(
  "pdf-to-html"
) as HTMLButtonElement;

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

async function downloadFile(
  attribute: string,
  fileType: string,
  operation?: string,
  headers?: any
) {
  try {
    const response = await fetch(
      `/api/download-file/${attribute}/${operation}`,
      {
        method: "GET",
        headers,
      }
    );

    const customFileName =
      response.headers
        .get("Content-Disposition")
        ?.match(/filename="(.+)"/)?.[1] || `download.${fileType}`;

    if (!response.ok) {
      throw new Error("File Download failed!");
    }
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = customFileName;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error("An error occurred--", e);
  }
}

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
        }
      });

    compressPDFBtn.addEventListener("click", async () => {
      compressPDFBtn.disabled = true;
      compressPDFBtn.innerHTML = "Compressing...";

      const attribute = compressPDFBtn.getAttribute("appropos") as string;

      const response = await fetchUrl(
        `/api/compress-pdf/${attribute}`,
        "PDF File compressed successfully",
        "PUT",
        "Compression Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(compressPDFBtn, downloadPDFBtn, attribute);
      }
    });
    downloadPDFBtn.addEventListener("click", () => {
      const attribute = downloadPDFBtn.getAttribute("appropos") as string;
      downloadFile(attribute, "pdf", "compress");
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
        }
      });

    pdftoDocxBtn.addEventListener("click", async () => {
      pdftoDocxBtn.disabled = true;
      pdftoDocxBtn.innerHTML = "Converting...";
      const attribute = pdftoDocxBtn.getAttribute("appropos") as string;

      const response = await fetchUrl(
        `/api/convert-pdf-to-word/${attribute}`,
        "PDF File converted to Docx successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(pdftoDocxBtn, downloadPDFBtn, attribute);
      }
    });
    // downloadPDFBtn.addEventListener("click", () => {
    //   const attribute = downloadPDFBtn.getAttribute("appropos") as string;
    //   downloadFile(attribute, "docx");
    // });
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
        toggleButton(docxToHtmlBtn, downloadPDFBtn, attribute as string);
      }
    });
    // downloadPDFBtn.addEventListener("click", () => {
    //   const attribute = downloadPDFBtn.getAttribute("appropos") as string;
    //   downloadFile(attribute, "html");
    // });
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
        }
      });

    pdfToJpegBtn.addEventListener("click", async () => {
      pdfToJpegBtn.disabled = true;
      pdfToJpegBtn.innerHTML = "Converting...";
      const attribute = pdfToJpegBtn.getAttribute("appropos") as string;

      const response = await fetchUrl(
        `/api/convert-pdf-to-jpeg/${attribute}`,
        "PDF File converted to JPEG successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(pdfToJpegBtn, downloadPDFBtn, attribute);
      }
    });
    downloadPDFBtn.addEventListener("click", () => {
      const attribute = downloadPDFBtn.getAttribute("appropos") as string;
      downloadFile(attribute, "zip", "jpeg", {
        "Content-Type": "application/zip",
      });
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
    });
    break;
  case "/mergepdf.html":
    document
      .getElementById("fileInput")
      ?.addEventListener("change", async (event) => {
        event.preventDefault();
        const target = event.target as HTMLInputElement;

        if (target.files) {
          const files = target.files;

          for (let i = 0; i < files.length; i++) {
            const fd = new FormData();
            fd.append("file", files[i]);

            const response = await fetchUrl(
              "/api/upload-file",
              "File uploaded successfully!",
              "POST",
              "Upload failed!",
              fd,
              {
                filename: files[i].name,
              }
            );
            if (i === 0) {
              mergePDFBtn.setAttribute("appropos", response.id);
            } else {
              mergePDFBtn.setAttribute("second", response.id);
            }
            toggleButton(uploadFileBtn, mergePDFBtn);
          }
        }
      });

    mergePDFBtn.addEventListener("click", async () => {
      mergePDFBtn.disabled = true;
      mergePDFBtn.innerHTML = "Merging...";

      const first = mergePDFBtn.getAttribute("appropos");
      const second = mergePDFBtn.getAttribute("second");

      const response = await fetchUrl(
        `/api/merge-pdfs/${first}/${second}`,
        "PDF Files Merged Successfully!",
        "PUT",
        "Merge Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(mergePDFBtn, downloadPDFBtn, `${first}/${second}`);
      }
    });

    downloadPDFBtn.addEventListener("click", () => {
      const attribute = downloadPDFBtn.getAttribute("appropos") as string;
      downloadFile(attribute, "pdf", "pdf");
    });
    break;
  case "/pdftotext.html":
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
          toggleButton(uploadFileBtn, pdfToTxtBtn, response.id);
        }
      });

    pdfToTxtBtn.addEventListener("click", async () => {
      pdfToTxtBtn.disabled = true;
      pdfToTxtBtn.innerHTML = "Converting...";

      const attribute = pdfToTxtBtn.getAttribute("appropos") as string;

      const response = await fetchUrl(
        `/api/convert-pdf-to-text/${attribute}`,
        "PDF File converted to .TXT successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(pdfToTxtBtn, downloadPDFBtn, attribute);
      }
    });
    downloadPDFBtn.addEventListener("click", () => {
      const attribute = downloadPDFBtn.getAttribute("appropos") as string;
      downloadFile(attribute, "txt", "txt");
    });
    break;

  case "/pdftohtml.html":
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
          toggleButton(uploadFileBtn, pdfToHtmlBtn, response.id);
        }
      });

    pdfToHtmlBtn.addEventListener("click", async () => {
      pdfToHtmlBtn.disabled = true;
      pdfToHtmlBtn.innerHTML = "Converting...";
      const attribute = pdfToHtmlBtn.getAttribute("appropos") as string;

      const response = await fetchUrl(
        `/api/convert-pdf-to-html/${attribute}`,
        "PDF File converted to HTML successfully",
        "PUT",
        "Conversion Failed"
      );

      if (response?.status?.toLowerCase() === "success") {
        toggleButton(pdfToHtmlBtn, downloadPDFBtn, attribute);
      }
    });

    downloadPDFBtn.addEventListener("click", () => {
      const attribute = downloadPDFBtn.getAttribute("appropos") as string;
      downloadFile(attribute, "zip", "html", {
        "Content-Type": "application/zip",
      });
    });

    break;
}
