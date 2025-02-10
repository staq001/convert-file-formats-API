import { Request, Response } from "express";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { util } from "../../lib/util";
import { PDFToWordService } from "../services/pdftoword.services";
import * as poppler from "../../lib/poppler";
import * as docx from "../../lib/docx";

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
    await PDFtoWordService.uploadPDF({ extension, pdfId, name });

    res.status(201).json({
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

export async function convertPDFToWord(req: Request, res: Response) {
  const { pdfId } = req.params;
  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (pdf) {
      const fullPath = `./storage/${pdf.pdfId}/original.${pdf.extension}`;
      const textPath = `./storage/${pdf.pdfId}/original.txt`;

      await poppler.makeText(fullPath, textPath);

      const targetWordPath = `./storage/${pdf.pdfId}/original.docx`;
      await docx.convertTextToDocx(textPath, targetWordPath);
    }
    res.status(200).json({
      status: "success",
      message: "Word document made successfully!",
    });
  } catch (e) {
    if (pdf) {
      util.deleteFile(`./storage/${pdf.pdfId}/original.txt`);
      util.deleteFile(`./storage/${pdf.pdfId}/original.docx`);
    }
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}
