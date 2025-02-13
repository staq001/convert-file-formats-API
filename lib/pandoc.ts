import { spawn } from "node:child_process";

export async function convertDocxToHTML(
  inputFilePath: string,
  outputFilePath: string
): Promise<string | void> {
  return new Promise((resolve, reject) => {
    const pandoc = spawn("pandoc", [inputFilePath, "-o", outputFilePath]);

    pandoc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Pandoc exited with ${code}`);
      }
    });

    pandoc.on("error", (error) => {
      if (error) {
        reject(error);
      }
    });
  });
}

export async function convertDocxToPDF(
  inputFilePath: string,
  outputFilePath: string
): Promise<string | void> {
  return new Promise((resolve, reject) => {
    const pandoc = spawn("pandoc", [inputFilePath, "-o", outputFilePath]);

    pandoc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Pandoc exited with ${code}`);
      }
    });

    pandoc.on("error", (error) => {
      if (error) {
        reject(error);
      }
    });
  });
}
