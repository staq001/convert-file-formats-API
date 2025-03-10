import { Router } from "express";
import * as DL from "../controllers/download.controllers";

const router = Router();

// downlaod a compressed PDF file
router.get("/api/download-file/:pdfId/compress", DL.compressPDF as any);

// download a jpeg file
router.get("/api/download-file/:pdfId/jpeg", DL.pdftoJpeg as any);

// download a html file
router.get("/api/download-file/:pdfId/html", DL.pdfToHtml as any);

// download a .txt file
router.get("/api/download-file/:pdfId/txt", DL.pdfToTxt as any);

// download a merged PDF file
router.get(
  "/api/download-file/:firstPdfId/:secondPdfId/pdf",
  DL.mergePDF as any
);
export { router };
