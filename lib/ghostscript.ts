import { spawn } from "child_process";
import { argv } from "process";
export async function compressPDF(originalPath: string, destination: string) {
  return new Promise((resolve, reject) => {
    const ghostscript = spawn("gs", [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      "-dPDFSETTINGS=/screen",
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-sOutputFile=${destination}`,
      originalPath,
    ]);

    ghostscript.on("close", (code) => {
      if (code === 0) {
        resolve(`Ghostscript exited with code: ${code}`);
      } else {
        reject(`Ghostscript exited with code ${code}`);
      }
    });

    ghostscript.on("error", (error) => {
      reject(error);
    });
  });
}

// console.log(argv);

compressPDF(argv[2], argv[3]);
