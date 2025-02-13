import * as fs from "node:fs";
import type { Pdf } from "./types";
import type { Docx } from "./types";

export class DB {
  pdfPath = "./data/pdf";
  docxPath = "./data/docx";

  pdf: Pdf[];
  docx: Docx[];

  constructor() {
    this.pdf = JSON.parse(fs.readFileSync(this.pdfPath, "utf-8"));
    this.docx = JSON.parse(fs.readFileSync(this.docxPath, "utf-8"));
  }

  update() {
    this.pdf = JSON.parse(fs.readFileSync(this.pdfPath, "utf-8"));
    this.docx = JSON.parse(fs.readFileSync(this.docxPath, "utf-8"));
  }

  save() {
    fs.writeFileSync(this.pdfPath, JSON.stringify(this.pdf));
    fs.writeFileSync(this.docxPath, JSON.stringify(this.pdf));
  }
}
