import { spawn } from "node:child_process";

export async function convertDocxToPDF(
  inputFilePath: string,
  outputDirectory?: string
) {
  return new Promise((resolve, reject) => {
    const libreoffice = spawn("libreoffice", [
      "--headless",
      "--convert-to",
      "pdf",
      // "--outdir",
      // outputDirectory,
      inputFilePath,
    ]);

    libreoffice.on("close", (code) => {
      if (code === 0) {
        resolve(`Libreoffice exited with ${code}`);
      } else {
        reject(`LibreOffice exited with ${code}`);
      }
    });

    libreoffice.on("error", (error) => {
      if (error) {
        reject(error);
      }
    });
  });
}

export async function convertPDFToDocx(
  originalPath: string,
  outputDirectory: string
) {
  return new Promise((resolve, reject) => {
    const libreoffice = spawn("libreoffice", [
      "--headless",
      `--infilter="writer_pdf_import`,
      "--convert-to",
      "docx",
      "--outdir",
      outputDirectory,
      originalPath,
    ]);

    libreoffice.on("close", (code) => {
      if (code === 0) {
        resolve(`libreoffice exited with code: ${code}`);
      } else {
        reject(`libreoffice exited with code ${code}`);
      }
    });

    libreoffice.on("error", (error) => {
      reject(error);
    });
  });
}

export async function convertDocxToHTML(
  originalPath: string,
  outputDirectory: string
) {
  return new Promise((resolve, reject) => {
    const libreoffice = spawn("libreoffice", [
      "--headless",
      "--convert-to",
      "html",
      "--outdir",
      outputDirectory,
      originalPath,
    ]);

    libreoffice.on("close", (code) => {
      if (code === 0) {
        resolve(`libreoffice exited with code: ${code}`);
      } else {
        reject(`libreoffice exited with code ${code}`);
      }
    });

    libreoffice.on("error", (error) => {
      reject(error);
    });
  });
}
