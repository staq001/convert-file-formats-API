import * as fs from "node:fs";

const pdfPath = "./data/pdf";

export class DB {
  pdf;

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

const db = new DB();
