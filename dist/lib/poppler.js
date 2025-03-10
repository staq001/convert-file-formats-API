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
exports.makeHTML = exports.mergePDF = exports.makeImage = exports.makeText = void 0;
const node_child_process_1 = require("node:child_process");
// convert filename.pdf to plain text and print to stdout.
// pdftotext filename.pdf -- command
// Convert input.pdf to plain text and save it as output.txt:
// pdftotext input.pdf output.txt
// Convert filename.pdf to plain text and preserve the layout:
// pdftotext -layout filename.pdf
const makeText = (fullPath, textPath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const poppler = (0, node_child_process_1.spawn)("pdftotext", ["-layout", fullPath, textPath]);
        poppler.on("close", (code) => {
            if (code === 0) {
                resolve(`Poppler exited with this code ${code}`);
            }
            else {
                reject(`Poppler exited with this code ${code}`);
            }
        });
        poppler.on("error", (err) => {
            reject(err);
        });
    });
});
exports.makeText = makeText;
const makeImage = (inputFilePath, outputFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const poppler = (0, node_child_process_1.spawn)("pdftoppm", [inputFilePath, outputFilePath, "-png"]);
        poppler.on("close", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(`Poppler exited with code ${code}`);
            }
        });
        poppler.on("error", (err) => {
            reject(err);
        });
    });
});
exports.makeImage = makeImage;
const mergePDF = (inputFilePath, secondFilePath, finalDestination) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const poppler = (0, node_child_process_1.spawn)("pdfunite", [
            inputFilePath,
            secondFilePath,
            finalDestination,
        ]);
        poppler.on("close", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(`Poppler exited with code ${code}`);
            }
        });
        poppler.on("error", (err) => {
            reject(err);
        });
    });
});
exports.mergePDF = mergePDF;
const makeHTML = (inputFilePath, secondFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const poppler = (0, node_child_process_1.spawn)("pdftohtml", [inputFilePath, secondFilePath]);
        poppler.on("close", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(`Poppler exited with code ${code}`);
            }
        });
        poppler.on("error", (err) => {
            reject(err);
        });
    });
});
exports.makeHTML = makeHTML;
