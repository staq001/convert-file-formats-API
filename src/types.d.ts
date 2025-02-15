export type options = {
  pdfId: string;
  name: string;
  extension: string;
};

export interface PDFtoWordService {
  uploadPDF: (details: options) => Promsie<void>;

  getPDF: (pfdId: string) => Promise<Pdf | undefined>;
}

export interface DocxService {
  uploadDocxFile: (details: optionsDocx) => Promsie<void>;

  getDocxFile: (pfdId: string) => Promise<Docx | undefined>;
}

export interface Util {
  deleteFile: (path: string) => Promise<void>;
  deleteFolder: (path: string) => Promise<void>;
}

export interface Pdf {
  id: number;
  pdfId: string;
  name: string;
  extension: string;
}

export interface Docx {
  id: number;
  docxId: string;
  name: string;
  extension: string;
  hasTextFile?: boolean;
}

export type optionsDocx = {
  docxId: string;
  name: string;
  extension: string;
};
