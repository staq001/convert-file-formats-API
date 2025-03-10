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
const DL = __importStar(require("../controllers/download.controllers"));
const router = (0, express_1.Router)();
exports.router = router;
// downlaod a compressed PDF file
router.get("/api/download-file/:pdfId/compress", DL.compressPDF);
// download a jpeg file
router.get("/api/download-file/:pdfId/jpeg", DL.pdftoJpeg);
// download a html file
router.get("/api/download-file/:pdfId/html", DL.pdfToHtml);
// download a .txt file
router.get("/api/download-file/:pdfId/txt", DL.pdfToTxt);
// download a merged PDF file
router.get("/api/download-file/:firstPdfId/:secondPdfId/pdf", DL.mergePDF);
