import { Request, Response } from "express";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { util } from "../../lib/util";
import { PDFToWordService } from "../services/pdftoword.services";

const PDFtoWordService = new PDFToWordService();

export async function uploadPDF(req: Request, res: Response) {
  const specifiedFileName = req.headers.filename;

  const extension =
    typeof specifiedFileName === "string"
      ? path.extname(specifiedFileName).substring(1).toLowerCase()
      : "pdf";
  const name =
    typeof specifiedFileName === "string"
      ? path.parse(specifiedFileName).name
      : "unspecified name";
  const pdfId = crypto.randomBytes(4).toString();

  try {
    await fs.mkdir(`./storage/${pdfId}`);
    const fullPath = `./storage/${pdfId}/original.${extension}`;
    const file = await fs.open(fullPath, "w");
    const fileStream = file.createWriteStream();

    await pipeline(req, fileStream);
    PDFtoWordService.uploadPDF({ extension, pdfId, name });

    res.status(200).json({
      status: "success",
      message: "The file was successfully uploaded!",
    });
  } catch (e) {
    // Delete the folder
    util.deleteFolder(`./storage/${pdfId}`);
    res.status(500).json({
      status: "failed!",
      message: `Operation failed! ${e}`,
    });
  }
}
