import { Request, Response } from "express";
import { util } from "../../lib/util";
import * as libreoffice from "../../lib/libreoffice";
import { WordService } from "../services/word.services";
const wordService = new WordService();

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
    console.log(docx);

    const inputFilePath = `./storage/${docx.docxId}/original.${docx.extension}`;
    const outputDirectory = `./storage/${docx.docxId}`;

    await libreoffice.convertDocxToHTML(inputFilePath, outputDirectory);
    res.status(200).json({
      status: "success",
      message: "Docx File converted to HTML successfully",
    });
  } catch (e) {
    if (docx) {
      await util.deleteFile(`./storage/${docx.docxId}/original.html`);
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
    const inputFilePath = `./storage/${docx.docxId}/original.${docx.extension}`;
    const outputDirectory = `./storage/${docx.docxId}`;

    await libreoffice.convertDocxToPDF(inputFilePath, outputDirectory);
    res.status(200).json({
      status: "success",
      message: "Docx File converted to PDF successfully",
    });
  } catch (e) {
    if (docx) {
      await util.deleteFile(`./storage/${docx.docxId}/original.pdf}`);
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
