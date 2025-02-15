import { Router } from "express";
import * as PDF from "../controllers/pdftoword.controllers";

const router = Router();

// upload PDF file.
router.post("/api/upload-pdf/", PDF.uploadPDF);

// convert PDF to Word
router.put("/api/convert-pdf-to-word/:pdfId", PDF.convertPDFToWord as any);

// convert PDF to PNG
router.put("/api/convert-pdf-to-image/:pdfId", PDF.convertPDFToPNG as any);

// compress PDF
router.put("/api/compress-pdf/:pdfId", PDF.compressPDF as any);

router.put("/api/merge-pdfs/:pdfId-1/:pdfId-2", PDF.mergePF as any);

export { router };
