import { spawn } from "child_process";

export async function compressPDF(
  originalPath: string,
  destination: string
): Promise<string | void> {
  return new Promise((resolve, reject) => {
    const ghostscript = spawn("gs", [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      "dPDFSETTINGS=/screen",
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-sOutputFile=${destination}`,
      originalPath,
    ]);

    ghostscript.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Ghostscript exited with code ${code}`);
      }
    });

    ghostscript.on("error", (error) => {
      reject(error);
    });
  });
}
