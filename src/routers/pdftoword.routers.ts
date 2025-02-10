import { Router, Request, Response, NextFunction } from "express";
import { uploadPDF } from "../controllers/pdftoword.controllers";

const router = Router();

router.post("/api/upload-pdf/", uploadPDF);

export { router };
