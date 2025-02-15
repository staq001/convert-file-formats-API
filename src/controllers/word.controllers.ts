import { Request, Response } from "express";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { util } from "../../lib/util";
import * as pandoc from "../../lib/pandoc";
import * as libreoffice from "../../lib/libreoffice";
import * as docx from "../../lib/docx";
import { WordService } from "../services/word.services";
import Path from "node:path";
const wordService = new WordService();

export async function uploadDocx(req: Request, res: Response) {
  const specifiedFileName = req.headers.filename;

  const extension =
    typeof specifiedFileName === "string"
      ? path.extname(specifiedFileName).substring(1).toLowerCase()
      : "docx";
  const name =
    typeof specifiedFileName === "string"
      ? path.parse(specifiedFileName).name
      : "unspecified name";
  const docxId = crypto.randomBytes(4).toString();

  try {
    await fs.mkdir(`./storage/${docxId}`);
    const fullPath = `./storage/${docxId}/original.${extension}`;
    const file = await fs.open(fullPath, "w");
    const fileStream = file.createWriteStream();

    await pipeline(req, fileStream);
    await wordService.uploadDocxFile({ extension, docxId, name });

    res.status(201).json({
      status: "success",
      message: "The file was successfully uploaded!",
    });
  } catch (e) {
    // Delete the folder
    await util.deleteFolder(`./storage/${docxId}`);
    res.status(500).json({
      status: "failed!",
      message: `Operation failed! ${e}`,
    });
  }
}

export async function convertDocxToHTML(
  req: Request<{ docxId: string }>,
  res: Response
) {
  const { docxId } = req.params;
  const docx = await wordService.getDocxFile(docxId);

  try {
    if (!docx) {
      return res.status(404).json({
        status: "failed",
        message: "Docx file not found!",
      });
    }
    const inputFilePath = Path.join(
      __dirname,
      `./storage/${docx.docxId}/original.${docx.extension}`
    );
    const outputFilePath = Path.join(
      __dirname,
      `./storage/${docx.docxId}/original.html`
    );

    await pandoc.convertDocxToHTML(inputFilePath, outputFilePath);
  } catch (e) {
    if (docx) {
      await util.deleteFile(
        Path.join(
          __dirname,
          `./storage/${docx.docxId}/original.${docx.extension}`
        )
      );
      await util.deleteFile(
        Path.join(__dirname, `./storage/${docx.docxId}/original.html`)
      );
      res.status(500).json({
        status: "failed",
        message: "Operation failed!",
      });
    }
  }
}

export async function convertDocxToPDF(
  req: Request<{ docxId: string }>,
  res: Response
) {
  const { docxId } = req.params;
  const docx = await wordService.getDocxFile(docxId);

  try {
    if (!docx) {
      return res.status(404).json({
        status: "failed",
        message: "Docx file not found!",
      });
    }
    const inputFilePath = Path.join(
      __dirname,
      `./storage/${docx.docxId}/original.${docx.extension}`
    );

    await libreoffice.convertDocxToPDF(inputFilePath);
  } catch (e) {
    if (docx) {
      await util.deleteFile(
        Path.join(
          __dirname,
          `./storage/${docx.docxId}/original.${docx.extension}`
        )
      );
      res.status(500).json({
        status: "failed",
        message: "Operation failed!",
      });
    }
  }
}

export async function getDocx(req: Request<{ docxId: string }>, res: Response) {
  const { docxId } = req.params;

  const docx = wordService.getDocxFile(docxId);

  try {
    if (!docx) {
      return res.status(404).json({
        status: "Failed",
        message: "PDF not found",
      });
    }

    res.status(200).send(docx);
  } catch (e) {
    res.status(500).send(`An error occured: ${e}`);
  }
}
