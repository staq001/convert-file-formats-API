import { DB } from "../DB";
import type { PDFtoWordService, options, Pdf } from "../types";

export class PDFToWordService implements PDFtoWordService {
  private db;

  constructor() {
    this.db = new DB();
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
}
