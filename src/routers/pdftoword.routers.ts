import { Router } from "express";
import * as PDF from "../controllers/pdftoword.controllers";

const router = Router();

// upload PDF file.
router.post("/api/upload-pdf/", PDF.uploadFile);

// convert PDF to Word
router.put("/api/convert-pdf-to-word/:pdfId", PDF.convertPDFToWord as any);

// convert PDF to PNG
router.put("/api/convert-pdf-to-image/:pdfId", PDF.convertPDFToPNG as any);

// compress PDF
router.put("/api/compress-pdf/:pdfId", PDF.compressPDF as any);

// merge two PDF files
router.put("/api/merge-pdfs/:firstPdfId/:secondPdfId", PDF.mergePF as any);

// get a specific pdf file
router.get("/api/get-pdf-file", PDF.getPDF as any);

export { router };
