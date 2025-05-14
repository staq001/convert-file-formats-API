import { DB } from "../DB";
import type { PDFtoWordService, options, Pdf } from "../types";
import { util } from "../../lib/util";
import fs from "fs/promises";

export class PDFToWordService implements PDFtoWordService {
  private db;

  constructor() {
    this.db = new DB();

    // if server restarts, we need to restart delete operations that never completed.
    this.db.pdf.forEach((pdf) => {
      if (this.db.pdf.length >= 0) {
        const pdfId = pdf.pdfId;
        this.deletePDFAfter10Minutes(pdfId);
      }
      return;
    });
  }

  public async uploadPDF(details: options) {
    // upload to storage and save to artificial DB
    this.db.update();
    this.db.pdf.unshift({
      id: this.db.pdf.length,
      pdfId: details.pdfId,
      name: details.name,
      extension: details.extension,
    });
    this.db.save();
  }

  async getPDF(pdfId: string) {
    // tell the db we have a text file for the just uploaded pdf file.
    this.db.update();
    const pdf = this.db.pdf.find((pdf) => pdf.pdfId === pdfId);

    this.db.save();
    return pdf;
  }
  async deletePDFAfter10Minutes(pdfId: string) {
    // delete the pdf file after 10 minutes
    setTimeout(async () => {
      this.db.update();
      const pdfIndex = this.db.pdf.findIndex((pdf) => pdf.pdfId === pdfId);
      if (pdfIndex !== -1) {
        this.db.pdf.splice(pdfIndex, 1);
        this.db.save();

        // delete the folder
        try {
          const folderPath = `./storage/${pdfId}`;
          const stat = await fs.stat(folderPath);
          if (stat.isDirectory()) {
            await util.deleteFolder(folderPath);
          }
        } catch (e: any) {
          if (e.code === "ENOENT") {
            console.error(`Folder doesn't exist: ${e.message}`);
          } else {
            console.error(`Error deleting folder: ${e.message}`);
          }
        }
      }
    }, 3 * 60 * 1000);
  }
}
