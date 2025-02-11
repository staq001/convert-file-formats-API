import { spawn } from "node:child_process";

// convert filename.pdf to plain text and print to stdout.
// pdftotext filename.pdf -- command

// Convert input.pdf to plain text and save it as output.txt:
// pdftotext input.pdf output.txt

// Convert filename.pdf to plain text and preserve the layout:
// pdftotext -layout filename.pdf

export const makeText = async (
  fullPath: string,
  textPath: string
): Promise<string | void> => {
  return new Promise((resolve, reject) => {
    const poppler = spawn("pdftotext", ["-layout", fullPath, textPath]);

    poppler.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Poppler exited with this code ${code}`);
      }
    });

    poppler.on("error", (err) => {
      reject(err);
    });
  });
};

export const makeImage = async (
  inputFilePath: string,
  outputFilePath: string
): Promise<string | void> => {
  return new Promise((resolve, reject) => {
    const poppler = spawn("pdftoppm", [inputFilePath, outputFilePath, "-png"]);

    poppler.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Poppler exited with code ${code}`);
      }
    });

    poppler.on("error", (err) => {
      reject(err);
    });
  });
};

export const mergePDF = async (
  inputFilePath: string,
  secondFilePath: string,
  finalDestination: string
): Promise<string | void> => {
  return new Promise((resolve, reject) => {
    const poppler = spawn("pdfunite", [inputFilePath, secondFilePath, finalDestination]);

    poppler.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Poppler exited with code ${code}`);
      }
    });

    poppler.on("error", (err) => {
      reject(err);
    });
  });
};
