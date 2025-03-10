"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const PDF = __importStar(require("../controllers/pdftoword.controllers"));
const router = (0, express_1.Router)();
exports.router = router;
// upload file (docx/pdf).
router.post("/api/upload-file/", PDF.uploadFile);
// convert PDF to Word
router.put("/api/convert-pdf-to-word/:pdfId", PDF.convertPDFToWord);
// convert PDF to .txt
router.put("/api/convert-pdf-to-text/:pdfId", PDF.convertPDFToText);
// convert PDF to HTML
router.put("/api/convert-pdf-to-html/:pdfId", PDF.convertPDFToHTML);
// convert PDF to PNG
router.put("/api/convert-pdf-to-jpeg/:pdfId", PDF.convertPDFToPNG);
// compress PDF
router.put("/api/compress-pdf/:pdfId", PDF.compressPDF);
// merge two PDF files
router.put("/api/merge-pdfs/:firstPdfId/:secondPdfId", PDF.mergePF);
// get a specific pdf file
router.get("/api/get-pdf-file", PDF.getPDF);
