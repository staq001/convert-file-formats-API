import { Request, Response } from "express";
import fs from "node:fs/promises";
import { PDFToWordService } from "../services/pdftoword.services";
import { WordService } from "../services/word.services";
import archiver from "archiver";

const wordService = new WordService();
const PDFtoWordService = new PDFToWordService();

export async function compressPDF(
  req: Request<{ pdfId: string }>,
  res: Response
) {
  const { pdfId } = req.params;

  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res.status(404).json({
        status: "Failed",
        message: "File not found",
      });
    }

    if (pdf) {
      const customName = pdf.name ? pdf.name : "file";

      await fs.access(
        `./storage/${pdf.pdfId}/original-compressed.pdf`,
        fs.constants.F_OK
      );

      res.download(
        `./storage/${pdf.pdfId}/original-compressed.pdf`,
        `${customName}.pdf`
      );
    }
  } catch (e) {
    res.status(500).send(`An error occured: ${e}`);
  }
}

export async function pdftoJpeg(
  req: Request<{ pdfId: string }>,
  res: Response
) {
  const { pdfId } = req.params;

  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res.status(404).json({
        status: "Failed",
        message: "File not found",
      });
    }

    if (pdf) {
      const customName = pdf.name ? pdf.name : "file";
      const folder = `./storage/${pdf.pdfId}/pdf-image-folder/`;

      const folderExists = await fs.lstat(folder);

      if (!folderExists) {
        return res.status(404).json({
          status: "Failed",
          message: "Folder not found",
        });
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${customName}.zip`
      );

      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(res);

      archive.directory(folder, false);
      archive.finalize();
    }
  } catch (e) {
    res.status(500).send(`An error occured: ${e}`);
  }
}

export async function pdfToHtml(
  req: Request<{ pdfId: string }>,
  res: Response
) {
  const { pdfId } = req.params;

  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res.status(404).json({
        status: "Failed",
        message: "File not found",
      });
    }

    if (pdf) {
      const customName = pdf.name ? pdf.name : "file";
      const folder = `./storage/${pdf.pdfId}/html/`;

      const folderExists = await fs.lstat(folder);

      if (!folderExists) {
        return res.status(404).json({
          status: "Failed",
          message: "Folder not found",
        });
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${customName}.zip`
      );

      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(res);

      archive.directory(folder, false);
      archive.finalize();
    }
  } catch (e) {
    res.status(500).send(`An error occured: ${e}`);
  }
}

export async function pdfToTxt(req: Request<{ pdfId: string }>, res: Response) {
  const { pdfId } = req.params;

  const pdf = await PDFtoWordService.getPDF(pdfId);

  try {
    if (!pdf) {
      return res.status(404).json({
        status: "Failed",
        message: "File not found",
      });
    }

    if (pdf) {
      const customName = pdf.name ? pdf.name : "file";

      await fs.access(`./storage/${pdf.pdfId}/original.txt`, fs.constants.F_OK);

      res.download(`./storage/${pdf.pdfId}/original.txt`, `${customName}.txt`);
    }
  } catch (e) {
    res.status(500).send(`An error occured: ${e}`);
  }
}

export async function mergePDF(
  req: Request<{ firstPdfId: string; secondPdfId: string }>,
  res: Response
) {
  const { firstPdfId, secondPdfId } = req.params;

  const first = await PDFtoWordService.getPDF(firstPdfId);
  const second = await PDFtoWordService.getPDF(secondPdfId);

  try {
    if (!first || !second) {
      return res.status(404).json({
        status: "Failed",
        message: "File not found",
      });
    }

    if (first && second) {
      const customName = first.name
        ? second.name
          ? `${first.name}-${second.name}`
          : "file"
        : "file";

      await fs.access(
        `./storage/${first.pdfId}-${second.pdfId}/${first.name}-${second.name}-merged.pdf`,
        fs.constants.F_OK
      );

      res.download(
        `./storage/${first.pdfId}-${second.pdfId}/${first.name}-${second.name}-merged.pdf`,
        `${customName}.pdf`
      );
    }
  } catch (e) {
    res.status(500).send(`An error occured: ${e}`);
  }
}
