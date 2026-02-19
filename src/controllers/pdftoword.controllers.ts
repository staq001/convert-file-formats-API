import { Request, Response } from "express";
import path from "node:path";
import cluster from "node:cluster";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import process from "node:process";
import { pipeline } from "node:stream/promises";
import { util } from "../../lib/util";
import { PDFToWordService } from "../services/pdftoword.services";
import * as libreoffice from "../../lib/libreoffice";
import { JobQueue } from "../../lib/jobQueue";
import { WordService } from "../services/word.services";

const job = new JobQueue();
const wordService = new WordService();
const PDFtoWordService = new PDFToWordService();

export async function uploadFile(req: Request, res: Response) {
  const specifiedFileName = req.headers.filename;

  const extension =
    typeof specifiedFileName === "string"
      ? path.extname(specifiedFileName).substring(1).toLowerCase()
      : undefined;
  const name =
    typeof specifiedFileName === "string"
      ? path.parse(specifiedFileName).name
      : "unspecified name";

  let id = crypto.randomBytes(4).toString("hex");

  try {
    switch (extension) {
      case "pdf":
        const pdfId = id;
        await fs.mkdir(`./storage/${pdfId}`, { recursive: true });
        const fullPath = `./storage/${pdfId}/original.${extension}`;
        const file = await fs.open(fullPath, "w");
        const fileStream = file.createWriteStream();

        await pipeline(req, fileStream);

        await file.close();
        await PDFtoWordService.uploadPDF({ extension, pdfId, name });
        break;

      case "docx":
        const docxId = id;

        await fs.mkdir(`./storage/${docxId}`, { recursive: true });
        const originalPath = `./storage/${docxId}/original.${extension}`;
        const docxFile = await fs.open(originalPath, "w");
        const docxFileStream = docxFile.createWriteStream();

        await pipeline(req, docxFileStream);
        docxFile.close();
        await wordService.uploadDocxFile({ extension, docxId, name });
        break;
    }

    res.status(201).json({
      status: "success",
      message: "The file was successfully uploaded!",
      id,
      fileType: extension,
    });
  } catch (e) {
    // Delete the folder
    await util.deleteFolder(`./storage/${id}`);
    res.status(500).json({
      status: "failed!",
      message: `Operation failed! ${e}`,
    });
  }
}

export async function convertPDFToText(
  req: Request<{ pdfId: string }>,
  res: Response
) {
  const { pdfId } = req.params;
  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res
        .status(404)
        .json({ status: "failed", message: "PDF file not found" });
    }

    if (cluster.isPrimary) {
      job.enqueue({
        type: "convertPdf",
        id: pdf.pdfId,
        file_extension: "pdf",
        dest_extension: "txt",
        name: pdf.name,
      });
    } else {
      if (process.send)
        process.send({
          type: "convertPdf",
          id: pdf.pdfId,
          file_extension: "pdf",
          dest_extension: "txt",
          name: pdf.name,
        });
    }
    await PDFtoWordService.deletePDFAfter10Minutes(pdf.pdfId);
    res.status(200).json({
      status: "success",
      message: ".TXT file made successfully!",
    });
  } catch (e) {
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}
export async function convertPDFToHTML(
  req: Request<{ pdfId: string }>,
  res: Response
) {
  const { pdfId } = req.params;
  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res
        .status(404)
        .json({ status: "failed", message: "PDF file not found" });
    }

    if (cluster.isPrimary) {
      job.enqueue({
        type: "convertPdf",
        id: pdf.pdfId,
        file_extension: "pdf",
        dest_extension: "html",
        name: pdf.name,
      });
    } else {
      if (process.send)
        process.send({
          type: "convertPdf",
          id: pdf.pdfId,
          file_extension: "pdf",
          dest_extension: "html",
          name: pdf.name,
        });
    }
    await PDFtoWordService.deletePDFAfter10Minutes(pdf.pdfId);
    res.status(200).json({
      status: "success",
      message: "HTML file made successfully!",
    });
  } catch (e) {
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}

export async function convertPDFToWord(
  req: Request<{ pdfId: string }>,
  res: Response
) {
  const { pdfId } = req.params;
  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res
        .status(404)
        .json({ status: "failed", message: "PDF file not found" });
    }
    const originalPath = `./storage/${pdf.pdfId}/original.${pdf.extension}`;
    const outputDirectory = `./storage/${pdf.pdfId}/`;

    await libreoffice.convertPDFToDocx(originalPath, outputDirectory);

    res.status(200).json({
      status: "success",
      message: "Word document made successfully!",
    });
  } catch (e) {
    if (pdf) {
      await util.deleteFolder(`./storage/${pdf.pdfId}`);
    }
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}

export async function convertPDFToPNG(
  req: Request<{ pdfId: string }>,
  res: Response
): Promise<any> {
  const { pdfId } = req.params;
  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res
        .status(404)
        .json({ status: "failed", message: "PDF file not found" });
    }

    if (cluster.isPrimary) {
      job.enqueue({
        type: "convertPdf",
        id: pdf.pdfId,
        file_extension: "pdf",
        dest_extension: "png",
        name: pdf.name,
      });
    } else {
      (process as any).send({
        type: "convertPdf",
        id: pdf.pdfId,
        file_extension: "pdf",
        dest_extension: "png",
        name: pdf.name,
      });
    }

    await PDFtoWordService.deletePDFAfter10Minutes(pdf.pdfId);
    console.log("executed");
    res.status(200).json({
      status: "Success",
      message: "PDF converted to PNG successfully.",
    });
  } catch (e) {
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}

export async function compressPDF(
  req: Request<{ pdfId: string }>,
  res: Response
) {
  const { pdfId } = req.params;
  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res
        .status(404)
        .json({ status: "failed", message: "PDF file not found" });
    }

    if (cluster.isPrimary) {
      job.enqueue({
        type: "compress",
        id: pdf.pdfId,
        file_extension: "pdf",
        name: pdf.name,
      });
    } else {
      if (process.send)
        process.send({
          type: "compress",
          id: pdf.pdfId,
          file_extension: "pdf",
          name: pdf.name,
        });
    }
    await PDFtoWordService.deletePDFAfter10Minutes(pdf.pdfId);
    res.status(200).json({
      status: "Success",
      message: "PDF file compressed successfully!",
    });
  } catch (e) {
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}

export async function mergePF(
  req: Request<{ firstPdfId: string; secondPdfId: string }>,
  res: Response
) {
  const { firstPdfId, secondPdfId } = req.params;

  const first = await PDFtoWordService.getPDF(firstPdfId);
  const second = await PDFtoWordService.getPDF(secondPdfId);

  try {
    if (!first || !second) {
      return res
        .status(404)
        .json({ status: "failed", message: "PDF files not found" });
    }
    if (cluster.isPrimary) {
      job.enqueue({
        type: "merge",
        id: `${first.pdfId}-${second.pdfId}`,
        file_extension: "pdf",
        name: `${first.name}-${second.name}`,
      });
    } else {
      if (process.send)
        process.send({
          type: "merge",
          id: `${first.pdfId}-${second.pdfId}`,
          file_extension: "pdf",
          name: `${first.name}-${second.name}`,
        });
    }
    await PDFtoWordService.deletePDFAfter10Minutes(first.pdfId);
    await PDFtoWordService.deletePDFAfter10Minutes(second.pdfId);

    res.status(200).json({
      status: "Success",
      message: "PDF files merged successfully!",
    });
  } catch (e) {
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}

export async function getPDF(req: Request<{ pdfId: string }>, res: Response) {
  const { pdfId } = req.params;

  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res.status(404).json({
        status: "Failed",
        message: "PDF not found",
      });
    }

    res.status(200).send(pdf);
  } catch (e) {
    res.status(500).send(`An error occured: ${e}`);
  }
}
