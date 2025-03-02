import { DB } from "../DB";
import type { DocxService, Docx, optionsDocx } from "../types";

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
}
