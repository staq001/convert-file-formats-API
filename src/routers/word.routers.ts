import { Router } from "express";
import * as Docx from "../controllers/word.controllers";

const router = Router();

// upload PDF file.
router.post("/api/upload-docx/", Docx.uploadDocx);

// convert Docx to HTML
router.put("/api/convert-word-to-html/:docxId", Docx.convertDocxToHTML as any);

// convert Docx to PDF
router.put("/api/convert-docx-to-pdf/:docxId", Docx.convertDocxToPDF as any);

// get docx file
router.get("/api/get-docx-file", Docx.getDocx as any);

export { router };
