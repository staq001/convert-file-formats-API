import { Router, Request, Response, NextFunction } from "express";
import {
  uploadPDF,
  convertPDFToPNG,
  convertPDFToWord,
} from "../controllers/pdftoword.controllers";

const router = Router();

// upload PDF file.
router.post("/api/upload-pdf/", uploadPDF);

// convert PDF to Word
router.put("/api/convert-pdf-to-word/", convertPDFToWord);

// convert PDF to PNG
router.put("/api/convert-pdf-to-image/", convertPDFToPNG);

export { router };
