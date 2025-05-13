import { DB } from "../DB";
import type { PDFtoWordService, options, Pdf } from "../types";
import { util } from "../../lib/util";

export class PDFToWordService implements PDFtoWordService {
  private db = new DB();

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
    // delete the pdf file after 5 minutes
    setTimeout(() => {
      this.db.update();
      const pdfIndex = this.db.pdf.findIndex((pdf) => pdf.pdfId === pdfId);
      if (pdfIndex !== -1) {
        util.deleteFolder(`./storage/${pdfId}`);
        this.db.pdf.splice(pdfIndex, 1);
        this.db.save();
      }
    }, 10 * 60 * 1000);
  }
}
