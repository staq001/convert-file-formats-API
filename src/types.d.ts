export type options = {
  pdfId: string;
  name: string;
  extension: string;
};

export interface PDFtoWordService {
  uploadPDF: (details: options) => Promsie<void>;

  getPDF: (pfdId: string) => Promise<Pdf | undefined>;

  getTextFile: () => Promise<void>;

  getWordFile: () => Promise<void>;
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
  hasTextFile?: boolean;
}
