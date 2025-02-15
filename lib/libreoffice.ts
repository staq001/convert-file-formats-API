import { spawn } from "node:child_process";

export async function convertDocxToPDF(
  inputFilePath: string
): Promise<string | void> {
  return new Promise((resolve, reject) => {
    const libreoffice = spawn("libreoffice", [
      "--headless",
      "--convert-to",
      "pdf",
      inputFilePath,
    ]);

    libreoffice.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Pandoc exited with ${code}`);
      }
    });

    libreoffice.on("error", (error) => {
      if (error) {
        reject(error);
      }
    });
  });
}
