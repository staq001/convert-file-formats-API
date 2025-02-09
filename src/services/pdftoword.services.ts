import { DB } from "../DB";
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

  async getTextFile() {}

  async getWordFile() {}
}
