import { DB } from "../DB";
import type { DocxService, Docx, optionsDocx } from "../types";
import { util } from "../../lib/util";
export class WordService implements DocxService {
  private db;

  constructor() {
    this.db = new DB();
  }

  public async uploadDocxFile(details: optionsDocx) {
    // upload to storage and save to artificial DB
    this.db.update();
    this.db.docx.unshift({
      id: this.db.docx.length,
      docxId: details.docxId,
      name: details.name,
      extension: details.extension,
    });
    this.db.save();
  }

  async getDocxFile(docxId: string) {
    // tell the db we have a text file for the just uploaded pdf file.
    this.db.update();
    const docx = this.db.docx.find((docx) => docx.docxId === docxId);
    return docx;
  }
  async deleteDocxAfter5Minutes(pdfId: string) {
    // delete the docx file after 5 minutes
    setTimeout(() => {
      this.db.update();
      const pdfIndex = this.db.pdf.findIndex((pdf) => pdf.pdfId === pdfId);
      if (pdfIndex !== -1) {
        util.deleteFolder(`./storage/${pdfId}`);
        this.db.pdf.splice(pdfIndex, 1);
        this.db.save();
      }
    }, 5 * 60 * 1000);
  }
}
