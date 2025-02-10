import * as fs from "node:fs";
import type { Pdf } from "./types";

const pdfPath = "./data/pdf";

export class DB {
  pdf: Pdf[];

  constructor() {
    this.pdf = JSON.parse(fs.readFileSync(pdfPath, "utf-8"));
  }

  update() {
    this.pdf = JSON.parse(fs.readFileSync(pdfPath, "utf-8"));
  }

  save() {
    fs.writeFileSync(pdfPath, JSON.stringify(this.pdf));
  }
}
