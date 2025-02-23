import { Request, Response } from "express";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { util } from "../../lib/util";
import { PDFToWordService } from "../services/pdftoword.services";
import * as poppler from "../../lib/poppler";
import * as docx from "../../lib/docx";
import Path from "node:path";
import * as gs from "../../lib/ghostscript";
import { WordService } from "../services/word.services";

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

  let id = crypto.randomBytes(4).toString();

  try {
    switch (extension) {
      case "pdf":
        const pdfId = id;
        await fs.mkdir(`./storage/${pdfId}`);
        const fullPath = `./storage/${pdfId}/original.${extension}`;
        const file = await fs.open(fullPath, "w");
        const fileStream = file.createWriteStream();

        await pipeline(req, fileStream);
        await PDFtoWordService.uploadPDF({ extension, pdfId, name });
        break;

      case "docx":
        const docxId = id;

        await fs.mkdir(`./storage/${docxId}`);
        const originalPath = `./storage/${docxId}/original.${extension}`;
        const docxFile = await fs.open(originalPath, "w");
        const docxFileStream = docxFile.createWriteStream();

        await pipeline(req, docxFileStream);
        await wordService.uploadDocxFile({ extension, docxId, name });
    }

    res.status(201).json({
      status: "success",
      message: "The file was successfully uploaded!",
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

    const originalPath = Path.join(
      __dirname,
      `./storage/${pdf.pdfId}/original.${pdf.extension}`
    );
    const textPath = Path.join(
      __dirname,
      `./storage/${pdf.pdfId}/original.txt`
    );

    await poppler.makeText(originalPath, textPath);

    const targetWordPath = Path.join(
      __dirname,
      `./storage/${pdf.pdfId}/original.docx`
    );
    await docx.convertTextToDocx(textPath, targetWordPath);

    res.status(200).json({
      status: "success",
      message: "Word document made successfully!",
    });
  } catch (e) {
    if (pdf) {
      await util.deleteFile(
        Path.join(__dirname, `./storage/${pdf.pdfId}/original.txt`)
      );
      await util.deleteFile(
        Path.join(__dirname, `./storage/${pdf.pdfId}/original.docx`)
      );
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

    await fs.mkdir(`./storage/${pdf.pdfId}/pdf-image-folder/`);

    const originalPath = Path.join(
      __dirname,
      `./storage/${pdf.pdfId}/original.${pdf.extension}`
    );
    const imagePath = Path.join(
      __dirname,
      `./storage/${pdf.pdfId}/pdf-image-folder/original.png`
    );

    await poppler.makeImage(originalPath, imagePath);

    res.status(200).json({
      status: "Success",
      message: "PDF converted to PNG successfully.",
    });
  } catch (e) {
    if (pdf) {
      await util.deleteFolder(
        Path.join(__dirname, `./storage/${pdf.pdfId}/pdf-image-folder/`)
      );
      await util.deleteFile(
        Path.join(
          __dirname,
          `./storage/${pdf.pdfId}/pdf-image-folder/original.png`
        )
      );
    }
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

    const originalPath = Path.join(
      __dirname,
      `./storage/${pdf.pdfId}/original.${pdf.extension}`
    );
    const destination = Path.join(
      __dirname,
      `./storage/${pdf.pdfId}/original-compressed.pdf`
    );

    await gs.compressPDF(originalPath, destination);

    res.status(200).json({
      status: "Success",
      message: "PDF file compressed successfully!",
    });
  } catch (e) {
    if (pdf) {
      await util.deleteFolder(
        Path.join(__dirname, `./storage/${pdf.pdfId}/pdf-image-folder/`)
      );
      await util.deleteFile(
        Path.join(
          __dirname,
          `./storage/${pdf.pdfId}/pdf-image-folder/original.png`
        )
      );
    }
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

    const firstFilePath = Path.join(
      __dirname,
      `./storage/${first.pdfId}/original.${first.extension}`
    );
    const secondFilePath = Path.join(
      __dirname,
      `./storage/${second.pdfId}/original.${second.extension}`
    );

    const mergedFileDestination = Path.join(
      __dirname,
      `./storage/${first.pdfId}-${second.pdfId}/merged.pdf`
    );

    await poppler.mergePDF(
      firstFilePath,
      secondFilePath,
      mergedFileDestination
    );

    res.status(200).json({
      status: "Success",
      message: "PDF file merged successfully!",
    });
  } catch (e) {
    if (first && second) {
      await util.deleteFile(
        Path.join(
          __dirname,
          `./storage/${first.pdfId}-${second.pdfId}/merged.pdf/`
        )
      );
    }
    res.status(500).json({
      status: "Failed",
      message: `Operation Failed ${e}`,
    });
  }
}

export async function getPDF(req: Request<{ pdfId: string }>, res: Response) {
  const { pdfId } = req.params;

  const pdf = PDFtoWordService.getPDF(pdfId);

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
