"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDocxToPDF = convertDocxToPDF;
exports.convertPDFToDocx = convertPDFToDocx;
exports.convertDocxToHTML = convertDocxToHTML;
const node_child_process_1 = require("node:child_process");
function convertDocxToPDF(inputFilePath, outputDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const libreoffice = (0, node_child_process_1.spawn)("libreoffice", [
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
                }
                else {
                    reject(`LibreOffice exited with ${code}`);
                }
            });
            libreoffice.on("error", (error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    });
}
function convertPDFToDocx(originalPath, outputDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const libreoffice = (0, node_child_process_1.spawn)("libreoffice", [
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
                }
                else {
                    reject(`libreoffice exited with code ${code}`);
                }
            });
            libreoffice.on("error", (error) => {
                reject(error);
            });
        });
    });
}
function convertDocxToHTML(originalPath, outputDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const libreoffice = (0, node_child_process_1.spawn)("libreoffice", [
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
                }
                else {
                    reject(`libreoffice exited with code ${code}`);
                }
            });
            libreoffice.on("error", (error) => {
                reject(error);
            });
        });
    });
}
