type options = {
  pdfId: string;
  name: string;
  extension: string;
};

interface PDFtoWordService {
  uploadPDF: (details: options) => {};

  getTextFile: () => {};

  getWordFile: () => {};
}
