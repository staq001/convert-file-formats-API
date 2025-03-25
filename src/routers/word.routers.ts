import { Router } from "express";
import * as Docx from "../controllers/word.controllers";

const router = Router();

// convert Docx to HTML
router.put("/api/convert-word-to-html/:docxId", Docx.convertDocxToHTML as any);

// convert Docx to PDF
router.put("/api/convert-docx-to-pdf/:docxId", Docx.convertDocxToPDF as any);

// get docx file
router.get("/api/get-docx-file/:docxId", Docx.getDocx as any);

export { router };
