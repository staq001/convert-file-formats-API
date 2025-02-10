import * as fs from "node:fs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export async function convertTextToDocx(
  inputFilePath: string,
  outputFilePath: string
) {
  const text = fs.readFileSync(inputFilePath, "utf-8");

  // // create a document.
  // const doc = new Document({
  //   sections: [],
  // });

  const lines = text.split("\n");

  const paragraphs: Paragraph[] = lines.map((line, index) => {
    if (index < 2 && line === line.toUpperCase()) {
      return new Paragraph({
        text: line,
        heading: HeadingLevel.HEADING_1,
        alignment: "center",
      });
    } else if (line === line.toUpperCase()) {
      return new Paragraph({
        children: [new TextRun(line)],
        alignment: "center",
      });
    } else {
      return new Paragraph({
        children: [new TextRun(line)],
        alignment: "start",
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(outputFilePath, buffer);
  });
}
